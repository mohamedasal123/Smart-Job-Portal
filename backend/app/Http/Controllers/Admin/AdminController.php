<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Application;
use App\Models\JobPost;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    use ApiResponse;

    public function stats(): JsonResponse
    {
        $startOfWeek = now()->startOfWeek();

        $stats = [
            'total_users'            => User::count(),
            'new_users_this_week'    => User::where('created_at', '>=', $startOfWeek)->count(),
            'total_jobs'             => JobPost::count(),
            'active_jobs'            => JobPost::active()->count(),
            'total_applications'     => Application::count(),
            'applications_this_week' => Application::where('created_at', '>=', $startOfWeek)->count(),
            'banned_users'           => User::where('is_banned', true)->count(),
        ];

        return $this->success($stats);
    }

    public function users(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('is_banned')) {
            $query->where('is_banned', filter_var($request->is_banned, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->search}%")
                  ->orWhere('email', 'LIKE', "%{$request->search}%");
            });
        }

        $users = $query->latest()->paginate(15);

        return $this->success(UserResource::collection($users));
    }

    public function showUser(User $user): JsonResponse
    {
        if ($user->role === 'job_seeker') {
            $user->load([
                'jobSeekerProfile.jobSeekerSkills.skill',
                'jobSeekerProfile.cvParsedData',
            ]);
            $user->profile = $user->jobSeekerProfile;
        } elseif ($user->role === 'company') {
            $user->load('companyProfile');
            $user->companyProfile->loadCount('jobPosts');
            $user->profile = $user->companyProfile;
        }

        return $this->success([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_banned' => (bool) $user->is_banned,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'profile' => $user->profile,
        ], 'OK');
    }

    public function toggleBan(User $user): JsonResponse
    {
        $user->is_banned = !$user->is_banned;
        $user->save();

        $message = $user->is_banned ? 'User banned.' : 'User unbanned.';

        return $this->success(new UserResource($user), $message);
    }

    public function jobs(Request $request): JsonResponse
    {
        if ($request->filled('trashed') && $request->trashed === 'only') {
            $query = JobPost::onlyTrashed()->with('companyProfile');
        } else {
            $query = JobPost::withTrashed()->with('companyProfile');
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        return $this->success($query->latest()->paginate(15));
    }

    public function forceDeleteJob($id): JsonResponse
    {
        $job = JobPost::withTrashed()->findOrFail($id);
        $job->forceDelete();

        return $this->success(null, 'Job permanently deleted.');
    }
    public function verifyUser(User $user): JsonResponse
    {
        $user->update(['email_verified_at' => now()]);
        return $this->success(null, 'User verified successfully.');
    }
}
