<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DosenWaliRequest;
use App\Http\Resources\DosenWaliResource;
use App\Models\DosenWali;
use Illuminate\Http\Request;

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
