<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Job\StoreJobRequest;
use App\Http\Requests\Job\UpdateJobRequest;
use App\Http\Resources\JobResource;
use App\Models\JobPost;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanyJobController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $jobs = $request->user()->companyProfile
            ->jobPosts()
            ->withCount('applications')
            ->latest()
            ->paginate(15);

        return $this->success(JobResource::collection($jobs));
    }

    public function store(StoreJobRequest $request)
    {
        $job = DB::transaction(function () use ($request) {
            $job = $request->user()->companyProfile->jobPosts()->create(
                $request->only('title', 'description', 'responsibilities', 'location', 'job_type', 'salary_range')
            );

            foreach ($request->skills as $skill) {
                $job->jobRequiredSkills()->create([
                    'skill_id'     => $skill['id'],
                    'is_mandatory' => $skill['is_mandatory'],
                ]);
            }

            return $job;
        });

        return $this->success(
            new JobResource($job->load('jobRequiredSkills.skill')),
            'Job posted successfully.',
            201
        );
    }

    public function show(Request $request, JobPost $job)
    {
        if ($request->user()->cannot('update', $job)) {
            return $this->error('Forbidden.', 403);
        }

        return $this->success(
            new JobResource($job->load(['jobRequiredSkills.skill'])->loadCount('applications'))
        );
    }

    public function update(UpdateJobRequest $request, JobPost $job)
    {
        if ($request->user()->cannot('update', $job)) {
            return $this->error('Forbidden.', 403);
        }

        DB::transaction(function () use ($request, $job) {
            $job->update($request->only(
                'title', 'description', 'responsibilities',
                'location', 'job_type', 'salary_range'
            ));

            if ($request->has('skills')) {
                $job->jobRequiredSkills()->delete();
                foreach ($request->skills as $skill) {
                    $job->jobRequiredSkills()->create([
                        'skill_id'     => $skill['id'],
                        'is_mandatory' => $skill['is_mandatory'],
                    ]);
                }
            }
        });

        return $this->success(
            new JobResource($job->fresh()->load('jobRequiredSkills.skill')),
            'Job updated.'
        );
    }

    public function destroy(Request $request, JobPost $job)
    {
        if ($request->user()->cannot('delete', $job)) {
            return $this->error('Forbidden.', 403);
        }

        $job->delete();
        return $this->success(null, 'Job deleted.');
    }

    public function toggle(Request $request, JobPost $job)
    {
        if ($request->user()->cannot('update', $job)) {
            return $this->error('Forbidden.', 403);
        }

        $job->update(['is_active' => !$job->is_active]);
        return $this->success(
            new JobResource($job->fresh()),
            $job->is_active ? 'Job activated.' : 'Job paused.'
        );
    }
}
