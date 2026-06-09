<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use App\Services\RecommendationService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function __construct(protected RecommendationService $service) {}

    private function resolveLang(Request $request): string
    {
        $header = $request->header('Accept-Language', 'fr');
        $primary = strtolower(substr($header, 0, 2));
        return in_array($primary, ['ar', 'en']) ? $primary : 'fr';
    }

    /**
     * GET /api/student/recommendations
     * List saved recommendations for the authenticated user.
     */
    public function index(Request $request)
    {
        $recommendations = Recommendation::where('user_id', $request->user()->id)
            ->with(['career.category'])
            ->orderByDesc('match_score')
            ->get()
            ->map(fn($r) => [
                'id'          => $r->id,
                'match_score' => (float) $r->match_score,
                'ai_analysis' => $r->ai_analysis,
                'created_at'  => $r->created_at->toISOString(),
                'career' => [
                    'id'              => $r->career?->id,
                    'title'           => $r->career?->title,
                    'description'     => $r->career?->description,
                    'salary_range'    => $r->career?->salary_range,
                    'required_skills' => $r->career?->required_skills ?? [],
                    'future_scope'    => $r->career?->future_scope,
                    'image'           => $r->career?->image,
                    'category'        => $r->career?->category?->name,
                ],
            ]);

        return response()->json(['success' => true, 'data' => $recommendations]);
    }

    /**
     * POST /api/student/recommendations/generate
     * Trigger AI generation of new recommendations (rate limited to 3/hour).
     */
    public function generate(Request $request)
    {
        $user = $request->user();

        // Block regenerate if no new test submission since last recommendation
        $lastRec = Recommendation::where('user_id', $user->id)->latest()->first();
        if ($lastRec) {
            $lastSubmission = \App\Models\TestSubmission::where('user_id', $user->id)
                ->whereNotNull('completed_at')
                ->latest('completed_at')
                ->first();

            if (!$lastSubmission || $lastSubmission->completed_at <= $lastRec->created_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'You must complete a test before regenerating recommendations.',
                    'blocked' => true,
                ], 422);
            }
        }

        try {
            $lang = $this->resolveLang($request);
            $recommendations = $this->service->generateForUser($user, $lang);

            return response()->json([
                'success' => true,
                'message' => 'Recommendations generated successfully',
                'data'    => $recommendations->map(fn($r) => [
                    'id'          => $r->id,
                    'match_score' => (float) $r->match_score,
                    'ai_analysis' => $r->ai_analysis,
                    'created_at'  => $r->created_at->toISOString(),
                    'career' => [
                        'id'              => $r->career?->id,
                        'title'           => $r->career?->title,
                        'description'     => $r->career?->description,
                        'salary_range'    => $r->career?->salary_range,
                        'required_skills' => $r->career?->required_skills ?? [],
                        'future_scope'    => $r->career?->future_scope,
                        'category'        => $r->career?->category?->name,
                    ],
                ]),
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again.',
            ], 500);
        }
    }
}
