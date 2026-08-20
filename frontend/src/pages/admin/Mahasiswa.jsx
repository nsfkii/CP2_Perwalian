import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import { getMahasiswas, createMahasiswa, updateMahasiswa, deleteMahasiswa } from '../../api/mahasiswa';

export default function Mahasiswa() {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

    const fetchMahasiswas = useCallback(async (page, searchQuery) => {
        setLoading(true);
        try {
            const res = await getMahasiswas(page, searchQuery);
            setData(res.data || []);
            setMeta(res.meta || null);
        } catch (error) {
            console.error('Gagal mengambil data mahasiswa', error);
            toast.error('Gagal mengambil data mahasiswa');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Data table memang perlu disinkronkan setiap page/search berubah.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMahasiswas(currentPage, search);
    }, [currentPage, search, fetchMahasiswas]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchMahasiswas(1, search);
    };

    const handleShowAdd = () => {
        reset();
        setIsEdit(false);
        setEditId(null);
        setShowModal(true);
    };

    const handleShowEdit = (mahasiswa) => {
        setIsEdit(true);
        setEditId(mahasiswa.id);
        setValue('nim', mahasiswa.nim);
        setValue('nama', mahasiswa.nama);
        setValue('prodi', mahasiswa.prodi);
        setValue('angkatan', mahasiswa.angkatan);
        setValue('kelas', mahasiswa.kelas);
        setShowModal(true);
    };

    const onSubmit = async (formData) => {
        try {
            if (isEdit) {
                const res = await updateMahasiswa(editId, formData);
                toast.success(res.message || 'Data berhasil diperbarui');
            } else {
                const res = await createMahasiswa(formData);
                toast.success(res.message || 'Data berhasil ditambahkan');
            }
            setShowModal(false);
            fetchMahasiswas(currentPage, search);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Data?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--danger-color)',
            cancelButtonColor: 'var(--secondary-color)',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setDeletingId(id);
                    const res = await deleteMahasiswa(id);
                    toast.success(res.message || 'Data berhasil dihapus');
                    fetchMahasiswas(currentPage, search);
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Gagal menghapus data');
                } finally {
                    setDeletingId(null);
                }
            }
        });
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-0">Data Mahasiswa</h4>
                    <p className="text-muted small mb-0">Kelola master data mahasiswa STMIK Bandung</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/admin/mahasiswa/import" className="btn btn-outline-primary d-flex align-items-center bg-white">
                        <FiUpload className="me-2" /> Import Excel
                    </Link>
                    <Button variant="primary" className="btn-primary-custom d-flex align-items-center" onClick={handleShowAdd}>
                        <FiPlus className="me-2" /> Tambah Mahasiswa
                    </Button>
                </div>
            </div>

            <Card className="card-custom border-0 shadow-sm">
                <Card.Body>
                    <form onSubmit={handleSearch} className="mb-4 col-md-4">
                        <InputGroup>
                            <FormControl
                                placeholder="Cari NIM atau Nama..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button variant="outline-secondary" type="submit" disabled={loading}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                ) : (
                                    <FiSearch />
                                )}
                            </Button>
                        </InputGroup>
                    </form>

                    <div className="table-responsive">
                        <Table hover className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>NIM</th>
                                    <th>Nama Lengkap</th>
                                    <th>Program Studi</th>
                                    <th>Angkatan</th>
                                    <th>Kelas</th>
                                    <th className="text-center">Aksi</th>
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
                                        <td colSpan="6" className="text-center py-4 text-muted">Tidak ada data mahasiswa ditemukan.</td>
                                    </tr>
                                ) : (
                                    data.map((row) => (
                                        <tr key={row.id}>
                                            <td className="fw-semibold">{row.nim}</td>
                                            <td>{row.nama}</td>
                                            <td>{row.prodi}</td>
                                            <td>{row.angkatan}</td>
                                            <td>{row.kelas}</td>
                                            <td className="text-center">
                                                <Button variant="light" size="sm" className="text-primary me-2 shadow-sm" onClick={() => handleShowEdit(row)}>
                                                    <FiEdit2 />
                                                </Button>
                                                <Button variant="light" size="sm" className="text-danger shadow-sm" onClick={() => handleDelete(row.id)} disabled={deletingId === row.id}>
                                                    {deletingId === row.id ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                    ) : (
                                                        <FiTrash2 />
                                                    )}
                                                </Button>
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
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm" 
                                    disabled={currentPage === 1 || loading}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Sebelumnya
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm" 
                                    disabled={currentPage === meta.last_page || loading}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Selanjutnya
                                </Button>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" centered>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="fs-5 fw-bold">{isEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>NIM</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Masukkan NIM"
                                isInvalid={!!errors.nim}
                                {...register('nim', { required: 'NIM wajib diisi' })} 
                            />
                            <Form.Control.Feedback type="invalid">{errors.nim?.message}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nama Lengkap</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Masukkan Nama Lengkap"
                                isInvalid={!!errors.nama}
                                {...register('nama', { required: 'Nama wajib diisi' })} 
                            />
                            <Form.Control.Feedback type="invalid">{errors.nama?.message}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Program Studi</Form.Label>
                            <Form.Select isInvalid={!!errors.prodi} {...register('prodi', { required: 'Prodi wajib dipilih' })}>
                                <option value="">-- Pilih Prodi --</option>
                                <option value="Teknik Informatika">Teknik Informatika</option>
                                <option value="Sistem Informasi">Sistem Informasi</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.prodi?.message}</Form.Control.Feedback>
                        </Form.Group>

                        <div className="row">
                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Angkatan</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Contoh: 2024"
                                    isInvalid={!!errors.angkatan}
                                    {...register('angkatan', { required: 'Angkatan wajib diisi', maxLength: 4 })} 
                                />
                                <Form.Control.Feedback type="invalid">{errors.angkatan?.message}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="col-md-6 mb-3">
                                <Form.Label>Kelas</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Contoh: Reguler Pagi"
                                    isInvalid={!!errors.kelas}
                                    {...register('kelas', { required: 'Kelas wajib diisi' })} 
                                />
                                <Form.Control.Feedback type="invalid">{errors.kelas?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button variant="primary" className="btn-primary-custom" type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            )}
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
