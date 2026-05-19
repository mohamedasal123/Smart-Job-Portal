<?php

namespace App\Jobs;

use App\Models\JobSeekerProfile;
use App\Models\CvParsedData;
use App\Models\Skill;
use App\Models\JobSeekerSkill;
use App\Services\CVParsingService;
use App\Services\MatchingService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ParseCVJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(
        public JobSeekerProfile $profile,
        public string $filePath
    ) {
        $this->onQueue('cv-parsing');
    }

    public function middleware(): array
    {
        return [new WithoutOverlapping($this->profile->id)];
    }

    public function handle(CVParsingService $parser, MatchingService $matcher): void
    {
        try {
            $parsed     = $parser->parse($this->filePath);
            $skillNames = $parser->extractSkillNames($parsed);

            DB::transaction(function () use ($parsed, $skillNames) {
                CvParsedData::updateOrCreate(
                    ['job_seeker_id' => $this->profile->id],
                    ['parsed_json'   => $parsed, 'parsed_at' => now()]
                );

                $skillIds = collect($skillNames)->map(function ($name) {
                    return Skill::firstOrCreate(
                        ['name' => $name],
                        ['type' => 'technical']
                    )->id;
                });

                JobSeekerSkill::where('job_seeker_id', $this->profile->id)
                    ->where('source', 'cv')
                    ->delete();

                foreach ($skillIds as $skillId) {
                    JobSeekerSkill::updateOrCreate(
                        ['job_seeker_id' => $this->profile->id, 'skill_id' => $skillId],
                        ['source' => 'cv']
                    );
                }

                // Keep years_of_experience only when the AI returns a numeric value.
                // education_level is stored as TEXT (migration already applied).
                $this->profile->update([
                    'years_of_experience' => is_numeric($parsed['experience'] ?? null)
                        ? (int) $parsed['experience']
                        : null,
                    'education_level' => is_array($parsed['education'] ?? null)
                        ? implode(', ', $parsed['education'])
                        : ($parsed['education'] ?? null),
                ]);
            });

            // Mark as completed OUTSIDE the transaction so it is always
            // committed even if the transaction was already committed.
            $this->profile->update(['cv_parse_status' => 'completed']);

            Log::info('CV Parsing completed', ['job_seeker_id' => $this->profile->id]);

        } catch (\Exception $e) {
            $this->profile->update(['cv_parse_status' => 'failed']);

            Log::error('CV Parsing failed', [
                'job_seeker_id' => $this->profile->id,
                'error'         => $e->getMessage(),
                'trace'         => $e->getTraceAsString(),
            ]);

            $this->fail($e);
        }
    }

    /**
     * Laravel calls this when all retries are exhausted.
     * Ensures the status is always set to 'failed' even if the job silently
     * dies without throwing (e.g. memory limit, timeout).
     */
    public function failed(\Throwable $exception): void
    {
        $this->profile->update(['cv_parse_status' => 'failed']);

        Log::error('CV Parsing job permanently failed', [
            'job_seeker_id' => $this->profile->id,
            'error'         => $exception->getMessage(),
        ]);
    }
}