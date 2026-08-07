<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PerwalianRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($this->isMethod('post')) {
            return $this->user()->role === 'mahasiswa';
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            return $this->user()->role === 'admin';
        }

        return false;
    }

    public function rules(): array
    {
        return [
            'semester' => 'required|string|max:10',
            'tahun_ajaran' => 'required|string|max:10',
            'tanggal' => 'required|date',
            'topik' => 'required|string|max:50',
            'isi_perwalian' => 'required|string',
        ];
    }
}
