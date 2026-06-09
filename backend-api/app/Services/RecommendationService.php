<?php

namespace App\Services;

use App\Models\Recommendation;
use App\Models\Career;
use App\Models\TestAnswer;
use App\Models\TestQuestion;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RecommendationService
{
    public function __construct(protected GeminiService $gemini) {}

    public function generateForUser(User $user, string $lang = 'fr'): Collection
    {
        $answers = $this->buildAnswerSummary($user);

        $langInstruction = match($lang) {
            'ar' => 'Respond in Arabic. All field values (title, category, description, institution_type, duration, salary_range, required_skills, future_scope, ai_analysis) must be in Arabic.',
            'en' => 'Respond in English. All field values must be in English.',
            default => 'Respond in French. All field values (title, category, description, institution_type, duration, salary_range, required_skills, future_scope, ai_analysis) must be in French.',
        };

        $prompt = <<<PROMPT
You are a Moroccan academic orientation expert. A student has answered 3 orientation tests covering aptitude, personality, and skills. Your job is to analyze their answers carefully and recommend the 3 most suitable university study paths (filières) available in Morocco.

Student answers grouped by test:

{$answers}

Instructions:
- Read EVERY answer carefully before deciding
- Match the filière to what the student actually said, not generic recommendations
- Only recommend real filières available in Morocco with concrete institutions
- Each recommendation must directly reference 2-3 specific answers that justify it
- Do NOT recommend vague titles like "Chef de Projet" or "Manager"

Return a JSON array of exactly 3 objects sorted by match_score descending:
- "title": specific filière/career (e.g. "Génie Informatique", "Médecine", "Droit des Affaires", "Architecture", "Finance et Comptabilité")
- "category": domain (e.g. "Informatique", "Santé", "Droit", "Architecture", "Finance")
- "description": 1 sentence describing this filière
- "institution_type": real Moroccan schools (e.g. "ENSA / ENSIAS / EMSI", "Faculté de Médecine", "ENCG / Faculté des Sciences Juridiques")
- "duration": study duration (e.g. "5 ans", "Bac+3 à Bac+5")
- "salary_range": realistic Moroccan salary (e.g. "6 000 – 18 000 MAD/mois")
- "required_skills": array of 3-5 key skills
- "future_scope": 1 sentence on job market in Morocco
- "match_score": integer 0-100
- "ai_analysis": 2 sentences citing SPECIFIC answers from the student that justify this recommendation

Return ONLY the JSON array. No markdown, no explanation. {$langInstruction}
PROMPT;

        $results = $this->gemini->generateJson($prompt);

        if (!is_array($results) || empty($results)) {
            throw new \RuntimeException('AI returned invalid recommendations format.');
        }

        $results = array_values(array_slice($results, 0, 3));

        // Persist — delete old then insert new
        DB::transaction(function () use ($user, $results) {
            Recommendation::where('user_id', $user->id)->delete();

            foreach ($results as $rec) {
                // Try to match to an existing career by title, or create inline
                $career = Career::firstOrCreate(
                    ['title' => $rec['title'] ?? 'Unknown'],
                    [
                        'category_id'     => $this->resolveCategoryId($rec['category'] ?? ''),
                        'description'     => $rec['description'] ?? '',
                        'salary_range'    => $rec['salary_range'] ?? '',
                        'required_skills' => $rec['required_skills'] ?? [],
                        'future_scope'    => $rec['future_scope'] ?? '',
                        'image'           => null,
                    ]
                );

                Recommendation::create([
                    'user_id'     => $user->id,
                    'career_id'   => $career->id,
                    'match_score' => round(floatval($rec['match_score'] ?? 0), 2),
                    'ai_analysis' => $rec['ai_analysis'] ?? '',
                ]);
            }
        });

        return Recommendation::where('user_id', $user->id)
            ->with(['career.category'])
            ->orderByDesc('match_score')
            ->get();
    }

    private function resolveCategoryId(string $category): int
    {
        $cat = \App\Models\CareerCategory::firstOrCreate(
            ['name' => $category ?: 'General'],
            ['description' => '']
        );
        return $cat->id;
    }

    private function buildAnswerSummary(User $user): string
    {
        $answers = TestAnswer::where('user_id', $user->id)
            ->with('question.test')
            ->get();

        if ($answers->isEmpty()) {
            return 'No test answers recorded yet.';
        }

        $grouped = $answers->groupBy(fn($a) => $a->question?->test?->title ?? 'General');

        $summary = '';
        foreach ($grouped as $testTitle => $testAnswers) {
            $summary .= "=== {$testTitle} ===\n";
            foreach ($testAnswers as $answer) {
                // Always use the English question (stored in 'question' column)
                $q = $answer->question?->question ?? 'Unknown question';
                $a = $answer->answer ?? 'No answer';
                // Map translated answer back to English option if possible
                $englishAnswer = $this->resolveEnglishAnswer($answer->question, $a);
                $summary .= "Q: {$q}\nA: {$englishAnswer}\n\n";
            }
        }

        return trim($summary);
    }

    private function resolveEnglishAnswer(?TestQuestion $question, string $answer): string
    {
        if (!$question || empty($question->options) || empty($question->options_ar) || empty($question->options_fr)) {
            return $answer;
        }

        // Try to match the answer against AR or FR options and return the EN equivalent
        foreach (['options_ar', 'options_fr'] as $field) {
            $translated = $question->$field ?? [];
            $idx = array_search($answer, $translated);
            if ($idx !== false && isset($question->options[$idx])) {
                return $question->options[$idx];
            }
        }

        return $answer;
    }
}
