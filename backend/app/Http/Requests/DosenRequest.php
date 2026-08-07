<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DosenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $dosenId = $this->route('dosen') ? $this->route('dosen')->id : null;

        return [
            'nidn' => 'required|string|max:20|unique:dosen,nidn,' . $dosenId,
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:dosen,email,' . $dosenId,
            'no_hp' => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'nidn.unique' => 'NIDN sudah terdaftar di dalam sistem.',
            'nidn.required' => 'NIDN wajib diisi.',
            'nama.required' => 'Nama dosen wajib diisi.',
            'email.unique' => 'Email profil sudah digunakan oleh dosen lain.',
        ];
    }
}
