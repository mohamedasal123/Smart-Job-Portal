<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CompanyProfileController extends Controller
{
    use ApiResponse;

    public function show(Request $request)
    {
        return $this->success($request->user()->companyProfile->load('user'));
    }

    public function update(Request $request)
    {
        $profile = $request->user()->companyProfile;

        if (!$profile) {
            return $this->error('Company profile not found.', 404);
        }

        $validated = $request->validate([
            'company_name'  => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|nullable|string|max:5000',
            'website'       => 'sometimes|nullable|url|max:255',
            'location'      => 'sometimes|nullable|string|max:255',
            'phone'         => 'sometimes|nullable|string|max:30',
            'founded_year'  => 'sometimes|nullable|string|max:10',
            'company_size'  => 'sometimes|nullable|string|max:50',
            'industry'      => 'sometimes|nullable|string|max:100',
        ]);

        $profile->update($validated);
        return $this->success($profile->fresh(), 'Profile updated.');
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $profile = $request->user()->companyProfile;

        if (!$profile) {
            return $this->error('Company profile not found.', 404);
        }

        if ($profile->logo_url) {
            $oldPath = Str::after($profile->logo_url, '/storage/');
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $path = $request->file('logo')->store('logos', 'public');
        $url = Storage::disk('public')->url($path);
        $profile->update(['logo_url' => $url]);

        return $this->success(

            ['logo_url' => $url],
            'Logo uploaded successfully.'
        );
    }
}
