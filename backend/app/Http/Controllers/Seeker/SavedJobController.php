<?php

namespace App\Http\Controllers\Seeker;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class SavedJobController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $saved = $request->user()->jobSeekerProfile
            ->savedJobs()
            ->with(['companyProfile', 'jobRequiredSkills.skill'])
            ->where('is_active', true)
            ->paginate(15);

        return $this->success($saved);
    }

    public function store(Request $request, JobPost $job)
    {
        $profile = $request->user()->jobSeekerProfile;

        if ($profile->savedJobs()->where('job_id', $job->id)->exists()) {
            return $this->error('Job already saved.', 409);
        }

        $profile->savedJobs()->attach($job->id);

        return $this->success(null, 'Job saved.', 201);
    }

    public function destroy(Request $request, JobPost $job)
    {
        $request->user()->jobSeekerProfile->savedJobs()->detach($job->id);

        return $this->success(null, 'Job removed from saved.');
    }
}
