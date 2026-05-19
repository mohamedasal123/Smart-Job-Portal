<?php

namespace App\Http\Requests\Job;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authed via policy in controller
    }

    public function rules(): array
    {
        return [
            'title'              => 'required|string|max:255',
            'description'        => 'required|string|min:10',
            'responsibilities'   => 'nullable|string',
            'location'           => 'nullable|string|max:255',
            'job_type' => 'required|in:full_time,part_time,remote,contract,internship',
            'salary_range'       => 'nullable|string|max:100',
            'skills'             => 'required|array|min:1',
            'skills.*.id'        => 'required|exists:skills,id',
            'skills.*.is_mandatory' => 'required|boolean',
        ];
    }

    protected function passedValidation()
    {
        // Sanitize
        $this->merge([
            'title' => strip_tags($this->title),
            'description' => strip_tags($this->description),
            'responsibilities' => strip_tags($this->responsibilities),
            'location' => strip_tags($this->location),
        ]);
    }
}
