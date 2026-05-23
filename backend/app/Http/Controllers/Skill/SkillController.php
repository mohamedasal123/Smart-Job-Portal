<?php

namespace App\Http\Controllers\Skill;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class SkillController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        return $this->successResponse(Skill::all());
    }

    public function addToSeeker(Request $request)
    {
        $validated = $request->validate([
            'skill_id' => 'nullable|exists:skills,id|required_without:name',
            'name' => 'nullable|string|max:100|required_without:skill_id',
            'type' => 'nullable|in:technical,soft',
        ]);

        if (!empty($validated['skill_id'])) {
            $skill = Skill::findOrFail($validated['skill_id']);
        } else {
            $name = trim($validated['name']);
            $skill = Skill::whereRaw('LOWER(name) = ?', [strtolower($name)])->first();

            if (!$skill) {
                $skill = Skill::create([
                    'name' => $name,
                    'type' => $validated['type'] ?? 'technical',
                ]);
            }
        }
        
        $request->user()->jobSeekerProfile->jobSeekerSkills()->firstOrCreate([
            'skill_id' => $skill->id,
            'source' => 'manual'
        ]);

        return $this->successResponse($skill, 'Skill added');
    }

    public function removeFromSeeker(Request $request, $skill_id)
    {
        $request->user()->jobSeekerProfile->jobSeekerSkills()
            ->where('skill_id', $skill_id)->delete();

        return $this->successResponse(null, 'Skill removed');
    }
}
