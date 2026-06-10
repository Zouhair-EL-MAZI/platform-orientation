<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use App\Services\RecommendationService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function __construct(protected RecommendationService $service) {}

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

        try {
            $recommendations = $this->service->generateForUser($user);

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
            $message = $e->getMessage();

            // Map known Gemini error types to appropriate HTTP status codes
            $statusCode = match (true) {
                str_contains($message, 'quota')         => 429,  // rate limit / quota
                str_contains($message, 'unavailable')   => 503,  // service down
                str_contains($message, 'Network error') => 503,  // network failure
                default                                 => 422,  // validation / logic error
            };

            \Illuminate\Support\Facades\Log::warning('RecommendationController: generation failed', [
                'user_id' => $request->user()?->id,
                'error'   => $message,
                'status'  => $statusCode,
            ]);

            return response()->json([
                'success' => false,
                'message' => $message,
            ], $statusCode);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('RecommendationController: unexpected error', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again.',
            ], 500);
        }
    }
}
