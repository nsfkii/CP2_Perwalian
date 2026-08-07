<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DosenWaliRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $dosenWaliId = $this->route('dosen_wali') ? $this->route('dosen_wali')->id : null;

        return [
            'mahasiswa_id' => 'required|integer|exists:mahasiswa,id|unique:dosen_wali,mahasiswa_id,' . $dosenWaliId,
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
