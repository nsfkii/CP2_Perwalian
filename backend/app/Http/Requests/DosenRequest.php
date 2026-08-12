<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DosenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $dosen = $this->route('dosen');

        $nidnRule = [
            'required',
            'string',
            'max:20',
            'regex:/^[0-9]+$/',
        ];

        if ($dosen && $dosen->id) {
            $nidnRule[] = Rule::unique('dosen', 'nidn')->ignore($dosen->id);
        } else {
            $nidnRule[] = Rule::unique('dosen', 'nidn');
        }

        $emailRule = ['nullable', 'email', 'max:255'];
        if ($dosen && $dosen->id) {
            $emailRule[] = Rule::unique('dosen', 'email')->ignore($dosen->id);
        } else {
            $emailRule[] = Rule::unique('dosen', 'email');
        }

        return [
            'nidn' => $nidnRule,
            'nama' => 'required|string|max:255',
            'email' => $emailRule,
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
