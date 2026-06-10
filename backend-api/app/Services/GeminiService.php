<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * GeminiService
 *
 * Wraps the Google Gemini REST API with:
 *  - Configurable timeout (default 30s)
 *  - Automatic retry with exponential back-off on transient failures
 *    (network errors, 429, 500, 503) — does NOT retry on 400/401
 *  - Structured exception types so callers can distinguish
 *    quota errors from network errors from invalid-key errors
 *  - JSON extraction + salvage logic (unchanged from original)
 */
class GeminiService
{
    // ── Retry configuration ────────────────────────────────────────────────
    private const MAX_RETRIES     = 2;          // up to 2 retries (3 total attempts)
    private const BASE_DELAY_MS   = 1000;       // 1 s base, doubles each retry
    private const REQUEST_TIMEOUT = 30;         // seconds per attempt

    // ── HTTP status codes that warrant a retry ─────────────────────────────
    private const RETRYABLE_STATUSES = [429, 500, 502, 503, 504];

    protected string $apiKey;
    protected string $endpoint;

    public function __construct()
    {
        $this->apiKey   = config('services.gemini.key', '');
        $model          = config('services.gemini.model', env('GEMINI_MODEL', 'gemini-1.5-flash'));
        $this->endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";
    }

    // ──────────────────────────────────────────────────────────────────────
    // Public API
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Send a prompt to Gemini and return the text response.
     * Retries automatically on transient failures.
     *
     * @throws \RuntimeException  with a user-friendly message
     */
    public function generateContent(string $prompt, array $context = []): string
    {
        $parts = [];

        // Prepend context messages (chat history)
        foreach ($context as $msg) {
            $parts[] = ['text' => "[{$msg['role']}]: {$msg['content']}"];
        }
        $parts[] = ['text' => $prompt];

        $payload = [
            'contents'         => [['parts' => $parts]],
            'generationConfig' => [
                'temperature'     => 0.7,
                'topK'            => 40,
                'topP'            => 0.95,
                'maxOutputTokens' => 1024,
            ],
            'safetySettings'   => $this->safetySettings(),
        ];

        return $this->requestWithRetry($payload);
    }

    /**
     * Generate content and parse the response as a JSON array.
     * Includes truncation detection + salvage logic (original behaviour preserved).
     *
     * @throws \RuntimeException
     */
    public function generateJson(string $prompt): array
    {
        $fullPrompt = $prompt
            . "\n\nIMPORTANT: Return ONLY a valid JSON array. "
            . "No markdown, no code blocks, no explanation, no text before or after the JSON. "
            . "Start directly with [ and end with ].";

        $text    = $this->generateContent($fullPrompt);
        $cleaned = $this->extractJsonArray($text);
        $decoded = json_decode($cleaned, true);
        $salvaged = null;

        // Auto-retry once if response looks truncated
        if (json_last_error() !== JSON_ERROR_NONE && $this->isLikelyTruncated($cleaned)) {
            $retryPrompt = $fullPrompt
                . "\n\nThe previous response was incomplete. "
                . "Please send only the full valid JSON array again.";
            $text    = $this->generateContent($retryPrompt);
            $cleaned = $this->extractJsonArray($text);
            $decoded = json_decode($cleaned, true);
        }

        // Last-chance salvage
        if (json_last_error() !== JSON_ERROR_NONE) {
            $salvaged = $this->salvageJsonArray($cleaned);
            if ($salvaged !== null) {
                $decoded = json_decode($salvaged, true);
            }
        }

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            Log::error('Gemini JSON parse failed', [
                'raw_response' => $text ?? '',
                'cleaned'      => $cleaned,
                'salvaged'     => $salvaged,
                'error'        => json_last_error_msg(),
            ]);
            throw new \RuntimeException(
                'AI returned an unreadable response. Please try again in a moment.'
            );
        }

