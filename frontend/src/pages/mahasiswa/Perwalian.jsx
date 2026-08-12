import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal, Form, Table, InputGroup, FormControl, Badge } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.min.css';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch, FiFileText, FiCalendar } from 'react-icons/fi';
import { getPerwalians, createPerwalian } from '../../api/perwalian';

export default function MahasiswaPerwalian() {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm();

    const fetchPerwalians = useCallback(async (page, searchQuery) => {
        setLoading(true);
        try {
            const res = await getPerwalians(page, searchQuery);
            setData(res.data);
            setMeta(res.meta);
        } catch (error) {
            toast.error('Gagal mengambil histori perwalian');
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

    const handleShowAdd = () => {
        reset();
        setShowModal(true);
    };

    const onSubmit = async (formData) => {
        try {
            if (formData.tanggal) {
                formData.tanggal = format(formData.tanggal, 'yyyy-MM-dd');
            }

            const res = await createPerwalian(formData);
            toast.success(res.message);
            setShowModal(false);
            fetchPerwalians(1, search);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const topikOptions = [
        'Pengambilan KRS',
        'Evaluasi Akademik',
        'Konsultasi Nilai',
        'Magang',
        'Skripsi',
        'Organisasi',
        'Beasiswa',
        'Permasalahan Akademik',
        'Lainnya',
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-0">Histori Perwalian</h4>
                    <p className="text-muted small mb-0">Catat dan pantau rekam jejak konsultasi akademik Anda</p>
                </div>
                <Button variant="primary" className="btn-primary-custom d-flex align-items-center" onClick={handleShowAdd}>
                    <FiPlus className="me-2" /> Buat Catatan Baru
                </Button>
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
                                    <th>Semester / TA</th>
                                    <th>Dosen Wali</th>
                                    <th>Topik</th>
                                    <th>Catatan</th>
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
                                                <FiFileText className="fs-1 mb-3 text-secondary opacity-50" />
                                                <p className="mb-0">Belum ada histori perwalian.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row) => (
                                        <tr key={row.id}>
                                            <td className="fw-semibold">{row.tanggal}</td>
                                            <td>
                                                <div>{row.semester}</div>
                                                <small className="text-muted">{row.tahun_ajaran}</small>
                                            </td>
                                            <td>{row.dosen?.nama || 'Belum di-assign'}</td>
                                            <td><Badge bg="info" className="text-dark bg-opacity-25 border border-info">{row.topik}</Badge></td>
                                            <td>
                                                <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.isi_perwalian}>
                                                    {row.isi_perwalian}
                                                </div>
                                            </td>
                                            <td><Badge bg="success">{row.status}</Badge></td>
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
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    disabled={currentPage === meta.last_page}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Selanjutnya
                                </Button>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg" centered>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="fs-5 fw-bold">Catat Hasil Perwalian</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="alert alert-info border-0 bg-primary bg-opacity-10 text-primary mb-4">
                            <strong>Informasi:</strong> Form ini otomatis diteruskan kepada Dosen Wali Anda. Pastikan data yang dimasukkan akurat karena tidak dapat diubah setelah disimpan.
                        </div>

                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Semester</Form.Label>
                                <Form.Select isInvalid={!!errors.semester} {...register('semester', { required: 'Semester wajib dipilih' })}>
                                    <option value="">-- Pilih Semester --</option>
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.semester?.message}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Tahun Ajaran</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Contoh: 2025/2026"
                                    isInvalid={!!errors.tahun_ajaran}
                                    {...register('tahun_ajaran', { required: 'Tahun ajaran wajib diisi' })}
                                />
                                <Form.Control.Feedback type="invalid">{errors.tahun_ajaran?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Tanggal Konsultasi</Form.Label>
                                <div className="position-relative">
                                    <Controller
                                        control={control}
                                        name="tanggal"
                                        rules={{ required: 'Tanggal wajib diisi' }}
                                        render={({ field }) => (
                                            <DatePicker
                                                className={`form-control ${errors.tanggal ? 'is-invalid' : ''}`}
                                                placeholderText="Pilih tanggal"
                                                selected={field.value}
                                                onChange={(date) => field.onChange(date)}
                                                dateFormat="dd MMMM yyyy"
                                                isClearable
                                                showPopperArrow={false}
                                            />
                                        )}
                                    />
                                    <FiCalendar className="position-absolute text-muted" style={{ right: '12px', top: '12px', pointerEvents: 'none' }} />
                                </div>
                                {errors.tanggal && <div className="text-danger small mt-1">{errors.tanggal.message}</div>}
                            </Form.Group>

                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Topik Perwalian</Form.Label>
                                <Form.Select isInvalid={!!errors.topik} {...register('topik', { required: 'Topik wajib dipilih' })}>
                                    <option value="">-- Pilih Topik --</option>
                                    {topikOptions.map((topik, idx) => (
                                        <option key={idx} value={topik}>{topik}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.topik?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Isi Catatan / Hasil Konsultasi</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Jelaskan secara singkat hasil diskusi dengan dosen wali Anda..."
                                isInvalid={!!errors.isi_perwalian}
                                {...register('isi_perwalian', { required: 'Isi catatan wajib diisi' })}
                            />
                            <Form.Control.Feedback type="invalid">{errors.isi_perwalian?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button variant="primary" className="btn-primary-custom" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
