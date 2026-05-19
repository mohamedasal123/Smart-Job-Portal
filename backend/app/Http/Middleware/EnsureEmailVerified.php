<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureEmailVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && !Auth::user()->email_verified_at) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Email not verified.', 'errors' => null], 403);
        }

        return $next($request);
    }
}