        return $decoded;
    }

    // ──────────────────────────────────────────────────────────────────────
    // Retry logic
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Execute the Gemini HTTP request with exponential back-off retry.
     *
     * Attempt 0 → immediate
     * Attempt 1 → sleep BASE_DELAY_MS
     * Attempt 2 → sleep BASE_DELAY_MS * 2
     */
    private function requestWithRetry(array $payload): string
    {
        $lastException = null;

        for ($attempt = 0; $attempt <= self::MAX_RETRIES; $attempt++) {
            if ($attempt > 0) {
                $delayMs = self::BASE_DELAY_MS * (2 ** ($attempt - 1));
                usleep($delayMs * 1000);
                Log::info("Gemini retry attempt {$attempt}", ['delay_ms' => $delayMs]);
            }

            try {
                $response = Http::timeout(self::REQUEST_TIMEOUT)
                    ->post("{$this->endpoint}?key={$this->apiKey}", $payload);

                // Success path
                if ($response->successful()) {
                    $data = $response->json();
                    return $data['candidates'][0]['content']['parts'][0]['text']
                        ?? throw new \RuntimeException('AI service returned an empty response.');
                }

                // ── Classify the HTTP error ──────────────────────────────
                $status     = $response->status();
                $body       = $response->json();
                $apiMessage = $body['error']['message'] ?? $response->body();

                // Do NOT retry on auth / bad-request errors
                if ($status === 400 && str_contains($apiMessage, 'API Key not found')) {
                    throw new \RuntimeException(
                        'AI API key is invalid or missing. Contact support.'
                    );
                }

                if ($status === 401 || $status === 403) {
                    throw new \RuntimeException(
                        'AI service authentication failed. Contact support.'
                    );
                }

                // Retryable status — store and loop
                if (in_array($status, self::RETRYABLE_STATUSES, true) && $attempt < self::MAX_RETRIES) {
                    $lastException = $this->buildException($status, $apiMessage);
                    Log::warning("Gemini retryable error (attempt {$attempt})", [
                        'status' => $status,
                        'body'   => substr($response->body(), 0, 400),
                    ]);
                    continue;
                }

                // Non-retryable or retries exhausted
                Log::error('Gemini API error', [
                    'status'  => $status,
                    'attempt' => $attempt,
                    'body'    => substr($response->body(), 0, 800),
                ]);
                throw $this->buildException($status, $apiMessage);

            } catch (\RuntimeException $e) {
                // Re-throw non-retryable exceptions immediately
                throw $e;
            } catch (\Exception $e) {
                // Network / connection error — retryable
                $lastException = new \RuntimeException(
                    'Network error reaching AI service. Please try again.',
                    0,
                    $e
                );
                Log::warning("Gemini network error (attempt {$attempt})", [
                    'error' => $e->getMessage(),
                ]);
                if ($attempt < self::MAX_RETRIES) continue;
            }
        }

        throw $lastException ?? new \RuntimeException('AI service unavailable after retries.');
    }

    /**
     * Build a user-friendly RuntimeException from an HTTP status + message.
     */
    private function buildException(int $status, string $apiMessage): \RuntimeException
    {
        return match (true) {
            $status === 429 => new \RuntimeException(
                'AI quota exceeded. Please wait a moment and try again.'
            ),
            $status >= 500  => new \RuntimeException(
                'AI service is temporarily unavailable. Please try again shortly.'
            ),
            default         => new \RuntimeException(
                'AI service error. Please try again later.'
            ),
        };
    }

    // ──────────────────────────────────────────────────────────────────────
    // Helpers (unchanged from original)
    // ──────────────────────────────────────────────────────────────────────

    private function safetySettings(): array
    {
        return [
            ['category' => 'HARM_CATEGORY_HARASSMENT',        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
            ['category' => 'HARM_CATEGORY_HATE_SPEECH',        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
            ['category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
            ['category' => 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
        ];
    }

    private function extractJsonArray(string $text): string
    {
        $text = preg_replace('/```json\s*/i', '', $text);
        $text = preg_replace('/```\s*/i', '', $text);
        $text = trim($text);

        $start = strpos($text, '[');
        if ($start === false) return $text;

        $end = strrpos($text, ']');
        if ($end === false || $end <= $start) return substr($text, $start);

        return substr($text, $start, $end - $start + 1);
    }

    private function isLikelyTruncated(string $json): bool
    {
        $json = trim($json);
        return str_starts_with($json, '[') && !str_ends_with($json, ']');
    }

    private function salvageJsonArray(string $json): ?string
    {
        $json = trim($json);
        if (!str_starts_with($json, '[')) return null;

        $text     = substr($json, 1);
        if (str_ends_with($text, ']')) $text = substr($text, 0, -1);

        $depth    = 0;
        $inString = false;
        $escape   = false;
        $start    = null;
        $objects  = [];

        for ($i = 0, $len = strlen($text); $i < $len; $i++) {
            $char = $text[$i];

            if ($escape)         { $escape = false; continue; }
            if ($char === '\\')  { $escape = true;  continue; }
            if ($char === '"')   { $inString = !$inString; continue; }
            if ($inString)       { continue; }

            if ($char === '{') {
                if ($depth === 0) $start = $i;
                $depth++;
                continue;
            }

            if ($char === '}' && $depth > 0) {
                $depth--;
                if ($depth === 0 && $start !== null) {
                    $objects[] = substr($text, $start, $i - $start + 1);
                    $start     = null;
                }
            }
        }

        return empty($objects) ? null : '[' . implode(',', $objects) . ']';
    }
}
