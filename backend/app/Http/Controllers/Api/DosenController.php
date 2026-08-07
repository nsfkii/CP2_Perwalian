<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DosenRequest;
use App\Http\Resources\DosenResource;
use App\Models\Dosen;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DosenController extends Controller
{
    public function index(Request $request)
    {
        $query = Dosen::with('user');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($query) use ($search) {
                $query->where('nama', 'ilike', "%{$search}%")
                      ->orWhere('nidn', 'ilike', "%{$search}%");
            });
        }

        $dosen = $query->orderBy('created_at', 'desc')->paginate(10);

        return DosenResource::collection($dosen)->additional([
            'success' => true,
            'message' => 'Daftar data dosen berhasil diambil.',
        ]);
    }

    public function store(DosenRequest $request)
    {
        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $request->nama,
                'email' => $request->nidn . '@stmik-bandung.ac.id',
                'password' => Hash::make($request->nidn),
                'role' => 'dosen',
            ]);

            $dosen = Dosen::create([
                'user_id' => $user->id,
                'nidn' => $request->nidn,
                'nama' => $request->nama,
                'email' => $request->email,
                'no_hp' => $request->no_hp,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data dosen berhasil ditambahkan.',
                'data' => new DosenResource($dosen->load('user')),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(Dosen $dosen)
    {
        return response()->json([
            'success' => true,
            'message' => 'Detail dosen berhasil diambil.',
            'data' => new DosenResource($dosen->load('user')),
        ], 200);
    }

    public function update(DosenRequest $request, Dosen $dosen)
    {
        DB::beginTransaction();

        try {
            $dosen->update($request->only(['nidn', 'nama', 'email', 'no_hp']));

            if ($dosen->user) {
                $dosen->user->update([
                    'name' => $request->nama,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data dosen berhasil diperbarui.',
                'data' => new DosenResource($dosen->load('user')),
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Dosen $dosen)
    {
        DB::beginTransaction();

        try {
            if ($dosen->perwalian()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dosen ini tidak dapat dihapus karena sudah memiliki histori perwalian.',
                ], 422);
            }

            if ($dosen->dosenWali()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dosen ini tidak dapat dihapus karena sedang ditugaskan sebagai Dosen Wali.',
                ], 422);
            }

            if ($dosen->user) {
                $dosen->user->delete();
            } else {
                $dosen->delete();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data dosen berhasil dihapus.',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data: ' . $e->getMessage(),
            ], 500);
        }
    }
}
