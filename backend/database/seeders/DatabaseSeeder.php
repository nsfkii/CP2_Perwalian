<?php

namespace Database\Seeders;

use App\Models\Dosen;
use App\Models\DosenWali;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('dosen_wali')->truncate();
        DB::table('perwalian')->truncate();
        DB::table('mahasiswa')->truncate();
        DB::table('dosen')->truncate();
        DB::table('personal_access_tokens')->truncate();
        DB::table('users')->truncate();
        Schema::enableForeignKeyConstraints();

        // --- 1. SEEDER ADMIN ---
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@stmik-bandung.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // --- 2. SEEDER DOSEN ---
        $userMina = User::create([
            'name' => 'Mina Ismu Rahayu, M.T',
            'email' => 'mina@stmik-bandung.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'dosen',
        ]);
        $dosenMina = Dosen::create([
            'user_id' => $userMina->id,
            'nidn' => '0412345678',
            'nama' => 'Mina Ismu Rahayu, M.T',
            'email' => 'mina@stmik-bandung.ac.id',
            'no_hp' => '081200001111',
        ]);

        $userEva = User::create([
            'name' => 'Eva Diah Novitasari, S. Kom',
            'email' => 'eva@stmik-bandung.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'dosen',
        ]);
        $dosenEva = Dosen::create([
            'user_id' => $userEva->id,
            'nidn' => '0487654321',
            'nama' => 'Eva Diah Novitasari, S. Kom',
            'email' => 'eva@stmik-bandung.ac.id',
            'no_hp' => '081200002222',
        ]);

        // --- 3. SEEDER MAHASISWA ---
        $userRyan = User::create([
            'name' => 'Ryan Garnida',
            'email' => '1223017@stmik-bandung.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'mahasiswa',
        ]);
        $mhsRyan = Mahasiswa::create([
            'user_id' => $userRyan->id,
            'nim' => '1223017',
            'nama' => 'Ryan Garnida',
            'prodi' => 'Teknik Informatika',
            'angkatan' => '2023',
            'kelas' => 'Reguler Pagi',
        ]);

        $userNur = User::create([
            'name' => 'Nur Alifah Anggraeni',
            'email' => '1224021@stmik-bandung.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'mahasiswa',
        ]);
        $mhsNur = Mahasiswa::create([
            'user_id' => $userNur->id,
            'nim' => '1224021',
            'nama' => 'Nur Alifah Anggraeni',
            'prodi' => 'Teknik Informatika',
            'angkatan' => '2024',
            'kelas' => 'Reguler Pagi',
        ]);

        // --- 4. SEEDER DOSEN WALI ---
        DosenWali::create([
            'mahasiswa_id' => $mhsRyan->id,
            'dosen_id' => $dosenMina->id,
        ]);

        DosenWali::create([
            'mahasiswa_id' => $mhsNur->id,
            'dosen_id' => $dosenEva->id,
        ]);
    }
}
