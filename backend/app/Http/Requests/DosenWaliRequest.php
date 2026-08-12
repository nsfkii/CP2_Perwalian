<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DosenWaliRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $dosenWali = $this->route('dosen_wali');

        $mahasiswaRule = [
            'required',
            'integer',
            'exists:mahasiswa,id',
        ];

        if ($dosenWali && $dosenWali->id) {
            $mahasiswaRule[] = Rule::unique('dosen_wali', 'mahasiswa_id')->ignore($dosenWali->id);
        } else {
            $mahasiswaRule[] = Rule::unique('dosen_wali', 'mahasiswa_id');
        }

        return [
            'mahasiswa_id' => $mahasiswaRule,
            'dosen_id' => 'required|integer|exists:dosen,id',
        ];
    }

    public function messages(): array
    {
        return [
            'mahasiswa_id.required' => 'Mahasiswa wajib dipilih.',
            'mahasiswa_id.exists' => 'Data mahasiswa tidak ditemukan di sistem.',
            'mahasiswa_id.unique' => 'Mahasiswa ini sudah memiliki Dosen Wali.',
            'dosen_id.required' => 'Dosen wajib dipilih.',
            'dosen_id.exists' => 'Data dosen tidak ditemukan di sistem.',
        ];
    }
}
