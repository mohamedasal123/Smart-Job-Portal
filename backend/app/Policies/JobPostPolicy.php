<?php

namespace App\Policies;

use App\Models\JobPost;
use App\Models\User;

class JobPostPolicy
{
    public function update(User $user, JobPost $job): bool
    {
        return $user->companyProfile?->id === $job->company_id;
    }

    public function delete(User $user, JobPost $job): bool
    {
        return $user->companyProfile?->id === $job->company_id;
    }

    public function viewApplicants(User $user, JobPost $job): bool
    {
        return $user->companyProfile?->id === $job->company_id;
    }
}
