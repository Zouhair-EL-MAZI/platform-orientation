<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected array $models;
    protected string $endpoint = 'https://api.groq.com/openai/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = env('GROQ_API_KEY', '');

        $this->models = [
            'llama-3.3-70b-versatile',
            'llama-3.1-8b-instant',
            'mixtral-8x7b-32768',
        ];
    }

    public function generateContent(string $prompt, array $context = []): string
    {
        if (empty($this->apiKey)) {
            throw new \RuntimeException('Groq API key not configured. Set GROQ_API_KEY in backend .env.');
        }

        $messages = [];

        foreach ($context as $msg) {
            $messages[] = [
                'role'    => $msg['role'] === 'assistant' ? 'assistant' : 'user',
                'content' => $msg['content'],
            ];
        }

        $messages[] = ['role' => 'user', 'content' => $prompt];

        foreach ($this->models as $modelIndex => $model) {
            $attempt = 0;

            while ($attempt < 2) {
                $attempt++;

                $response = Http::timeout(30)
                    ->withToken($this->apiKey)
                    ->post($this->endpoint, [
                        'model'       => $model,
                        'messages'    => $messages,
                        'temperature' => 0.4,
                        'max_tokens'  => 2048,
                    ]);

                if ($response->successful()) {
                    return $response->json('choices.0.message.content')
                        ?? throw new \RuntimeException('No response from AI service.');
                }

                $status = $response->status();

                if (in_array($status, [429, 503]) && $attempt < 2) {
                    sleep(2);
                    continue;
                }

                if ($status === 429) {
                    throw new \RuntimeException('AI rate limit reached. Please wait a moment and try again.');
                }

                if (in_array($status, [429, 503, 404]) && $modelIndex < count($this->models) - 1) {
                    Log::warning('Groq model unavailable, trying fallback', [
                        'failed_model' => $model,
                        'next_model'   => $this->models[$modelIndex + 1],
                        'status'       => $status,
                    ]);
                    break;
                }

                Log::error('Groq API error', ['status' => $status, 'body' => $response->body()]);
                throw new \RuntimeException('AI service unavailable. Please try again later.');
            }
        }

        throw new \RuntimeException('All AI models are currently unavailable. Please try again later.');
    }

    public function generateJson(string $prompt): array
    {
        $fullPrompt = $prompt . "\n\nIMPORTANT: Return ONLY a valid JSON array. No markdown, no code blocks, no explanation. Start with [ and end with ].";

        $text    = '';
        $decoded = null;

        for ($attempt = 0; $attempt < 2; $attempt++) {
            $text    = $this->generateContent($attempt === 0 ? $fullPrompt : $fullPrompt . "\n\nPrevious response was invalid JSON. Return only the JSON array.");
            $cleaned = $this->extractJsonArray($text);
            $decoded = json_decode($cleaned, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }
        }

        Log::error('Groq JSON parse failed', ['raw' => $text, 'error' => json_last_error_msg()]);
        throw new \RuntimeException('Failed to parse AI response as JSON.');
    }

    private function extractJsonArray(string $text): string
    {
        $text  = preg_replace('/```(?:json)?\s*/i', '', $text);
        $text  = trim($text);
        $start = strpos($text, '[');

        if ($start === false) return $text;

        $depth = 0; $inString = false; $escape = false; $end = null;

        for ($i = $start, $len = strlen($text); $i < $len; $i++) {
            $c = $text[$i];
            if ($escape)              { $escape = false; continue; }
            if ($c === '\\' && $inString) { $escape = true; continue; }
            if ($c === '"')           { $inString = !$inString; continue; }
            if ($inString)            { continue; }
            if ($c === '[')           { $depth++; }
            elseif ($c === ']')       { if (--$depth === 0) { $end = $i; break; } }
        }

        return $end !== null ? substr($text, $start, $end - $start + 1) : substr($text, $start);
    }
}
