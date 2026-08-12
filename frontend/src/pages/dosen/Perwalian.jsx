import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, InputGroup, FormControl, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FiSearch, FiUsers } from 'react-icons/fi';
import { getPerwalians } from '../../api/perwalian';

export default function DosenPerwalian() {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPerwalians = useCallback(async (page, searchQuery) => {
        setLoading(true);
        try {
            const res = await getPerwalians(page, searchQuery);
            setData(res.data);
            setMeta(res.meta);
        } catch (error) {
            toast.error('Gagal mengambil histori perwalian mahasiswa bimbingan');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPerwalians(currentPage, search);
    }, [currentPage, search, fetchPerwalians]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchPerwalians(1, search);
    };

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold text-dark mb-0">Histori Perwalian Mahasiswa</h4>
                <p className="text-muted small mb-0">Pantau catatan konsultasi dari mahasiswa bimbingan Anda</p>
            </div>

            <Card className="card-custom border-0 shadow-sm">
                <Card.Body>
                    <form onSubmit={handleSearch} className="mb-4 col-md-4">
                        <InputGroup>
                            <FormControl
                                placeholder="Cari berdasarkan topik..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button variant="outline-secondary" type="submit">
                                <FiSearch />
                            </Button>
                        </InputGroup>
                    </form>

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
                                        <td colSpan="6" className="text-center py-4">
                                            <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            <div>
                                                <FiUsers className="fs-1 mb-3 text-secondary opacity-50" />
                                                <p className="mb-0">Belum ada catatan perwalian dari mahasiswa Anda.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row) => (
                                        <tr key={row.id}>
                                            <td className="fw-semibold">{row.tanggal}</td>
                                            <td>
                                                <span className="d-block fw-bold text-primary">{row.mahasiswa?.nama}</span>
                                                <small className="text-muted">NIM: {row.mahasiswa?.nim}</small>
                                            </td>
                                            <td>
                                                {row.semester}
                                                <br />
                                                <small className="text-muted">{row.tahun_ajaran}</small>
                                            </td>
                                            <td>
                                                <Badge bg="info" className="text-dark bg-opacity-25 border border-info">
                                                    {row.topik}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.isi_perwalian}>
                                                    {row.isi_perwalian}
                                                </div>
                                            </td>
                                            <td>
                                                <Badge bg="success">{row.status}</Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {meta && meta.last_page > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <span className="text-muted small">
                                Menampilkan {meta.from || 0} - {meta.to || 0} dari {meta.total} data
                            </span>
                            <div className="d-flex gap-2">
                                <Button variant="outline-secondary" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                                    Sebelumnya
                                </Button>
                                <Button variant="outline-secondary" size="sm" disabled={currentPage === meta.last_page} onClick={() => setCurrentPage(prev => prev + 1)}>
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
