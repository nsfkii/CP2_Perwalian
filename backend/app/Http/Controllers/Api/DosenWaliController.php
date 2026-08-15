<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DosenWaliRequest;
use App\Http\Resources\DosenWaliResource;
use App\Models\DosenWali;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DosenWaliController extends Controller
{
    public function index(Request $request)
    {
        $query = DosenWali::with(['mahasiswa', 'dosen']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('mahasiswa', function ($q) use ($search) {
                $q->where('nama', 'ilike', "%{$search}%")
                  ->orWhere('nim', 'ilike', "%{$search}%");
            })->orWhereHas('dosen', function ($q) use ($search) {
                $q->where('nama', 'ilike', "%{$search}%");
            });
        }

        $dosenWali = $query->orderBy('created_at', 'desc')->paginate(10);

        return DosenWaliResource::collection($dosenWali)->additional([
            'success' => true,
            'message' => 'Daftar dosen wali berhasil diambil.',
        ]);
    }

    // Mengambil mahasiswa yang belum memiliki dosen wali
    public function mahasiswaBelumPunyaWali()
    {
        $mahasiswa = Mahasiswa::whereDoesntHave('dosenWali')
            ->orderBy('nama', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar mahasiswa yang belum memiliki dosen wali berhasil diambil.',
            'data' => $mahasiswa,
        ], 200);
    }

    // Menetapkan satu atau beberapa mahasiswa ke dosen wali
    public function storeMany(Request $request)
    {
        $validated = $request->validate([
            'dosen_id' => ['required', 'exists:dosen,id'],
            'mahasiswa_ids' => ['required', 'array', 'min:1'],
            'mahasiswa_ids.*' => ['required', 'exists:mahasiswa,id'],
        ]);

        DB::beginTransaction();

        try {
            $berhasil = 0;

            foreach ($validated['mahasiswa_ids'] as $mahasiswaId) {
                // Pastikan mahasiswa belum memiliki dosen wali
                $sudahAda = DosenWali::where('mahasiswa_id', $mahasiswaId)->exists();

                if (!$sudahAda) {
                    DosenWali::create([
                        'mahasiswa_id' => $mahasiswaId,
                        'dosen_id' => $validated['dosen_id'],
                    ]);

                    $berhasil++;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "{$berhasil} mahasiswa berhasil ditetapkan sebagai mahasiswa wali.",
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menetapkan mahasiswa: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(DosenWaliRequest $request)
    {
        $dosenWali = DosenWali::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Dosen Wali berhasil ditetapkan.',
            'data' => new DosenWaliResource($dosenWali->load(['mahasiswa', 'dosen'])),
        ], 201);
    }

    public function show(DosenWali $dosenWali)
    {
        return response()->json([
            'success' => true,
            'message' => 'Detail dosen wali berhasil diambil.',
            'data' => new DosenWaliResource($dosenWali->load(['mahasiswa', 'dosen'])),
        ], 200);
    }

    public function update(DosenWaliRequest $request, DosenWali $dosenWali)
    {
        $dosenWali->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Data Dosen Wali berhasil diperbarui.',
            'data' => new DosenWaliResource($dosenWali->load(['mahasiswa', 'dosen'])),
        ], 200);
    }

    public function destroy(DosenWali $dosenWali)
    {
        $dosenWali->delete();

        return response()->json([
            'success' => true,
            'message' => 'Penugasan Dosen Wali berhasil dihapus.',
        ], 200);
    }
}