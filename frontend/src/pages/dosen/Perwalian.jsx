import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Table,
    InputGroup,
    FormControl,
    Button,
    Badge,
    Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
    FiSearch,
    FiUsers,
    FiFileText,
    FiDownload,
} from 'react-icons/fi';

import { getPerwalians } from '../../api/perwalian';
import { exportDosenPerwalian } from '../../api/dosenPerwalian';
import api from '../../api/axios';

export default function DosenPerwalian() {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loadingMahasiswa, setLoadingMahasiswa] = useState(true);

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [exporting, setExporting] = useState('');

    // Mahasiswa yang menjadi wali dosen login
    const [mahasiswaWali, setMahasiswaWali] = useState([]);

    // '' = semua mahasiswa
    const [selectedMahasiswa, setSelectedMahasiswa] = useState('');

    // =========================================================
    // AMBIL HISTORI PERWALIAN
    // =========================================================
    const fetchPerwalians = useCallback(async (page, searchQuery) => {
        setLoading(true);

        try {
            const res = await getPerwalians(page, searchQuery);

            setData(res.data);
            setMeta(res.meta);
        } catch (error) {
            console.error(error);

            toast.error(
                'Gagal mengambil histori perwalian mahasiswa bimbingan'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPerwalians(currentPage, search);
    }, [currentPage, search, fetchPerwalians]);

    // =========================================================
    // AMBIL DAFTAR MAHASISWA WALI DOSEN
    // =========================================================
    const fetchMahasiswaWali = async () => {
        setLoadingMahasiswa(true);

        try {
            const response = await api.get('/dosen/mahasiswa-wali');

            setMahasiswaWali(response.data.data || []);
        } catch (error) {
            console.error(error);

            toast.error(
                'Gagal mengambil daftar mahasiswa bimbingan'
            );
        } finally {
            setLoadingMahasiswa(false);
        }
    };

    useEffect(() => {
        fetchMahasiswaWali();
    }, []);

    // =========================================================
    // SEARCH
    // =========================================================
    const handleSearch = (e) => {
        e.preventDefault();

        setCurrentPage(1);

        fetchPerwalians(1, search);
    };

    // =========================================================
    // EXPORT
    // =========================================================
    const handleExport = async (format) => {
        try {
            setExporting(format);

            await exportDosenPerwalian(
                format,
                selectedMahasiswa
            );

            toast.success(
                `Data berhasil diexport ke ${
                    format === 'excel' ? 'Excel' : 'PDF'
                }.`
            );
        } catch (error) {
            console.error(error);

            toast.error(
                `Gagal mengexport data ke ${
                    format === 'excel' ? 'Excel' : 'PDF'
                }.`
            );
        } finally {
            setExporting('');
        }
    };

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold text-dark mb-0">
                    Histori Perwalian Mahasiswa
                </h4>

                <p className="text-muted small mb-0">
                    Pantau catatan konsultasi dari mahasiswa bimbingan Anda
                </p>
            </div>

            <Card className="card-custom border-0 shadow-sm">
                <Card.Body>

                    {/* =====================================================
                        SEARCH + FILTER MAHASISWA + EXPORT
                    ===================================================== */}
                    <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">

                        {/* SEARCH */}
                        <form
                            onSubmit={handleSearch}
                            className="col-md-4"
                        >
                            <InputGroup>
                                <FormControl
                                    placeholder="Cari berdasarkan topik..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />

                                <Button
                                    variant="outline-secondary"
                                    type="submit"
                                >
                                    <FiSearch />
                                </Button>
                            </InputGroup>
                        </form>

                        {/* FILTER + EXPORT */}
                        <div className="d-flex gap-2 align-items-end flex-wrap">

                            {/* PILIH MAHASISWA */}
                            <div>
                                <Form.Label className="small text-muted mb-1">
                                    Export berdasarkan mahasiswa
                                </Form.Label>

                                <Form.Select
                                    value={selectedMahasiswa}
                                    onChange={(e) =>
                                        setSelectedMahasiswa(e.target.value)
                                    }
                                    disabled={
                                        loadingMahasiswa ||
                                        exporting !== ''
                                    }
                                    style={{
                                        minWidth: '220px',
                                    }}
                                >
                                    <option value="">
                                        Semua Mahasiswa
                                    </option>

                                    {mahasiswaWali.map((mahasiswa) => (
                                        <option
                                            key={mahasiswa.id}
                                            value={mahasiswa.id}
                                        >
                                            {mahasiswa.nama}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>

                            {/* EXPORT EXCEL */}
                            <Button
                                variant="outline-success"
                                onClick={() =>
                                    handleExport('excel')
                                }
                                disabled={exporting !== ''}
                            >
                                <FiFileText className="me-1" />

                                {exporting === 'excel'
                                    ? 'Mengexport...'
                                    : 'Export Excel'}
                            </Button>

                            {/* EXPORT PDF */}
                            <Button
                                variant="outline-danger"
                                onClick={() =>
                                    handleExport('pdf')
                                }
                                disabled={exporting !== ''}
                            >
                                <FiDownload className="me-1" />

                                {exporting === 'pdf'
                                    ? 'Mengexport...'
                                    : 'Export PDF'}
                            </Button>
                        </div>
                    </div>

                    {/* =====================================================
                        TABLE
                    ===================================================== */}
                    <div className="table-responsive">
                        <Table hover className="align-middle">

                            <thead className="table-light">
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Mahasiswa Bimbingan</th>
                                    <th>Sem/TA</th>
                                    <th>Topik</th>
                                    <th>Catatan Hasil</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                        >
                                            <div
                                                className="spinner-border text-primary spinner-border-sm me-2"
                                                role="status"
                                            ></div>

                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-5 text-muted"
                                        >
                                            <div>
                                                <FiUsers className="fs-1 mb-3 text-secondary opacity-50" />

                                                <p className="mb-0">
                                                    Belum ada catatan perwalian
                                                    dari mahasiswa Anda.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row) => (
                                        <tr key={row.id}>

                                            <td className="fw-semibold">
                                                {row.tanggal}
                                            </td>

                                            <td>
                                                <span className="d-block fw-bold text-primary">
                                                    {row.mahasiswa?.nama}
                                                </span>

                                                <small className="text-muted">
                                                    NIM: {row.mahasiswa?.nim}
                                                </small>
                                            </td>

                                            <td>
                                                {row.semester}
                                                <br />

                                                <small className="text-muted">
                                                    {row.tahun_ajaran}
                                                </small>
                                            </td>

                                            <td>
                                                <Badge
                                                    bg="info"
                                                    className="text-dark bg-opacity-25 border border-info"
                                                >
                                                    {row.topik}
                                                </Badge>
                                            </td>

                                            <td>
                                                <div
                                                    style={{
                                                        maxWidth: '250px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                    title={
                                                        row.isi_perwalian
                                                    }
                                                >
                                                    {row.isi_perwalian}
                                                </div>
                                            </td>

                                            <td>
                                                <Badge bg="success">
                                                    {row.status}
                                                </Badge>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* =====================================================
                        PAGINATION
                    ===================================================== */}
                    {meta && meta.last_page > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">

                            <span className="text-muted small">
                                Menampilkan {meta.from || 0} -{' '}
                                {meta.to || 0} dari {meta.total} data
                            </span>

                            <div className="d-flex gap-2">

                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage(
                                            (prev) => prev - 1
                                        )
                                    }
                                >
                                    Sebelumnya
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    disabled={
                                        currentPage ===
                                        meta.last_page
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (prev) => prev + 1
                                        )
                                    }
                                >
                                    Selanjutnya
                                </Button>

                            </div>
                        </div>
                    )}

                </Card.Body>
            </Card>
        </div>
    );
}