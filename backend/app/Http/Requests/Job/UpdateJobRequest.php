<?php

namespace App\Http\Requests\Job;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy checked in controller
    }

    public function rules(): array
    {
        return [
            'title'              => 'sometimes|required|string|max:255',
            'description'        => 'sometimes|required|string|min:50',
            'responsibilities'   => 'nullable|string',
            'location'           => 'nullable|string|max:255',
            'job_type'           => 'sometimes|required|in:full_time,part_time,remote,contract,internship',
            'salary_range'       => 'nullable|string|max:100',
            'skills'             => 'sometimes|required|array|min:1',
            'skills.*.id'        => 'required_with:skills|exists:skills,id',
            'skills.*.is_mandatory' => 'required_with:skills|boolean',
        ];
    }

    protected function passedValidation(): void
    {
        $this->merge([
            'title'           => $this->has('title') ? strip_tags($this->title) : $this->title,
            'description'     => $this->has('description') ? strip_tags($this->description) : $this->description,
            'responsibilities' => $this->has('responsibilities') ? strip_tags($this->responsibilities) : $this->responsibilities,
            'location'        => $this->has('location') ? strip_tags($this->location) : $this->location,
        ]);
    }
}
