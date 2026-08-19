import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { getRekapData, exportData } from '../../api/rekap';
import { getDosens } from '../../api/dosen';
import { FiDownload, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function RekapPerwalian() {
  const [data, setData] = useState(null);
  const [dosenOptions, setDosenOptions] = useState([]);
  const [dosenSearch, setDosenSearch] = useState('');
  const [showDosenSearchResults, setShowDosenSearchResults] = useState(false);
  const [filterDosen, setFilterDosen] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('');
  const [selectedDosen, setSelectedDosen] = useState('');
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRekapData({ dosen_id: filterDosen });
        setData(response.data?.data || []);
      } catch {
        toast.error('Gagal mengambil data rekap');
      }
    };

    fetchData();
  }, [filterDosen]);

  useEffect(() => {
    const fetchDosenOptions = async () => {
      try {
        const response = await getDosens(1, '');
        setDosenOptions(response.data || []);
      } catch {
        toast.error('Gagal memuat daftar dosen');
      }
    };

    fetchDosenOptions();
  }, []);

  const filteredDosenOptions = [...dosenOptions]
    .sort((first, second) => first.nama.localeCompare(second.nama, 'id'))
    .filter((dosen) => dosen.nama.toLowerCase().includes(dosenSearch.toLowerCase()));

  const sortedDosenOptions = [...dosenOptions].sort((first, second) => (
    first.nama.localeCompare(second.nama, 'id')
  ));

  const triggerExportModal = (format) => {
    setExportFormat(format);
    setSelectedDosen('');
    setShowExportModal(true);
  };

  const processExport = async () => {
    setShowExportModal(false);
    const setExporting = exportFormat === 'excel' ? setIsExportingExcel : setIsExportingPdf;
    setExporting(true);

    try {
      await exportData(exportFormat, selectedDosen);
      toast.success(`Berhasil mengunduh laporan ${exportFormat.toUpperCase()}`);
    } catch {
      toast.error(`Gagal mengunduh laporan ${exportFormat.toUpperCase()}`);
    } finally {
      setExporting(false);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-dark fw-bold">Rekap Data Perwalian</h2>
        <div className="d-flex gap-2">
          <Button
            variant="outline-success"
            onClick={() => triggerExportModal('excel')}
            disabled={isExportingExcel || isExportingPdf}
            className="d-flex align-items-center bg-white"
          >
            {isExportingExcel ? <span className="spinner-border spinner-border-sm me-2" /> : <FiFileText className="me-2" />}
            Export Excel
          </Button>
          <Button
            variant="danger"
            onClick={() => triggerExportModal('pdf')}
            disabled={isExportingExcel || isExportingPdf}
            className="d-flex align-items-center"
          >
            {isExportingPdf ? <span className="spinner-border spinner-border-sm me-2" /> : <FiDownload className="me-2" />}
            Export PDF
          </Button>
        </div>
      </div>

      <div className="card-custom p-3 mb-4 bg-light">
        <Form.Group>
          <Form.Label className="text-muted small fw-bold mb-1">
            Filter Tampilan Berdasarkan Dosen Wali
          </Form.Label>
          <div className="position-relative">
            <InputGroup>
              <Form.Select
                value={filterDosen}
                onChange={(event) => setFilterDosen(event.target.value)}
                className="border-primary"
                style={{ maxWidth: '230px' }}
                aria-label="Filter dosen wali"
              >
                <option value="">Semua Rekap</option>
                {sortedDosenOptions.map((dosen) => (
                  <option key={dosen.id} value={dosen.id}>
                    {dosen.nama} ({dosen.nidn})
                  </option>
                ))}
              </Form.Select>
              <Form.Control
                type="search"
                value={dosenSearch}
                onFocus={() => setShowDosenSearchResults(Boolean(dosenSearch))}
                onChange={(event) => {
                  setDosenSearch(event.target.value);
                  setShowDosenSearchResults(true);
                }}
                onBlur={() => setTimeout(() => setShowDosenSearchResults(false), 150)}
                placeholder="Cari nama dosen..."
                className="border-primary"
                aria-label="Cari nama dosen wali"
              />
            </InputGroup>
            {showDosenSearchResults && dosenSearch.trim() && (
              <div
                className="position-absolute start-0 end-0 bg-white border border-primary rounded-bottom shadow-sm"
                style={{ zIndex: 10, maxHeight: '220px', overflowY: 'auto' }}
              >
                {filteredDosenOptions.map((dosen) => (
                  <button
                    type="button"
                    className="dropdown-item text-start"
                    key={dosen.id}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setFilterDosen(String(dosen.id));
                      setDosenSearch('');
                      setShowDosenSearchResults(false);
                    }}
                  >
                    {dosen.nama} ({dosen.nidn})
                  </button>
                ))}
                {filteredDosenOptions.length === 0 && (
                  <div className="px-3 py-2 text-muted">Dosen tidak ditemukan.</div>
                )}
              </div>
            )}
          </div>
        </Form.Group>
      </div>

      <div className="card-custom p-3">
        {data.length > 0 ? (
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
                {data.map((row, index) => (
                  <tr key={row.id || index}>
                    <td>{index + 1}</td>
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

      <Modal show={showExportModal} onHide={() => setShowExportModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">Konfirmasi Export {exportFormat.toUpperCase()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Pilih Dosen (Filter Laporan)</Form.Label>
            <Form.Select value={selectedDosen} onChange={(event) => setSelectedDosen(event.target.value)}>
              <option value="">-- Cetak Seluruh Data --</option>
              {sortedDosenOptions.map((dosen) => (
                <option key={dosen.id} value={dosen.id}>
                  {dosen.nama} (NIDN: {dosen.nidn})
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Pilih dosen untuk mengunduh laporan perwalian dosen tersebut saja.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowExportModal(false)}>Batal</Button>
          <Button variant="primary" onClick={processExport}>Unduh</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
