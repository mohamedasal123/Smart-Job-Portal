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
        $skillsRule = 'required|string';
        if ($this->has('skills') && is_array($this->skills) && isset($this->skills[0]['name'])) {
            $skillsRule = 'required|array';
        }

        return [
            'title'              => 'required|string|max:255',
            'category'           => 'nullable|string|max:255',
            'description'        => 'required|string',
            'responsibilities'   => 'nullable|string',
            'location'           => 'nullable|string|max:255',
            'work_mode'          => 'nullable|string|max:255',
            'job_type'           => 'required|in:full_time,part_time,remote,contract,internship',
            'salary_min'         => 'nullable|numeric|min:0|max:9999999',
            'salary_max'         => 'nullable|numeric|min:0|max:9999999',
            'experience_level'   => 'nullable|string|max:255',
            'education'          => 'nullable|string|max:255',
            'status'             => 'nullable|in:draft,active,paused,closed',
            'skills'             => 'required|array|min:1',
            'skills.*'           => $skillsRule,
            'skills.*.name'      => 'sometimes|required|string',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('skills')) {
            $formattedSkills = [];
            foreach ($this->skills as $skillName) {
                if (is_string($skillName)) {
                    $formattedSkills[] = [
                        'name' => trim($skillName),
                        'is_mandatory' => true
                    ];
                }
            }
            if (count($formattedSkills) > 0) {
                $this->merge(['skills' => $formattedSkills]);
            }
        }
        
        // Remove commas from salary values before validation if they exist
        if ($this->has('salary_min') && is_string($this->salary_min)) {
            $this->merge(['salary_min' => str_replace(',', '', $this->salary_min)]);
        }
        if ($this->has('salary_max') && is_string($this->salary_max)) {
            $this->merge(['salary_max' => str_replace(',', '', $this->salary_max)]);
        }
        
        // Format responsibilities as JSON for DB if it's an array
        if ($this->has('responsibilities') && is_array($this->responsibilities)) {
            $this->merge(['responsibilities' => implode("\n", $this->responsibilities)]);
        }
    }

    public function rulesAfterPrepare()
    {
        // Not used by Laravel natively in FormRequest, removed.
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        \Illuminate\Support\Facades\Log::error('Validation Failed in StoreJobRequest', $validator->errors()->toArray());
        parent::failedValidation($validator);
    }

    protected function passedValidation()
    {
        // Sanitize
        $this->merge([
            'title' => strip_tags($this->title),
            'category' => strip_tags($this->category),
            'description' => strip_tags($this->description),
            'responsibilities' => strip_tags($this->responsibilities),
            'location' => strip_tags($this->location),
        ]);
    }
}
