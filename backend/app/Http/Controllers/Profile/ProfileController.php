<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        if (!$profile) {
            return $this->errorResponse('Job seeker profile not found.', 404);
        }

        $request->validate([
            'firstName'           => 'sometimes|nullable|string|max:100',
            'lastName'            => 'sometimes|nullable|string|max:100',
            'title'               => 'sometimes|nullable|string|max:150',
            'bio'                 => 'sometimes|nullable|string|max:5000',
            'expectedSalary'      => 'sometimes|nullable|string|max:50',
            'portfolio'           => 'sometimes|nullable|url|max:255',
            'linkedin'            => 'sometimes|nullable|url|max:255',
            'avatar'              => 'sometimes|nullable|string|max:500',
            'coverImage'          => 'sometimes|nullable|string|max:500',
            'email'               => 'sometimes|nullable|email|max:255',
            'phone'               => 'sometimes|nullable|string|max:30',
            'location'            => 'sometimes|nullable|string|max:255',
            'address'             => 'sometimes|nullable|string|max:500',
            'years_of_experience' => 'sometimes|nullable|integer|min:0|max:60',
            'education_level'     => 'sometimes|nullable|string|max:100',
        ]);

        if ($request->filled('firstName') || $request->filled('lastName')) {
            $user->name = trim($request->input('firstName', '') . ' ' . $request->input('lastName', '')) ?: $user->name;
            $user->save();
        }

        $contact = $this->contactInformation($profile);
        foreach (['title', 'bio', 'expectedSalary', 'portfolio', 'linkedin', 'email', 'avatar', 'coverImage'] as $field) {
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

    public function uploadAvatar(Request $request)
    {
        return $this->uploadMedia($request, 'avatar', 'avatars');
    }

    public function uploadCover(Request $request)
    {
        return $this->uploadMedia($request, 'coverImage', 'profile-covers');
    }

    public function verifyPassword(Request $request)
    {
        $request->validate(['password' => 'required|string']);

        if (Hash::check($request->password, $request->user()->password)) {
            return $this->successResponse(null, 'Password verified.');
        }

        return $this->errorResponse('Incorrect password.', 403);
    }

    public function updateSettings(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'currentPassword' => 'sometimes|nullable|string',
            'newPassword' => 'sometimes|nullable|string|min:8',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        $changingEmail = isset($validated['email']) && $validated['email'] !== $user->email;
        $changingPassword = !empty($validated['newPassword']);

        if ($changingEmail || $changingPassword) {
            if (empty($validated['currentPassword']) || !Hash::check($validated['currentPassword'], $user->password)) {
                return $this->errorResponse('Your current password is required and must be correct to change your email or password.', 403);
            }

            if ($changingEmail) {
                $user->email = $validated['email'];
            }

            if ($changingPassword) {
                $user->password = $validated['newPassword'];
            }
        }

        $user->save();

        return $this->successResponse($user->fresh(), 'Settings updated successfully.');
    }

    private function uploadMedia(Request $request, string $contactKey, string $directory)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $profile = $request->user()->jobSeekerProfile;
        if (!$profile) {
            return $this->errorResponse('Job seeker profile not found.', 404);
        }

        $contact = $this->contactInformation($profile);

        if (!empty($contact[$contactKey])) {
            $oldPath = Str::after($contact[$contactKey], '/storage/');
            if ($oldPath !== $contact[$contactKey] && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $path = $request->file('image')->store($directory, 'public');
        $url = Storage::disk('public')->url($path);
        $contact[$contactKey] = $url;

        $profile->update(['contact_information' => json_encode($contact)]);

        return $this->successResponse([$contactKey => $url], 'Profile media uploaded');
    }
}
