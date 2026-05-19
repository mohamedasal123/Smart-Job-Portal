<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Traits\ApiResponse;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private AuthService $authService) {}

    public function register(RegisterRequest $request)
    {
        $this->authService->registerUser($request->validated());

        return $this->success(null, 'Registration successful. Please verify your email.', 201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return $this->error('Invalid credentials.', 401);
        }

        $user = Auth::user();

        if ($user->is_banned) {
            Auth::guard('web')->logout();
            return $this->error('Your account has been suspended.', 403);
        }

        if (!$user->email_verified_at) {
            Auth::guard('web')->logout();
            return $this->error('Please verify your email first.', 401);
        }

        $request->session()->regenerate();

        if ($user->role === 'job_seeker') {
            $user->load('jobSeekerProfile');
        } elseif ($user->role === 'company') {
            $user->load('companyProfile');
        }

        return $this->success(new UserResource($user), 'Login successful.', 200);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->success(null, 'Logged out successfully.');
    }

    public function verifyEmail(Request $request)
    {
        $request->validate(['token' => 'required|string']);

        if (!$this->authService->verifyEmail($request->token)) {
            return $this->error('Invalid or expired token.', 400);
        }

        return $this->success(null, 'Email verified successfully.');
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'job_seeker') {
            $user->load('jobSeekerProfile');
        } elseif ($user->role === 'company') {
            $user->load('companyProfile');
        }

        return $this->success(new UserResource($user), 'OK', 200);
    }

    public function resendVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $this->authService->resendVerificationEmail($request->email);

        // Always return 200 to prevent user enumeration
        return $this->success(null, 'If your email is registered and unverified, a new link was sent.', 200);
    }
}
