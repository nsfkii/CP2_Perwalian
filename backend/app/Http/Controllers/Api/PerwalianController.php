<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PerwalianRequest;
use App\Http\Resources\PerwalianResource;
use App\Models\Dosen;
use App\Models\DosenWali;
use App\Models\Mahasiswa;
use App\Models\Perwalian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PerwalianController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Perwalian::with(['mahasiswa', 'dosen']);

        if ($user->role === 'mahasiswa') {
            $mahasiswa = Mahasiswa::where('user_id', $user->id)->first();
            $query->where('mahasiswa_id', $mahasiswa->id ?? 0);
        } elseif ($user->role === 'dosen') {
            $dosen = Dosen::where('user_id', $user->id)->first();
            $query->where('dosen_id', $dosen->id ?? 0);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('topik', 'ilike', "%{$search}%");
        }

        $perwalian = $query->orderBy('tanggal', 'desc')->paginate(10);

        return PerwalianResource::collection($perwalian)->additional([
            'success' => true,
            'message' => 'Data histori perwalian berhasil diambil.',
        ]);
    }

    public function store(PerwalianRequest $request)
    {
        DB::beginTransaction();

        try {
            $user = $request->user();
            $mahasiswa = Mahasiswa::where('user_id', $user->id)->first();
            $dosenWali = DosenWali::where('mahasiswa_id', $mahasiswa->id ?? 0)->first();

            if (! $dosenWali) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda belum memiliki Dosen Wali. Silakan hubungi Admin Akademik.',
                ], 422);
            }

            $perwalian = Perwalian::create([
                'mahasiswa_id' => $mahasiswa->id,
                'dosen_id' => $dosenWali->dosen_id,
                'semester' => $request->semester,
                'tahun_ajaran' => $request->tahun_ajaran,
                'tanggal' => $request->tanggal,
                'topik' => $request->topik,
                'isi_perwalian' => $request->isi_perwalian,
                'status' => 'Selesai',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hasil perwalian berhasil dicatat.',
                'data' => new PerwalianResource($perwalian->load(['mahasiswa', 'dosen'])),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan catatan perwalian: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(Request $request, Perwalian $perwalian)
    {
        $user = $request->user();

        if ($user->role === 'mahasiswa') {
            $mhs = Mahasiswa::where('user_id', $user->id)->first();
            if (! $mhs || $perwalian->mahasiswa_id !== $mhs->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized.',
                ], 403);
            }
        } elseif ($user->role === 'dosen') {
            $dsn = Dosen::where('user_id', $user->id)->first();
            if (! $dsn || $perwalian->dosen_id !== $dsn->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized.',
                ], 403);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail perwalian berhasil diambil.',
            'data' => new PerwalianResource($perwalian->load(['mahasiswa', 'dosen'])),
        ], 200);
    }

    public function update(PerwalianRequest $request, Perwalian $perwalian)
    {
        $perwalian->update($request->only(['semester', 'tahun_ajaran', 'tanggal', 'topik', 'isi_perwalian']));

        return response()->json([
            'success' => true,
            'message' => 'Data perwalian berhasil dikoreksi.',
            'data' => new PerwalianResource($perwalian->load(['mahasiswa', 'dosen'])),
        ], 200);
    }

    public function destroy(Request $request, Perwalian $perwalian)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya admin yang dapat menghapus data.',
            ], 403);
        }

        $perwalian->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data perwalian berhasil dihapus.',
        ], 200);
    }
}
