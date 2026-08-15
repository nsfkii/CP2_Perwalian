<?php 
 
namespace App\Http\Controllers\Api; 
 
use App\Http\Controllers\Controller; 
use App\Http\Requests\MahasiswaRequest; 
use App\Http\Resources\MahasiswaResource; 
use App\Models\Mahasiswa; 
use App\Models\User; 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Hash; 
 
class MahasiswaController extends Controller 
{ 
    public function index(Request $request) 
    { 
        $query = Mahasiswa::with('user'); 
 
        if ($request->filled('search')) { 
            $search = $request->search; 
            $query->where(function ($query) use ($search) { 
                $query->where('nama', 'ilike', "%{$search}%") 
                    ->orWhere('nim', 'ilike', "%{$search}%"); 
            }); 
        } 
 
        if ($request->filled('prodi')) { 
            $query->where('prodi', $request->prodi); 
        } 
 
        $mahasiswa = $query->orderBy('created_at', 'desc')->paginate(10); 
 
        return MahasiswaResource::collection($mahasiswa)->additional([ 
            'success' => true, 
            'message' => 'Daftar data mahasiswa berhasil diambil.' 
        ]); 
    }


    // ==========================================
    // PROFIL MAHASISWA YANG SEDANG LOGIN
    // ==========================================
    public function profil(Request $request)
    {
        $user = $request->user();

        $mahasiswa = Mahasiswa::with([
            'user',
            'dosenWali.dosen'
        ])
        ->where('user_id', $user->id)
        ->first();

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Data mahasiswa tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil mahasiswa berhasil diambil.',
            'data' => [
                'id' => $mahasiswa->id,
                'nim' => $mahasiswa->nim,
                'nama' => $mahasiswa->nama,
                'prodi' => $mahasiswa->prodi,
                'angkatan' => $mahasiswa->angkatan,
                'kelas' => $mahasiswa->kelas,
                'email' => $mahasiswa->user?->email,

                'dosen_wali' => $mahasiswa->dosenWali ? [
                    'id' => $mahasiswa->dosenWali->dosen?->id,
                    'nidn' => $mahasiswa->dosenWali->dosen?->nidn,
                    'nama' => $mahasiswa->dosenWali->dosen?->nama,
                ] : null,
            ],
        ], 200);
    }


    public function store(MahasiswaRequest $request) 
    { 
        DB::beginTransaction(); 
 
        try { 
            $user = User::create([ 
                'name' => $request->nama, 
                'email' => $request->nim . '@stmik-bandung.ac.id', 
                'password' => Hash::make($request->nim), 
                'role' => 'mahasiswa', 
            ]); 
 
            $mahasiswa = Mahasiswa::create([ 
                'user_id' => $user->id, 
                'nim' => $request->nim, 
                'nama' => $request->nama, 
                'prodi' => $request->prodi, 
                'angkatan' => $request->angkatan, 
                'kelas' => $request->kelas, 
            ]); 
 
            DB::commit(); 
 
            return response()->json([ 
                'success' => true, 
                'message' => 'Data mahasiswa berhasil ditambahkan.', 
                'data' => new MahasiswaResource($mahasiswa->load('user')), 
            ], 201); 
        } catch (\Exception $e) { 
            DB::rollBack(); 
 
            return response()->json([ 
                'success' => false, 
                'message' => 'Gagal menyimpan data: ' . $e->getMessage(), 
            ], 500); 
        } 
    } 
 
    public function show(Mahasiswa $mahasiswa) 
    { 
        return response()->json([ 
            'success' => true, 
            'message' => 'Detail mahasiswa berhasil diambil.', 
            'data' => new MahasiswaResource($mahasiswa->load('user')), 
        ], 200); 
    } 
 
    public function update(MahasiswaRequest $request, Mahasiswa $mahasiswa) 
    { 
        DB::beginTransaction(); 
 
        try { 
            $mahasiswa->update($request->only(['nim', 'nama', 'prodi', 'angkatan', 'kelas'])); 
 
            if ($mahasiswa->user) { 
                $mahasiswa->user->update([ 
                    'name' => $request->nama, 
                ]); 
            } 
 
            DB::commit(); 
 
            return response()->json([ 
                'success' => true, 
                'message' => 'Data mahasiswa berhasil diperbarui.', 
                'data' => new MahasiswaResource($mahasiswa->load('user')), 
            ], 200); 
        } catch (\Exception $e) { 
            DB::rollBack(); 
 
            return response()->json([ 
                'success' => false, 
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(), 
            ], 500); 
        } 
    } 
 
    public function destroy(Mahasiswa $mahasiswa) 
    { 
        DB::beginTransaction(); 
 
        try { 
            if ($mahasiswa->perwalian()->exists()) { 
                return response()->json([ 
                    'success' => false, 
                    'message' => 'Mahasiswa ini tidak dapat dihapus karena memiliki histori perwalian.', 
                ], 422); 
            } 
 
            if ($mahasiswa->user) { 
                $mahasiswa->user->delete(); 
            } else { 
                $mahasiswa->delete(); 
            } 
 
            DB::commit(); 
 
            return response()->json([ 
                'success' => true, 
                'message' => 'Data mahasiswa berhasil dihapus.', 
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