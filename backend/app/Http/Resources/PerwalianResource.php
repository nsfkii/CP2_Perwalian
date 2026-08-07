<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PerwalianResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'semester' => $this->semester,
            'tahun_ajaran' => $this->tahun_ajaran,
            'tanggal' => $this->tanggal,
            'topik' => $this->topik,
            'isi_perwalian' => $this->isi_perwalian,
            'status' => $this->status,
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
