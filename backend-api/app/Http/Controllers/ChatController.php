<?php

namespace App\Http\Controllers;

use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    // ── System prompt — scoped to Moroccan student orientation ────────────
    private const SYSTEM_PROMPT = <<<PROMPT
You are Massarek AI, a friendly and expert orientation counselor for Moroccan students.
Your ONLY purpose is to help students with:
- Academic orientation (choosing the right field of study)
- Professional orientation (career path guidance)
- Information about careers, jobs, and professions
- Universities, schools, and educational institutions in Morocco and abroad
- Academic programs, degrees, and study options
- Skills development and student pathways
- Educational guidance and advice

You must REFUSE to answer questions about ANY other topics (politics, sports, entertainment, cooking, etc.) and politely redirect the student to orientation-related topics.

Always be encouraging, supportive, and specific to Moroccan educational context when relevant.
Respond in the same language the student uses (French, Arabic, or English).
Keep responses concise (max 3 paragraphs) and actionable.
PROMPT;

    // ── Fallback responses when the AI service is unavailable ─────────────
    // Indexed by detected language hint (default = French since platform is FR)
    private const FALLBACK_RESPONSES = [
        'fr' => "Je suis désolé, le service IA est temporairement indisponible. Veuillez réessayer dans quelques instants. En attendant, vous pouvez explorer nos fiches carrières dans l'onglet **Carrières** ou consulter vos recommandations personnalisées.",
        'ar' => "عذراً، خدمة الذكاء الاصطناعي غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى بعد لحظات. في هذه الأثناء، يمكنك استكشاف مسارات المهن في قسم **المهن**.",
        'en' => "I'm sorry, the AI service is temporarily unavailable. Please try again in a moment. In the meantime, you can explore career profiles in the **Careers** tab or check your personalized recommendations.",
    ];

    public function __construct(protected GeminiService $gemini) {}

    /**
     * POST /api/student/chat
     *
     * Accepts:
     *   message  : string (required, max 1000)
     *   history  : array  (optional, max 20 turns, each with role + content)
     *
     * Returns:
     *   { success: bool, message: string, is_fallback?: bool }
     *
     * HTTP codes:
     *   200  — AI responded successfully
     *   422  — validation error
     *   429  — quota / rate limit from Gemini
     *   503  — AI service down (with fallback body so UI can still show something)
     */
    public function message(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message'             => 'required|string|max:1000',
            'history'             => 'sometimes|array|max:20',
            'history.*.role'      => 'required_with:history|in:user,assistant',
            'history.*.content'   => 'required_with:history|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $userMessage = trim($request->input('message'));
        $history     = $request->input('history', []);

        // ── Build prompt ─────────────────────────────────────────────────
        $fullPrompt = self::SYSTEM_PROMPT . "\n\n";

        // Append last 10 turns of history to keep prompt size bounded
        if (!empty($history)) {
            $fullPrompt .= "Conversation history:\n";
            foreach (array_slice($history, -10) as $msg) {
                $role        = $msg['role'] === 'user' ? 'Student' : 'Massarek AI';
                $fullPrompt .= "{$role}: {$msg['content']}\n";
            }
            $fullPrompt .= "\n";
        }

        $fullPrompt .= "Student: {$userMessage}\n\nMassarek AI:";

        // ── Call Gemini (GeminiService handles retries internally) ────────
        try {
            $response = $this->gemini->generateContent($fullPrompt);

            return response()->json([
                'success' => true,
                'message' => trim($response),
            ]);

        } catch (\RuntimeException $e) {
            $message = $e->getMessage();
            $isQuota = str_contains($message, 'quota') || str_contains($message, 'quota exceeded');

            // Detect language from the student's last message for a matching fallback
            $lang     = $this->detectLanguage($userMessage);
            $fallback = self::FALLBACK_RESPONSES[$lang] ?? self::FALLBACK_RESPONSES['fr'];

            // Log for ops visibility
            \Illuminate\Support\Facades\Log::warning('ChatController: Gemini unavailable', [
                'user_id' => $request->user()?->id,
                'error'   => $message,
            ]);

            $statusCode = $isQuota ? 429 : 503;

            return response()->json([
                'success'     => false,
                'message'     => $message,          // original error for display
                'fallback'    => $fallback,          // UI can show this instead of a blank error
                'is_fallback' => true,
            ], $statusCode);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('ChatController: unexpected error', [
                'error' => $e->getMessage(),
            ]);

            $lang     = $this->detectLanguage($userMessage);
            $fallback = self::FALLBACK_RESPONSES[$lang] ?? self::FALLBACK_RESPONSES['fr'];

            return response()->json([
                'success'     => false,
                'message'     => 'Service temporarily unavailable.',
                'fallback'    => $fallback,
                'is_fallback' => true,
            ], 503);
        }
    }

    // ── Language detection — simple heuristic, no external dependency ─────
    private function detectLanguage(string $text): string
    {
        // Arabic Unicode block presence → ar
        if (preg_match('/[\x{0600}-\x{06FF}]/u', $text)) {
            return 'ar';
        }
        // Common French markers
        $frMarkers = ['je', 'tu', 'il', 'nous', 'vous', 'les', 'des', 'est', 'que', 'pour', 'avec', 'dans'];
        $words     = preg_split('/\s+/', mb_strtolower($text));
        $frHits    = count(array_intersect($words, $frMarkers));
        if ($frHits >= 2) return 'fr';

        // English markers
        $enMarkers = ['i', 'the', 'is', 'are', 'what', 'how', 'can', 'you', 'my', 'for', 'and'];
        $enHits    = count(array_intersect($words, $enMarkers));
        if ($enHits >= 2) return 'en';

        return 'fr'; // default to French (platform language)
    }
}
