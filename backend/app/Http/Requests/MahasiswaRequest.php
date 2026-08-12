<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $mahasiswa = $this->route('mahasiswa');

        $nimRule = [
            'required',
            'string',
            'max:20',
        ];

        if ($mahasiswa && $mahasiswa->id) {
            $nimRule[] = Rule::unique('mahasiswa', 'nim')->ignore($mahasiswa->id);
        } else {
            $nimRule[] = Rule::unique('mahasiswa', 'nim');
        }

        return [
            'nim' => $nimRule,
            'nama' => 'required|string|max:255',
            'prodi' => 'required|string|max:100',
            'angkatan' => 'required|string|max:4',
            'kelas' => 'required|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'nim.unique' => 'NIM sudah terdaftar di dalam sistem.',
            'nim.required' => 'NIM wajib diisi.',
            'nama.required' => 'Nama wajib diisi.',
        ];
    }
}
