<?php

namespace App\Http\Controllers\CV;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
use App\Jobs\ParseCVJob;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Skill;

class CVController extends Controller
{
    use ApiResponse;

    public function upload(Request $request)
    {
        $request->validate([
            // mimetypes (not just mimes) makes Laravel inspect the upload's
            // MIME magic, not just the extension.
            'file' => 'required|file|mimetypes:application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document|mimes:pdf,docx|max:5120',
        ]);

        $user = $request->user();
        $profile = $user->jobSeekerProfile;

        if (!$profile) {
            return $this->errorResponse('Job seeker profile not found.', 404);
        }

        $uploaded = $request->file('file');

        // Random unguessable filename so the stored path can't be reconstructed
        // from the user id + timestamp. The user id is still part of the path
        // segment for operational clarity, not as a security boundary.
        $filename = sprintf(
            'cvs/%d/%s.%s',
            $user->id,
            Str::uuid()->toString(),
            $uploaded->extension()
        );

        // Remove any previous CV from disk so abandoned files don't pile up.
        if ($profile->resume_file_url && Storage::disk('local')->exists($profile->resume_file_url)) {
            Storage::disk('local')->delete($profile->resume_file_url);
        }

        Storage::disk('local')->put($filename, file_get_contents($uploaded->getRealPath()));

        $profile->update([
            'resume_file_url' => $filename,
            'cv_parse_status' => 'processing',
        ]);

        ParseCVJob::dispatch($profile, $filename)->onQueue('cv-parsing');

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
