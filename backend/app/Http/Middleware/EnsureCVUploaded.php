<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureCVUploaded
{
    public function handle(Request $request, Closure $next): Response
    {
        $profile = Auth::user()->jobSeekerProfile;
        if (!$profile || !in_array($profile->cv_parse_status, ['completed', 'done'], true)) {
            return response()->json(['success' => false, 'data' => null, 'message' => 'Please upload and parse your CV first.', 'errors' => null], 403);
        }

        return $next($request);
    }
}
