<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Skill extends Model
{
    protected $guarded = [];

    public function jobSeekerSkills(): HasMany
    {
        return $this->hasMany(JobSeekerSkill::class);
    }

    public function jobRequiredSkills(): HasMany
    {
        return $this->hasMany(JobRequiredSkill::class);
    }
}
