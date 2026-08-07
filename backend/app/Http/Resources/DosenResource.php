<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DosenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nidn' => $this->nidn,
            'nama' => $this->nama,
            'email_profil' => $this->email,
            'no_hp' => $this->no_hp,
            'email_login' => $this->whenLoaded('user', function () {
                return $this->user?->email;
            }),
        ];
    }
}
