<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Rekap Data Perwalian</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-center { text-align: center; }
        .header { margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
    </style>
</head>
<body>
    <div class="header text-center">
        <h2>STMIK BANDUNG</h2>
        <p>Jl. Cikutra No. 113-A Bandung</p>
        <h3>REKAPITULASI DATA PERWALIAN MAHASISWA</h3>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Mahasiswa</th>
                <th>Dosen Wali</th>
                <th>Topik</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($perwalians as $index => $row)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $row->tanggal }}</td>
                <td>{{ $row->mahasiswa->nama ?? '-' }} <br> <small>{{ $row->mahasiswa->nim ?? '-' }}</small></td>
                <td>{{ $row->dosen->nama ?? '-' }}</td>
                <td>{{ $row->topik }}</td>
                <td class="text-center">{{ $row->status }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
