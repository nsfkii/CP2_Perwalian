<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Perwalian;
use App\Exports\PerwalianExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class RekapController extends Controller
{
    public function getRekap(Request $request)
    {
        $query = Perwalian::with(['mahasiswa', 'dosen'])
            ->orderBy('tanggal', 'desc');

        // KHUSUS ADMIN
        // Tetap seperti sebelumnya: admin hanya bisa filter berdasarkan dosen.
        if (
            $request->user()->role === 'admin' &&
            $request->filled('dosen_id')
        ) {
            $query->where('dosen_id', $request->dosen_id);
        }

        $perwalians = $query->paginate(15);

        // summary counts for dashboard
        $totalMahasiswa = \App\Models\Mahasiswa::count();
        $totalDosen = \App\Models\Dosen::count();
        $totalPerwalian = Perwalian::count();

        return response()->json([
            'success' => true,
            'data' => $perwalians->items(),
            'meta' => [
                'total' => $perwalians->total(),
                'per_page' => $perwalians->perPage(),
                'current_page' => $perwalians->currentPage(),
                'last_page' => $perwalians->lastPage(),
            ],
            'summary' => [
                'total_mahasiswa' => $totalMahasiswa,
                'total_dosen' => $totalDosen,
                'total_perwalian' => $totalPerwalian,
            ],
        ]);
    }

    public function exportExcel(Request $request)
    {
        $user = $request->user();

        // Tetap menerima dosen_id untuk ADMIN
        $dosenId = $request->query('dosen_id');

        // mahasiswa_id hanya digunakan oleh DOSEN
        $mahasiswaId = null;

        if ($user->role === 'dosen') {
            $dosen = \App\Models\Dosen::where(
                'user_id',
                $user->id
            )->first();

            // Dosen otomatis menggunakan dosen yang sedang login
            $dosenId = $dosen->id ?? 0;

            // Opsional: dosen memilih 1 mahasiswa
            $mahasiswaId = $request->query('mahasiswa_id');
        }

        return Excel::download(
            new PerwalianExport(
                $dosenId ? (int) $dosenId : null,
                $mahasiswaId ? (int) $mahasiswaId : null
            ),
            'rekap_perwalian_stmik.xlsx'
        );
    }

    public function exportPdf(Request $request)
    {
        $user = $request->user();

        // Tetap menerima dosen_id untuk ADMIN
        $dosenId = $request->query('dosen_id');

        $query = Perwalian::with(['mahasiswa', 'dosen'])
            ->orderBy('tanggal', 'desc');

        if ($user->role === 'dosen') {
            $dosen = \App\Models\Dosen::where(
                'user_id',
                $user->id
            )->first();

            // Dosen otomatis menggunakan dosen yang sedang login
            $dosenId = $dosen->id ?? 0;

            // Hanya DOSEN yang boleh memfilter berdasarkan mahasiswa
            if ($request->filled('mahasiswa_id')) {
                $query->where(
                    'mahasiswa_id',
                    $request->mahasiswa_id
                );
            }
        }

        // Filter berdasarkan dosen
        // Tetap berlaku untuk ADMIN dan DOSEN
        if ($dosenId) {
            $query->where('dosen_id', $dosenId);
        }

        $perwalians = $query->get();

        $pdf = Pdf::loadView(
            'rekap_pdf',
            compact('perwalians')
        );

        $pdf->setPaper('A4', 'landscape');

        return $pdf->download(
            'rekap_perwalian_stmik.pdf'
        );
    }
}