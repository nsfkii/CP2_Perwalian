import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { getRekapData, exportData } from '../../api/rekap';
import { FiDownload, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function RekapPerwalian() {
  const [data, setData] = useState(null);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getRekapData();
      // getRekapData returns full axios response; actual rows are in res.data.data
      setData(res.data?.data || []);
    } catch (error) {
      toast.error('Gagal mengambil data rekap');
    }
  };

  const handleExport = async (format) => {
    if (format === 'excel') setIsExportingExcel(true);
    else setIsExportingPdf(true);

    try {
      await exportData(format);
      toast.success(`Berhasil mengunduh laporan ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Gagal mengunduh laporan ${format.toUpperCase()}`);
    } finally {
      if (format === 'excel') setIsExportingExcel(false);
      else setIsExportingPdf(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-dark fw-bold">Rekap Data Perwalian</h2>
        <div className="d-flex gap-2">
          <Button
            variant="outline-success"
            onClick={() => handleExport('excel')}
            disabled={isExportingExcel}
            className="d-flex align-items-center bg-white"
          >
            {isExportingExcel ? <span className="spinner-border spinner-border-sm me-2"></span> : <FiFileText className="me-2" />}
            Export Excel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleExport('pdf')}
            disabled={isExportingPdf}
            className="d-flex align-items-center"
          >
            {isExportingPdf ? <span className="spinner-border spinner-border-sm me-2"></span> : <FiDownload className="me-2" />}
            Export PDF
          </Button>
        </div>
      </div>

      <div className="card-custom p-3">
        {/* Simple table preview */}
        {data && data.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
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
                {data.map((row, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{row.tanggal}</td>
                    <td>{row.mahasiswa?.nama || '-'}</td>
                    <td>{row.dosen?.nama || '-'}</td>
                    <td>{row.topik}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-4 text-muted">Belum ada data untuk ditampilkan.</div>
        )}
      </div>
    </div>
  );
}
