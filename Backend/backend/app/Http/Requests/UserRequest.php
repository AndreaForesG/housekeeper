<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|',
            'password' => 'required|string|min:8',
            'role_id' => 'required',
            'hotel_id' => 'required'
        ];

    }

    public function messages()
    {
        return [
            'name.required' => 'El nombre es obligatorio',
            'email.required' => 'El correo electrónico es obligatorio',
            'password.required' => 'La contraseña es obligatoria',
            'role_id.required' => 'El rol es obligatorio',
            'hotel_id.required' => 'El hotel es obligatorio'
        ];
    }
}
