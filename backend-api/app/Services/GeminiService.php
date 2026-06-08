<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected array $models;
    protected string $endpoint;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');

        $primary = env('GEMINI_MODEL', 'gemini-2.5-flash');
        $fallback = env('GEMINI_FALLBACK_MODELS', '');

        $this->models = array_filter(array_unique(array_merge(
            [$primary],
            array_map('trim', explode(',', $fallback))
        )));

        $this->endpoint = $this->buildEndpoint($this->models[0]);
    }

    protected function buildEndpoint(string $model): string
    {
        return "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";
    }

    /**
     * Send a prompt to Gemini and return the text response.
     */
    public function generateContent(string $prompt, array $context = []): string
    {
        if (empty($this->apiKey)) {
            throw new \RuntimeException('AI API key not configured. Set GEMINI_API_KEY in backend .env.');
        }

        $parts = [];

        // Prepend context messages if provided (for chat history)
        foreach ($context as $msg) {
            $parts[] = ['text' => "[{$msg['role']}]: {$msg['content']}"];
        }

        $parts[] = ['text' => $prompt];

        $maxAttempts = 3;
        $response = null;

        foreach ($this->models as $modelIndex => $model) {
            $endpoint = $this->buildEndpoint($model);
            $attempt = 0;

            while ($attempt < $maxAttempts) {
                $attempt++;
                $response = Http::timeout(30)->post("{$endpoint}?key={$this->apiKey}", [
                    'contents' => [
                        ['parts' => $parts],
                    ],
                    'generationConfig' => [
                        'temperature'     => 0.7,
                        'topK'            => 40,
                        'topP'            => 0.95,
                        'maxOutputTokens' => 1024,
                    ],
                    'safetySettings' => [
                        ['category' => 'HARM_CATEGORY_HARASSMENT',        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
                        ['category' => 'HARM_CATEGORY_HATE_SPEECH',        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
                        ['category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
                        ['category' => 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'],
                    ],
                ]);

                if ($response->successful()) {
                    break;
                }

                $status = $response->status();

                if (in_array($status, [429, 503]) && $attempt < $maxAttempts) {
                    Log::warning('Transient Gemini API error, retrying', ['model' => $model, 'status' => $status, 'attempt' => $attempt]);
                    sleep((int) pow(2, $attempt - 1));
                    continue;
                }

                if ($status === 503 && $modelIndex < count($this->models) - 1) {
                    Log::warning('Gemini model unavailable, trying fallback model', [
                        'failed_model' => $model,
                        'next_model'   => $this->models[$modelIndex + 1],
                        'status'       => $status,
                    ]);
                    break;
                }

                break;
            }

            if ($response && $response->successful()) {
                break;
            }
        }

        if (!$response || !$response->successful()) {
            $body = $response ? $response->json() : null;
            $apiMessage = is_array($body) && isset($body['error']['message']) ? $body['error']['message'] : ($response ? $response->body() : 'No response');

            if ($response && $response->status() === 429) {
                $retryAfter = $this->parseRetryAfter($body);
                $message = 'AI quota exceeded. Please check your Google Cloud billing and quota settings.';
                if ($retryAfter !== null) {
                    $message .= " Retry after {$retryAfter} seconds.";
                }
                throw new \RuntimeException($message);
            }

            if ($response && $response->status() === 401) {
                throw new \RuntimeException('AI API key invalid or missing. Please check backend Gemini configuration.');
            }

            if ($response && $response->status() === 404 && str_contains($apiMessage, 'Model not found')) {
                throw new \RuntimeException('AI model not found. Please verify GEMINI_MODEL and supported Gemini models.');
            }

            Log::error('Gemini API error', ['status' => $response ? $response->status() : null, 'body' => $response ? $response->body() : null]);
            throw new \RuntimeException('AI service unavailable. Please try again later.');
        }

        $data = $response->json();

        return $data['candidates'][0]['content']['parts'][0]['text'] ?? throw new \RuntimeException('No response from AI service.');
    }

    private function parseRetryAfter(?array $body): ?int
    {
        if (!is_array($body) || !isset($body['error']['details']) || !is_array($body['error']['details'])) {
            return null;
        }

        foreach ($body['error']['details'] as $detail) {
            if (!is_array($detail) || !isset($detail['@type'])) {
                continue;
            }

            if (str_ends_with($detail['@type'], 'RetryInfo') && isset($detail['retryDelay'])) {
                $delay = $detail['retryDelay'];
                if (preg_match('/^(\d+)s$/', $delay, $matches)) {
                    return (int) $matches[1];
                }
            }
        }

        return null;
    }

    /**
     * Generate content and parse as JSON.
     */
    public function generateJson(string $prompt): array
    {
        $fullPrompt = $prompt . "\n\nIMPORTANT: Return ONLY a valid JSON array. No markdown, no code blocks, no explanation, no text before or after the JSON. Start directly with [ and end with ].";

        $text = $this->generateContent($fullPrompt);
        $cleaned = $this->extractJsonArray($text);
        $decoded = json_decode($cleaned, true);
        $salvaged = null;

        if (json_last_error() !== JSON_ERROR_NONE && $this->isLikelyTruncated($cleaned)) {
            $retryPrompt = $fullPrompt . "\n\nThe previous response was incomplete. Please send only the full valid JSON array again.";
            $text = $this->generateContent($retryPrompt);
            $cleaned = $this->extractJsonArray($text);
            $decoded = json_decode($cleaned, true);
        }

        if (json_last_error() !== JSON_ERROR_NONE) {
            $salvaged = $this->salvageJsonArray($cleaned);
            if ($salvaged !== null) {
                $decoded = json_decode($salvaged, true);
            }
        }

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
            Log::error('Gemini JSON parse failed', [
                'raw_response' => $text,
                'cleaned'      => $cleaned,
                'salvaged'     => $salvaged,
                'error'        => json_last_error_msg(),
            ]);
            throw new \RuntimeException('Failed to parse AI response as JSON.');
        }

        return $decoded;
    }

    private function extractJsonArray(string $text): string
    {
        $text = preg_replace('/```json\s*/i', '', $text);
        $text = preg_replace('/```\s*/i', '', $text);
        $text = trim($text);

        $start = strpos($text, '[');
        if ($start === false) {
            return $text;
        }

        $end = strrpos($text, ']');
        if ($end === false || $end <= $start) {
            return substr($text, $start);
        }

        return substr($text, $start, $end - $start + 1);
    }

    private function isLikelyTruncated(string $json): bool
    {
        $json = trim($json);
        return str_starts_with($json, '[') && substr($json, -1) !== ']';
    }

    private function salvageJsonArray(string $json): ?string
    {
        $json = trim($json);
        if (! str_starts_with($json, '[')) {
            return null;
        }

        $text = substr($json, 1);
        if (str_ends_with($text, ']')) {
            $text = substr($text, 0, -1);
        }

        $depth = 0;
        $inString = false;
        $escape = false;
        $start = null;
        $objects = [];

        for ($i = 0, $len = strlen($text); $i < $len; $i++) {
            $char = $text[$i];

            if ($escape) {
                $escape = false;
                continue;
            }

            if ($char === '\\') {
                $escape = true;
                continue;
            }

            if ($char === '"') {
                $inString = ! $inString;
                continue;
            }

            if ($inString) {
                continue;
            }

            if ($char === '{') {
                if ($depth === 0) {
                    $start = $i;
                }
                $depth++;
                continue;
            }

            if ($char === '}') {
                if ($depth > 0) {
                    $depth--;
                    if ($depth === 0 && $start !== null) {
                        $objects[] = substr($text, $start, $i - $start + 1);
                        $start = null;
                    }
                }
            }
        }

        if (empty($objects)) {
            return null;
        }

        return '[' . implode(',', $objects) . ']';
    }
}
