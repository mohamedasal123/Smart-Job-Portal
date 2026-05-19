<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'job_id'             => $this->job_id,
            'job_seeker_id'      => $this->job_seeker_id,
            'status'             => $this->status,
            'ai_score'           => $this->ai_score,
            'missing_skills_json'=> $this->missing_skills_json,
            'job_post'           => $this->when(
                $this->relationLoaded('jobPost'),
                fn () => new JobResource($this->jobPost)
            ),
            'job_seeker_profile' => $this->when(
                $this->relationLoaded('jobSeekerProfile'),
                fn () => $this->jobSeekerProfile
            ),
            'application_status_history' => $this->when(
                $this->relationLoaded('applicationStatusHistory'),
                fn () => $this->applicationStatusHistory
            ),
            'created_at'         => $this->created_at,
            'updated_at'         => $this->updated_at,
        ];
    }
}
