<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetCoopHeader
{
    /**
     * Handle an incoming request.
     *
     * Set Cross-Origin-Opener-Policy to allow Google Sign-In popup to close properly.
     * 'same-origin-allow-popups' permits the window to be closed by cross-origin popups.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

        return $response;
    }
}
