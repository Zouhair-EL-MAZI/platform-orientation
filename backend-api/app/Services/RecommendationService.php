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
        $careerList = $careers->map(fn($c) => [
            'id'    => $c->id,
            'title' => $c->title,
            'category' => $c->category?->name ?? 'General',
            'skills' => $c->required_skills ?? [],
        ])->toJson();

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
- "career_id": integer (must be a valid id from the available careers list above)
- "match_score": number between 0 and 100 (percentage compatibility)
- "ai_analysis": string (2–3 sentences explaining why this career fits this student, in English)

Sort by match_score descending. Return ONLY the JSON array, nothing else.

Example format:
[
  {"career_id": 1, "match_score": 92, "ai_analysis": "..."},
  {"career_id": 3, "match_score": 85, "ai_analysis": "..."},
  {"career_id": 7, "match_score": 76, "ai_analysis": "..."}
]
PROMPT;

        // 3. Call Gemini
        $recommendations = $this->gemini->generateJson($prompt);

        if (!is_array($recommendations) || empty($recommendations)) {
            throw new \RuntimeException('AI returned invalid recommendations format.');
        }

        // 4. Validate career IDs against DB
        $validCareerIds = $careers->pluck('id')->toArray();
        $recommendations = array_filter($recommendations, fn($r) => in_array($r['career_id'] ?? null, $validCareerIds));
        $recommendations = array_values(array_slice($recommendations, 0, 3));

        // 5. Persist — delete old then insert new
        DB::transaction(function () use ($user, $recommendations) {
            Recommendation::where('user_id', $user->id)->delete();

            foreach ($recommendations as $rec) {
                Recommendation::create([
                    'user_id'     => $user->id,
                    'career_id'   => $rec['career_id'],
                    'match_score' => round(floatval($rec['match_score'] ?? 0), 2),
                    'ai_analysis' => $rec['ai_analysis'] ?? '',
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
