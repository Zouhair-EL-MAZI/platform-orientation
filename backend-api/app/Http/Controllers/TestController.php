<?php

namespace App\Http\Controllers;

use App\Models\OrientationTest;
use App\Models\TestAnswer;
use App\Models\TestQuestion;
use App\Models\TestSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TestController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/student/tests
    //
    // Changes from original:
    //   + completion_status field: "not_started" | "in_progress" | "completed"
    //   + all_completed bool: true only when all 3 tests are completed
    //   + total_tests int: total number of active tests (always 3)
    //   + completed_count int: how many tests this user has fully completed
    //   Everything else is identical to the original response shape.
    // ─────────────────────────────────────────────────────────────────────────
    public function index(Request $request)
    {
        $user  = $request->user();
        $tests = OrientationTest::where('status', 'active')
            ->withCount('questions')
            ->orderBy('id')   // consistent order: Test 1, Test 2, Test 3
            ->get()
            ->map(function ($test) use ($user) {
                $totalQuestions = $test->questions_count;

                $answeredCount = DB::table('test_answers')
                    ->join('test_questions', 'test_answers.question_id', '=', 'test_questions.id')
                    ->where('test_answers.user_id', $user->id)
                    ->where('test_questions.test_id', $test->id)
                    ->count();

                $isCompleted = $totalQuestions > 0 && $answeredCount >= $totalQuestions;

                // Three-state completion for UI
                $completionStatus = match (true) {
                    $isCompleted              => 'completed',
                    $answeredCount > 0        => 'in_progress',
                    default                   => 'not_started',
                };

                // Score from test_submissions if already submitted
                $submission  = TestSubmission::where('user_id', $user->id)
                    ->where('test_id', $test->id)
                    ->first();

                $test->is_completed      = $isCompleted;
                $test->answered_count    = $answeredCount;
                $test->completion_status = $completionStatus;
                $test->total_score       = $submission?->total_score ?? 0;

                return $test;
            });

        $completedCount = $tests->where('is_completed', true)->count();
        $allCompleted   = $completedCount === $tests->count() && $tests->count() > 0;

        return response()->json([
            'success'         => true,
            'data'            => $tests,
            'completed_count' => $completedCount,
            'total_tests'     => $tests->count(),
            'all_completed'   => $allCompleted,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/student/tests/{id}
    // Unchanged from original — returns test + questions with user_answer.
    // ─────────────────────────────────────────────────────────────────────────
    public function show(Request $request, int $id)
    {
        $test = OrientationTest::where('status', 'active')
            ->with(['questions' => fn ($q) => $q->orderBy('id')])
            ->findOrFail($id);

        $user            = $request->user();
        $existingAnswers = TestAnswer::where('user_id', $user->id)
            ->whereIn('question_id', $test->questions->pluck('id'))
            ->get()
            ->keyBy('question_id');

        $test->questions->each(function ($question) use ($existingAnswers) {
            $answer               = $existingAnswers->get($question->id);
            $question->user_answer = $answer?->answer;
            $question->user_score  = $answer?->score;
        });

        return response()->json(['success' => true, 'data' => $test]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/student/tests/{id}/submit
    //
    // Changes from original:
    //   + Writes/updates a test_submissions row with total_score + completed_at
    //     (the table exists + is migrated but was never written to)
    //   + Returns score_percentage and all_completed in the response
    //   All answer scoring logic is identical to the original.
    // ─────────────────────────────────────────────────────────────────────────
    public function submit(Request $request, int $id)
    {
        $test = OrientationTest::where('status', 'active')->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'answers'               => 'required|array|min:1',
            'answers.*.question_id' => 'required|integer|exists:test_questions,id',
            'answers.*.answer'      => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user           = $request->user();
        $questionIds    = $test->questions()->pluck('id')->toArray();
        $scoreBreakdown = [];

        DB::transaction(function () use ($request, $user, $questionIds, &$scoreBreakdown) {
            foreach ($request->answers as $item) {
                $questionId = (int) $item['question_id'];
                if (!in_array($questionId, $questionIds)) continue;

                $question = TestQuestion::find($questionId);
                $score    = $this->calculateScore($question, $item['answer']);

                TestAnswer::updateOrCreate(
                    ['user_id' => $user->id, 'question_id' => $questionId],
                    ['answer' => $item['answer'], 'score' => $score]
                );

                $scoreBreakdown[$questionId] = $score;
            }
        });

        // Total score for this test
        $totalScore = TestAnswer::where('user_id', $user->id)
            ->whereIn('question_id', $questionIds)
            ->sum('score');

        $maxScore   = $test->questions()->sum('points');
        $percentage = $maxScore > 0 ? round(($totalScore / $maxScore) * 100) : 0;

        // ── Write test_submissions (was missing from the original controller) ──
        TestSubmission::updateOrCreate(
            ['user_id' => $user->id, 'test_id' => $test->id],
            [
                'total_score'     => $totalScore,
                'score_breakdown' => $scoreBreakdown,
                'completed_at'    => now(),
            ]
        );

        // Check if all tests are now completed
        $allTestIds      = OrientationTest::where('status', 'active')->pluck('id')->toArray();
        $completedTestIds = TestSubmission::where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->pluck('test_id')
            ->toArray();

        $allCompleted = !empty($allTestIds)
            && count(array_diff($allTestIds, $completedTestIds)) === 0;

        return response()->json([
            'success'          => true,
            'message'          => 'Test submitted successfully',
            'total_score'      => $totalScore,
            'max_score'        => $maxScore,
            'score_percentage' => $percentage,
            'test_id'          => $test->id,
            'all_completed'    => $allCompleted,   // frontend uses to unlock recommendations
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/student/tests/{id}/results
    // Unchanged from original.
    // ─────────────────────────────────────────────────────────────────────────
    public function results(Request $request, int $id)
    {
        $test = OrientationTest::with('questions')->findOrFail($id);
        $user = $request->user();

        $answers = TestAnswer::where('user_id', $user->id)
            ->whereIn('question_id', $test->questions->pluck('id'))
            ->with('question')
            ->get();

        if ($answers->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No answers found for this test',
            ], 404);
        }

        $totalScore = $answers->sum('score');
        $maxScore   = $test->questions->sum('points');
        $percentage = $maxScore > 0 ? round(($totalScore / $maxScore) * 100) : 0;

        return response()->json([
            'success' => true,
            'data'    => [
                'test'        => $test->only(['id', 'title', 'description', 'category']),
                'total_score' => $totalScore,
                'max_score'   => $maxScore,
                'percentage'  => $percentage,
                'answers'     => $answers->map(fn ($a) => [
                    'question' => $a->question?->question,
                    'answer'   => $a->answer,
                    'score'    => $a->score,
                ]),
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private: scoring (unchanged logic from original)
    // ─────────────────────────────────────────────────────────────────────────
    private function calculateScore(TestQuestion $question, string $answer): int
    {
        if ($question->type === 'single_choice' && !empty($question->options)) {
            return in_array($answer, $question->options) ? $question->points : 0;
        }

        // text / open_text / scale: award points for any non-empty answer
        return !empty(trim($answer)) ? $question->points : 0;
    }
}
