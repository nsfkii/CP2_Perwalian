<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $mahasiswaId = $this->route('mahasiswa') ? $this->route('mahasiswa')->id : null;

        return [
            'nim' => 'required|string|max:20|unique:mahasiswa,nim,' . $mahasiswaId,
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
