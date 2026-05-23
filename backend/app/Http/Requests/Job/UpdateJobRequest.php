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
        $skillsRule = 'required_with:skills|string';
        if ($this->has('skills') && is_array($this->skills) && isset($this->skills[0]['name'])) {
            $skillsRule = 'required_with:skills|array';
        }

        return [
            'title'              => 'sometimes|required|string|max:255',
            'category'           => 'sometimes|required|string|max:255',
            'description'        => 'sometimes|required|string',
            'responsibilities'   => 'nullable|string',
            'location'           => 'nullable|string|max:255',
            'work_mode'          => 'nullable|string|max:255',
            'job_type'           => 'sometimes|required|in:full_time,part_time,remote,contract,internship',
            'salary_min'         => 'nullable|numeric|min:0|max:9999999',
            'salary_max'         => 'nullable|numeric|min:0|max:9999999',
            'experience_level'   => 'nullable|string|max:255',
            'education'          => 'nullable|string|max:255',
            'status'             => 'nullable|in:draft,active,paused,closed',
            'skills'             => 'sometimes|required|array|min:1',
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

    protected function passedValidation(): void
    {
        $this->merge([
            'title'           => $this->has('title') ? strip_tags($this->title) : $this->title,
            'category'        => $this->has('category') ? strip_tags($this->category) : $this->category,
            'description'     => $this->has('description') ? strip_tags($this->description) : $this->description,
            'responsibilities' => $this->has('responsibilities') ? strip_tags($this->responsibilities) : $this->responsibilities,
            'location'        => $this->has('location') ? strip_tags($this->location) : $this->location,
        ]);
    }
}
