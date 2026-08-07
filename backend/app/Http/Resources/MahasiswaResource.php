<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MahasiswaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nim' => $this->nim,
            'nama' => $this->nama,
            'prodi' => $this->prodi,
            'angkatan' => $this->angkatan,
            'kelas' => $this->kelas,
            'email' => $this->whenLoaded('user', function () {
                return $this->user?->email;
            }),
        ];
    }
}
