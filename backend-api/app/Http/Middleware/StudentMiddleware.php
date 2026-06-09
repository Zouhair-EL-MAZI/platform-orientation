<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class StudentMiddleware
{
    /**
     * Only allow users whose role is 'student'.
     * Mirrors AdminMiddleware — same pattern, different role value.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || ($user->role ?? 'student') !== 'student') {
            return response()->json(['message' => 'Forbidden. Students only.'], 403);
        }

        return $next($request);
    }
}
