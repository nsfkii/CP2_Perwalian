<?php

namespace App\Exports;

use App\Models\Perwalian;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PerwalianExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        private readonly ?int $dosenId = null,
        private readonly ?int $mahasiswaId = null
    ) {
    }

    public function collection()
    {
        $query = Perwalian::with(['mahasiswa', 'dosen'])
            ->orderBy('tanggal', 'desc');

        // FILTER DOSEN
        
        if ($this->dosenId) {
            $query->where('dosen_id', $this->dosenId);
        }

        // FILTER MAHASISWA
    
        if ($this->mahasiswaId) {
            $query->where('mahasiswa_id', $this->mahasiswaId);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Tanggal',
            'Semester',
            'Tahun Ajaran',
            'NIM',
            'Nama Mahasiswa',
            'Program Studi',
            'NIDN',
            'Nama Dosen Wali',
            'Topik',
            'Isi Catatan',
            'Status'
        ];
    }

    public function map($perwalian): array
    {
        static $urutan = 1;

        return [
            $urutan++,
            $perwalian->tanggal,
            $perwalian->semester,
            $perwalian->tahun_ajaran,
            $perwalian->mahasiswa->nim ?? '-',
            $perwalian->mahasiswa->nama ?? '-',
            $perwalian->mahasiswa->prodi ?? '-',
            $perwalian->dosen->nidn ?? '-',
            $perwalian->dosen->nama ?? '-',
            $perwalian->topik,
            $perwalian->isi_perwalian,
            $perwalian->status,
        ];
    }
}