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
        $request->validate(['skill_id' => 'required|exists:skills,id']);
        
        $request->user()->jobSeekerProfile->jobSeekerSkills()->firstOrCreate([
            'skill_id' => $request->skill_id,
            'source' => 'manual'
        ]);

        return $this->successResponse(null, 'Skill added');
    }

    public function removeFromSeeker(Request $request, $skill_id)
    {
        $request->user()->jobSeekerProfile->jobSeekerSkills()
            ->where('skill_id', $skill_id)->delete();

        return $this->successResponse(null, 'Skill removed');
    }
}
