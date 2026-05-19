<?php

namespace App\Http\Controllers\Job;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Models\JobPost;
use App\Services\MatchingService;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class JobController extends Controller
{
    use ApiResponse;

    public function __construct(private MatchingService $matchingService) {}

    public function index(Request $request)
    {
        $query = JobPost::query()->active()->with('companyProfile');

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('description', 'LIKE', "%{$keyword}%");
            });
        }

        if ($request->filled('location')) {
            $query->where('location', 'LIKE', "%{$request->location}%");
        }

        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        if ($request->filled('salary_range')) {
            $query->where('salary_range', $request->salary_range);
        }

        $jobs = $query->paginate(15);

        return $this->success(JobResource::collection($jobs));
    }

    public function show(JobPost $job)
    {
        return $this->success(
            new JobResource($job->load(['jobRequiredSkills.skill', 'companyProfile']))
        );
    }

    public function recommended(Request $request)
    {
        $profile        = $request->user()->jobSeekerProfile;
        $seekerSkillIds = $profile->jobSeekerSkills()->pluck('skill_id');

        $jobs = JobPost::active()->with('jobRequiredSkills.skill')->get();

        $recommended = $jobs->map(function ($job) use ($seekerSkillIds) {
            $score = $this->matchingService->calculateScore($seekerSkillIds, $job->jobRequiredSkills);
            $job->setAttribute('ai_score', $score);
            return $job;
        })
        ->filter(fn ($job) => $job->ai_score > 0)
        ->sortByDesc('ai_score')
        ->take(20)
        ->values();

        return $this->success(JobResource::collection($recommended));
    }
}
