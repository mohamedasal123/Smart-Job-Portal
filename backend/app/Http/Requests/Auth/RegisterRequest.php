<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower(trim((string) $this->email)),
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => 'required|string|min:2|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed|regex:/^(?=.*[A-Z])(?=.*[0-9]).+$/',
            'role'     => 'required|in:job_seeker,company',
        ];
    }
    
    protected function passedValidation()
    {
        // Sanitize
        $this->merge([
            'name' => strip_tags($this->name),
        ]);
    }
}
