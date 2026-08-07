<?php

namespace App\Models;

use App\Models\DosenWali;
use App\Models\Perwalian;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Model
{
    protected $table = 'mahasiswa';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function perwalian()
    {
        return $this->hasMany(Perwalian::class, 'mahasiswa_id');
    }

    public function dosenWali()
    {
        return $this->hasOne(DosenWali::class);
    }
}
