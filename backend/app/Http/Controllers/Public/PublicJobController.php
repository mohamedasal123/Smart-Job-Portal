<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Models\JobPost;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PublicJobController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $jobs = JobPost::active()
            ->with(['companyProfile', 'jobRequiredSkills.skill'])
            ->when($request->keyword, fn ($q, $k) =>
                $q->where(fn ($q2) =>
                    $q2->where('title', 'like', "%$k%")
                       ->orWhere('description', 'like', "%$k%")
                )
            )
            ->when($request->location, fn ($q, $l) =>
                $q->where('location', 'like', "%$l%")
            )
            ->when($request->job_type, fn ($q, $t) =>
                $q->where('job_type', $t)
            )
            ->when($request->category, fn ($q, $c) =>
                $q->where('category', $c)
            )
            ->latest()
            ->paginate(15);

        return $this->success(JobResource::collection($jobs));
    }

    public function show(JobPost $job)
    {
        if (!$job->is_active) {
            return $this->error('Job not found.', 404);
        }

        $job->load(['companyProfile', 'jobRequiredSkills.skill']);

        return $this->success(new JobResource($job));
    }
}
