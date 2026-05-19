<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class ProfileController extends Controller
{
    use ApiResponse;

    private function contactInformation($profile): array
    {
        $contact = json_decode($profile->contact_information ?: '{}', true);

        return is_array($contact) ? $contact : [];
    }

    public function show(Request $request)
    {
        $user = $request->user();
        $profile = $user->jobSeekerProfile->load(['skills', 'jobSeekerSkills.skill']);
        $profile->setRelation('user', $user);

        return $this->successResponse($profile);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $profile = $user->jobSeekerProfile;

        if ($request->filled('firstName') || $request->filled('lastName')) {
            $user->name = trim($request->input('firstName', '') . ' ' . $request->input('lastName', '')) ?: $user->name;
            $user->save();
        }

        $contact = $this->contactInformation($profile);
        foreach (['title', 'bio', 'expectedSalary', 'portfolio', 'linkedin', 'email'] as $field) {
            if ($request->has($field)) {
                $contact[$field] = $request->input($field);
            }
        }

        $profilePayload = [];
        if ($request->has('phone')) $profilePayload['phone'] = $request->input('phone');
        if ($request->has('location')) $profilePayload['address'] = $request->input('location');
        if ($request->has('address')) $profilePayload['address'] = $request->input('address');
        if ($request->has('years_of_experience')) $profilePayload['years_of_experience'] = $request->input('years_of_experience');
        if ($request->has('education_level')) $profilePayload['education_level'] = $request->input('education_level');
        $profilePayload['contact_information'] = json_encode($contact);

        $profile->update($profilePayload);

        $profile = $profile->fresh()->load(['skills', 'jobSeekerSkills.skill']);
        $profile->setRelation('user', $user->fresh());

        return $this->successResponse($profile, 'Profile updated');
    }
}
