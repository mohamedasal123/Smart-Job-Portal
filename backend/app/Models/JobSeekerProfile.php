<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class JobSeekerProfile extends Model
{
    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobSeekerSkills(): HasMany
    {
        return $this->hasMany(JobSeekerSkill::class, 'job_seeker_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'job_seeker_id');
    }

    public function cvParsedData(): HasOne
    {
        return $this->hasOne(CvParsedData::class, 'job_seeker_id');
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_seeker_skills', 'job_seeker_id', 'skill_id');
    }

    public function savedJobs(): BelongsToMany
    {
        return $this->belongsToMany(
            JobPost::class, 'saved_jobs', 'job_seeker_id', 'job_id'
        )->withTimestamps();
    }
}
