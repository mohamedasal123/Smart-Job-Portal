<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $profile = null;
        if ($this->relationLoaded('jobSeekerProfile')) {
            $profile = $this->jobSeekerProfile;
        } elseif ($this->relationLoaded('companyProfile')) {
            $profile = $this->companyProfile;
        }

        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'role'       => $this->role,
            'verified'   => !is_null($this->email_verified_at),
            'banned'     => (bool) $this->is_banned,
            'created_at' => $this->created_at,
            'profile'    => $profile,
        ];
    }
}
