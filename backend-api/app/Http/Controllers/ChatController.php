<?php

namespace App\Http\Controllers;

use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    // Topics the chatbot is allowed to discuss
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

    public function __construct(protected GeminiService $gemini) {}

    /**
     * POST /api/student/chat
     * Send a message and receive an AI response.
     * Accepts conversation history for context.
     */
    public function message(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message'         => 'required|string|max:1000',
            'history'         => 'sometimes|array|max:20',
            'history.*.role'  => 'required_with:history|in:user,assistant',
            'history.*.content' => 'required_with:history|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $userMessage = $request->input('message');
            $history     = $request->input('history', []);

            // Build full prompt with system instructions + history
            $fullPrompt = self::SYSTEM_PROMPT . "\n\n";

            // Add conversation history as context
            if (!empty($history)) {
                $fullPrompt .= "Conversation history:\n";
                foreach (array_slice($history, -10) as $msg) {  // last 10 messages only
                    $role = $msg['role'] === 'user' ? 'Student' : 'Massarek AI';
                    $fullPrompt .= "{$role}: {$msg['content']}\n";
                }
                $fullPrompt .= "\n";
            }

            $fullPrompt .= "Student: {$userMessage}\n\nMassarek AI:";

            $response = $this->gemini->generateContent($fullPrompt);

            return response()->json([
                'success'  => true,
                'message'  => trim($response),
            ]);
        } catch (\RuntimeException $e) {
            $status = str_contains(strtolower($e->getMessage()), 'quota exceeded') ? 429 : 503;
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $status);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Service temporarily unavailable.',
            ], 500);
        }
    }
}
