<?php

namespace App\Models;

use App\Models\DosenWali;
use App\Models\Perwalian;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Dosen extends Model
{
    protected $table = 'dosen';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function dosenWali()
    {
        return $this->hasMany(DosenWali::class);
    }

    public function perwalian()
    {
        return $this->hasMany(Perwalian::class, 'dosen_id');
    }
}
