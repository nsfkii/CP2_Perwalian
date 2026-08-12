<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Mahasiswa;
use App\Models\Dosen;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ImportController extends Controller
{
    public function importMahasiswa(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'File tidak valid', 'errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $sheets = Excel::toArray([], $file);
        $rows = $sheets[0] ?? [];

        // detect header row (contains 'nim' or 'nama')
        $hasHeader = false;
        if (isset($rows[0]) && is_array($rows[0])) {
            $first = array_map(function ($v) { return strtolower(trim((string)$v)); }, $rows[0]);
            if (in_array('nim', $first) || in_array('nama', $first)) {
                $hasHeader = true;
            }
        }

        $total = count($rows) - ($hasHeader ? 1 : 0);
        $success = 0;
        $failed = 0;
        $errors = [];

        $start = $hasHeader ? 1 : 0;
        for ($i = $start; $i < count($rows); $i++) {
            $row = $rows[$i];
            // normalize indexes
            $nim = isset($row[0]) ? trim((string)$row[0]) : null;
            $nama = isset($row[1]) ? trim((string)$row[1]) : null;
            $prodi = isset($row[2]) ? trim((string)$row[2]) : null;
            $angkatan = isset($row[3]) ? trim((string)$row[3]) : null;
            $kelas = isset($row[4]) ? trim((string)$row[4]) : null;

            if (empty($nim) || empty($nama)) {
                $failed++;
                $errors[] = ['row' => $i+1, 'nim' => $nim, 'error' => 'NIM atau Nama kosong'];
                continue;
            }

            // check duplicate
            if (Mahasiswa::where('nim', $nim)->exists()) {
                $failed++;
                $errors[] = ['row' => $i+1, 'nim' => $nim, 'error' => 'NIM sudah ada'];
                continue;
            }

            try {
                DB::beginTransaction();

                // create user for mahasiswa
                $userEmail = $nim . '@stmik-bandung.ac.id';
                $user = User::where('email', $userEmail)->first();
                if (!$user) {
                    $user = User::create([
                        'name' => $nama,
                        'email' => $userEmail,
                        'password' => Hash::make($nim),
                        'role' => 'mahasiswa',
                    ]);
                }

                Mahasiswa::create([
                    'user_id' => $user->id,
                    'nim' => $nim,
                    'nama' => $nama,
                    'prodi' => $prodi,
                    'angkatan' => $angkatan,
                    'kelas' => $kelas,
                ]);

                DB::commit();
                $success++;
            } catch (\Exception $e) {
                DB::rollBack();
                $failed++;
                $errors[] = ['row' => $i+1, 'nim' => $nim, 'error' => $e->getMessage()];
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Import selesai",
            'data' => [
                'total_rows' => $total,
                'success_rows' => $success,
                'failed_rows' => $failed,
                'errors' => $errors,
            ]
        ]);
    }

    public function importDosen(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'File tidak valid', 'errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $sheets = Excel::toArray([], $file);
        $rows = $sheets[0] ?? [];

        $hasHeader = false;
        if (isset($rows[0]) && is_array($rows[0])) {
            $first = array_map(function ($v) { return strtolower(trim((string)$v)); }, $rows[0]);
            if (in_array('nidn', $first) || in_array('nama', $first)) {
                $hasHeader = true;
            }
        }

        $total = count($rows) - ($hasHeader ? 1 : 0);
        $success = 0;
        $failed = 0;
        $errors = [];

        $start = $hasHeader ? 1 : 0;
        for ($i = $start; $i < count($rows); $i++) {
            $row = $rows[$i];
            $nidn = isset($row[0]) ? trim((string)$row[0]) : null;
            $nama = isset($row[1]) ? trim((string)$row[1]) : null;
            $email = isset($row[2]) ? trim((string)$row[2]) : null;
            $no_hp = isset($row[3]) ? trim((string)$row[3]) : null;

            if (empty($nidn) || empty($nama)) {
                $failed++;
                $errors[] = ['row' => $i+1, 'nidn' => $nidn, 'error' => 'NIDN atau Nama kosong'];
                continue;
            }

            if (Dosen::where('nidn', $nidn)->exists()) {
                $failed++;
                $errors[] = ['row' => $i+1, 'nidn' => $nidn, 'error' => 'NIDN sudah ada'];
                continue;
            }

            try {
                DB::beginTransaction();

                // prepare user email for dosen
                $userEmail = $email ?: ($nidn . '@stmik-bandung.ac.id');
                $user = User::where('email', $userEmail)->first();
                if (!$user) {
                    $user = User::create([
                        'name' => $nama,
                        'email' => $userEmail,
                        'password' => Hash::make($nidn),
                        'role' => 'dosen',
                    ]);
                }

                Dosen::create([
                    'user_id' => $user->id,
                    'nidn' => $nidn,
                    'nama' => $nama,
                    'email' => $email,
                    'no_hp' => $no_hp,
                ]);

                DB::commit();
                $success++;
            } catch (\Exception $e) {
                DB::rollBack();
                $failed++;
                $errors[] = ['row' => $i+1, 'nidn' => $nidn, 'error' => $e->getMessage()];
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Import selesai",
            'data' => [
                'total_rows' => $total,
                'success_rows' => $success,
                'failed_rows' => $failed,
                'errors' => $errors,
            ]
        ]);
    }
}
