<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;
// namespace App\Exceptions;

// use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->renderable(function (ValidationException $e) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Validation failed.',
                'errors'  => $e->errors(),
            ], 422);
        });

        $this->renderable(function (AuthenticationException $e) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Unauthenticated.',
                'errors'  => null,
            ], 401);
        });

        $this->renderable(function (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Forbidden.',
                'errors'  => null,
            ], 403);
        });

        $this->renderable(function (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Resource not found.',
                'errors'  => null,
            ], 404);
        });

        $this->renderable(function (QueryException $e) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'A database error occurred.',
                'errors'  => null,
            ], 500);
        });

        $this->renderable(function (HttpExceptionInterface $e) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => $e->getMessage() ?: 'HTTP error.',
                'errors'  => null,
            ], $e->getStatusCode());
        });
    }

    public function render($request, Throwable $e)
    {
        // Let the registered renderables above handle known exceptions first
        $response = parent::render($request, $e);

        // If it's an API request and response isn't already JSON, wrap it
        if ($request->expectsJson() && !$response->headers->contains('Content-Type', 'application/json')) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'An unexpected server error occurred.',
                'errors'  => null,
            ], $response->getStatusCode());
        }

        return $response;
    }
}