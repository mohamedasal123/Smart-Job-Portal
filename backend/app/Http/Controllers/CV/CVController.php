<?php

namespace App\Http\Controllers\CV;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
use App\Jobs\ParseCVJob;
use Illuminate\Support\Facades\Storage;
use App\Models\Skill;

class CVController extends Controller
{
    use ApiResponse;

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf,docx|max:5120'
        ]);

        $user = $request->user();
        $profile = $user->jobSeekerProfile;

        $path = $request->file('file')->storeAs(
            'cvs',
            "{$user->id}_" . time() . '.' . $request->file('file')->extension(),
            'local'
        );

        $profile->update([
            'resume_file_url' => $path,
            'cv_parse_status' => 'processing'
        ]);

        ParseCVJob::dispatch($profile, $path)->onQueue('cv-parsing');

        return $this->successResponse(null, 'CV uploaded. Parsing in progress.', 202);
    }

    public function status(Request $request)
    {
        $profile = $request->user()->jobSeekerProfile;

        return $this->successResponse([
            'cv_parse_status' => $profile->cv_parse_status,
            'resume_file_url' => $profile->resume_file_url,
        ]);
    }

    public function getParsed(Request $request)
    {
        $parsed = $request->user()->jobSeekerProfile->cvParsedData;

        if (!$parsed) {
            return $this->errorResponse('Not parsed yet.', 404);
        }

        return $this->successResponse($parsed);
    }

    public function updateParsed(Request $request)
    {
        $request->validate([
            'parsed_json' => 'required|array',
            'parsed_json.skills' => 'array'
        ]);

        $profile = $request->user()->jobSeekerProfile;
        $parsed = $profile->cvParsedData;

        if ($parsed) {
            $parsed->update(['parsed_json' => $request->parsed_json]);
        } else {
            $profile->cvParsedData()->create([
                'parsed_json' => $request->parsed_json,
                'parsed_at' => now(),
            ]);
        }

        $profile->jobSeekerSkills()->where('source', 'cv')->delete();

        $skills = $request->input('parsed_json.skills', []);
        foreach ($skills as $skillName) {
            $skill = Skill::firstOrCreate(
                ['name' => $skillName],
                ['type' => 'technical']
            );

            $profile->jobSeekerSkills()->firstOrCreate([
                'skill_id' => $skill->id,
                'source' => 'cv'
            ]);
        }

        return $this->successResponse(null, 'Parsed data updated.');
    }
}
