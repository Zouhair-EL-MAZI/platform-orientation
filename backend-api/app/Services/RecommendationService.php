<?php

namespace App\Services;

use App\Models\Career;
use App\Models\Recommendation;
use App\Models\TestAnswer;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RecommendationService
{
    public function __construct(protected GeminiService $gemini) {}

    /**
     * Generate AI recommendations for a user based on their test answers and profile.
     * Deletes previous recommendations and persists new ones.
     */
    public function generateForUser(User $user): Collection
    {
        // 1. Build user context
        $profile  = $user->profile;
        $answers  = $this->buildAnswerSummary($user);
        $careers  = Career::with('category')->get();

        if ($careers->isEmpty()) {
            throw new \RuntimeException('No careers available in the database.');
        }

        // 2. Build the Gemini prompt
        //
        // IMPORTANT: We do NOT pass real database IDs to Gemini because:
        //   - IDs are auto-incremented and unpredictable (1, 42, 107, etc.)
        //   - Gemini cannot know which IDs exist and invents plausible-looking ones
        //   - array_filter then removes all results → empty recommendations → 422
        //
        // Solution: we pass a stable sequential index (1-based) to Gemini,
        // then map back to the real Career model using that index.
        //
        $careerIndex = []; // index (1-based) → Career model
        $careerList  = $careers->values()->map(function ($c, $i) use (&$careerIndex) {
            $idx               = $i + 1; // 1-based sequential index
            $careerIndex[$idx] = $c;
            return [
                'index'    => $idx,
                'title'    => $c->title,
                'category' => $c->category?->name ?? 'General',
                'skills'   => $c->required_skills ?? [],
            ];
        })->toJson();

        $profileData = json_encode([
            'name'            => $user->name,
            'education_level' => $profile?->education_level ?? 'Not specified',
            'age'             => $profile?->age ?? 'Not specified',
            'interests'       => $profile?->interests ?? [],
            'preferred_fields'=> $profile?->preferred_fields ?? [],
            'bio'             => $profile?->bio ?? '',
            'city'            => $profile?->city ?? '',
        ]);

        $prompt = <<<PROMPT
You are an expert career counselor for Moroccan students. Analyze the student profile and their orientation test responses, then recommend the top 3 most suitable careers from the provided list.

## Student Profile:
{$profileData}

## Test Answers Summary:
{$answers}

## Available Careers (JSON):
{$careerList}

## Instructions:
Return a JSON array of exactly 3 objects. Each object must have:
- "career_index": integer (must be one of the "index" values from the available careers list above)
- "match_score": number between 0 and 100 (percentage compatibility)
- "ai_analysis": string (2–3 sentences explaining why this career fits this student, in English)

Sort by match_score descending. Return ONLY the JSON array, nothing else.

Example format:
[
  {"career_index": 2, "match_score": 92, "ai_analysis": "..."},
  {"career_index": 5, "match_score": 85, "ai_analysis": "..."},
  {"career_index": 9, "match_score": 76, "ai_analysis": "..."}
]
PROMPT;

        // 3. Call Gemini
        $recommendations = $this->gemini->generateJson($prompt);

        if (!is_array($recommendations) || empty($recommendations)) {
            throw new \RuntimeException('AI returned invalid recommendations format.');
        }

        // 4. Map career_index → real Career model (safe: skip any index Gemini invented)
        $maxIndex = count($careerIndex);
        $resolved = [];
        foreach ($recommendations as $rec) {
            $idx = intval($rec['career_index'] ?? 0);
            if ($idx < 1 || $idx > $maxIndex || !isset($careerIndex[$idx])) {
                Log::warning('RecommendationService: Gemini returned unknown career_index', [
                    'career_index' => $idx,
                    'max_index'    => $maxIndex,
                ]);
                continue;
            }
            $resolved[] = [
                'career_id'   => $careerIndex[$idx]->id,
                'match_score' => $rec['match_score'] ?? 50,
                'ai_analysis' => $rec['ai_analysis'] ?? '',
            ];
        }

        if (empty($resolved)) {
            // Gemini returned indices outside our range — log and throw a clear error
            Log::error('RecommendationService: all career_index values were invalid', [
                'raw_recommendations' => $recommendations,
                'max_index'           => $maxIndex,
            ]);
            throw new \RuntimeException(
                'AI returned unrecognized career references. Please try again.'
            );
        }

        $resolved = array_slice($resolved, 0, 3);

        // 5. Persist — delete old then insert new
        DB::transaction(function () use ($user, $resolved) {
            Recommendation::where('user_id', $user->id)->delete();

            foreach ($resolved as $rec) {
                Recommendation::create([
                    'user_id'     => $user->id,
                    'career_id'   => $rec['career_id'],
                    'match_score' => round(floatval($rec['match_score']), 2),
                    'ai_analysis' => $rec['ai_analysis'],
                ]);
            }
        });

        // 6. Return fresh recommendations with relations
        return Recommendation::where('user_id', $user->id)
            ->with(['career.category'])
            ->orderByDesc('match_score')
            ->get();
    }

    private function buildAnswerSummary(User $user): string
    {
        $answers = TestAnswer::where('user_id', $user->id)
            ->with('question.test')
            ->get();

        if ($answers->isEmpty()) {
            return 'No test answers recorded yet.';
        }

        return $answers->map(function ($answer) {
            $q = $answer->question?->question ?? 'Unknown question';
            $a = $answer->answer ?? 'No answer';
            return "Q: {$q}\nA: {$a}";
        })->implode("\n\n");
    }
}
