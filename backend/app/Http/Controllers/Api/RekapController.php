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
        $query = Perwalian::with(['mahasiswa', 'dosen'])->orderBy('tanggal', 'desc');

        // optional filters (page, search, tanggal range) can be added here
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

    public function exportExcel()
    {
        return Excel::download(new PerwalianExport, 'rekap_perwalian_stmik.xlsx');
    }

    public function exportPdf()
    {
        $perwalians = Perwalian::with(['mahasiswa', 'dosen'])->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('rekap_pdf', compact('perwalians'));
        $pdf->setPaper('A4', 'landscape');

        return $pdf->download('rekap_perwalian_stmik.pdf');
    }
}
