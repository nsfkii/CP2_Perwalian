<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DosenWaliResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'mahasiswa_id' => $this->mahasiswa_id,
            'dosen_id' => $this->dosen_id,
            'mahasiswa' => $this->whenLoaded('mahasiswa', function () {
                return [
                    'nim' => $this->mahasiswa->nim,
                    'nama' => $this->mahasiswa->nama,
                    'prodi' => $this->mahasiswa->prodi,
                ];
            }),
            'dosen' => $this->whenLoaded('dosen', function () {
                return [
                    'nidn' => $this->dosen->nidn,
                    'nama' => $this->dosen->nama,
                ];
            }),
            'created_at' => $this->created_at,
        ];
    }
}
