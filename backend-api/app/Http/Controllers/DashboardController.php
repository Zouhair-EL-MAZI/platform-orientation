<?php

namespace App\Http\Controllers;

use App\Models\OrientationTest;
use App\Models\Recommendation;
use App\Models\TestAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * GET /api/student/dashboard
     * Returns all data the student dashboard needs in one request.
     */
    public function index(Request $request)
    {
        $user    = $request->user();
        $profile = $user->profile;

        // ── Profile completion ──────────────────────────────────────────────
        $profileFields = ['age', 'education_level', 'bio', 'phone', 'city'];
        $filled        = 0;
        $total         = count($profileFields) + 2; // +2 for interests & preferred_fields

        foreach ($profileFields as $field) {
            if (!empty($profile?->$field)) {
                $filled++;
            }
        }
        if (!empty($profile?->interests))        $filled++;
        if (!empty($profile?->preferred_fields)) $filled++;

        $profileCompletion = $total > 0 ? round(($filled / $total) * 100) : 0;

        // ── Tests completed ─────────────────────────────────────────────────
        // Count distinct tests the user has answered at least one question for
        $testsCompleted = DB::table('test_answers')
            ->join('test_questions', 'test_answers.question_id', '=', 'test_questions.id')
            ->where('test_answers.user_id', $user->id)
            ->distinct('test_questions.test_id')
            ->count('test_questions.test_id');

        $totalActiveTests = OrientationTest::where('status', 'active')->count();

        // ── Recommendations ─────────────────────────────────────────────────
        $recommendations = Recommendation::where('user_id', $user->id)
            ->with(['career.category'])
            ->orderByDesc('match_score')
            ->get();

        $recommendationsCount = $recommendations->count();

        // ── Recent activity ─────────────────────────────────────────────────
        $recentAnswers = TestAnswer::where('user_id', $user->id)
            ->with('question.test')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($a) => [
                'type' => 'test_answer',
                'text' => 'Answered question in: ' . ($a->question?->test?->title ?? 'Test'),
                'time' => $a->created_at->diffForHumans(),
            ]);

        $recentRecs = Recommendation::where('user_id', $user->id)
            ->with('career')
            ->latest()
            ->take(3)
            ->get()
            ->map(fn($r) => [
                'type' => 'recommendation',
                'text' => 'AI recommended: ' . ($r->career?->title ?? 'Career'),
                'time' => $r->created_at->diffForHumans(),
            ]);

        $activity = $recentAnswers->concat($recentRecs)
            ->sortByDesc('time')
            ->values()
            ->take(5);

        // ── Top 3 recommendations for summary ───────────────────────────────
        $topRecommendations = $recommendations->take(3)->map(fn($r) => [
            'career'      => $r->career?->title ?? 'Unknown',
            'category'    => $r->career?->category?->name ?? 'General',
            'match_score' => $r->match_score,
            'analysis'    => $r->ai_analysis,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'name'   => $user->name,
                    'email'  => $user->email,
                    'avatar' => $user->avatar,
                    'role'   => $user->role,
                ],
                'stats' => [
                    'profile_completion'  => $profileCompletion,
                    'tests_completed'     => $testsCompleted,
                    'total_tests'         => $totalActiveTests,
                    'recommendations'     => $recommendationsCount,
                ],
                'top_recommendations' => $topRecommendations,
                'recent_activity'     => $activity->values(),
            ],
        ]);
    }
}
