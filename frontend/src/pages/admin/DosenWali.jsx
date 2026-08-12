import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { getDosenWalis, createDosenWali, updateDosenWali, deleteDosenWali } from '../../api/dosenWali';
import { getMahasiswas } from '../../api/mahasiswa';
import { getDosens } from '../../api/dosen';

export default function DosenWali() {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [mahasiswaOptions, setMahasiswaOptions] = useState([]);
    const [dosenOptions, setDosenOptions] = useState([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

    const fetchDosenWalis = useCallback(async (page, searchQuery) => {
        setLoading(true);
        try {
            const res = await getDosenWalis(page, searchQuery);
            setData(res.data);
            setMeta(res.meta);
        } catch (error) {
            toast.error('Gagal mengambil data plotting dosen wali');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDosenWalis(currentPage, search);
    }, [currentPage, search, fetchDosenWalis]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchDosenWalis(1, search);
    };

    const loadFormOptions = async () => {
        setIsLoadingOptions(true);
        try {
            const [resMhs, resDosen] = await Promise.all([
                getMahasiswas(1, ''),
                getDosens(1, '')
            ]);
            setMahasiswaOptions(resMhs.data || []);
            setDosenOptions(resDosen.data || []);
        } catch (error) {
            toast.error('Gagal memuat opsi form');
        } finally {
            setIsLoadingOptions(false);
        }
    };

    const handleShowAdd = () => {
        reset();
        setIsEdit(false);
        setEditId(null);
        loadFormOptions();
        setShowModal(true);
    };

    const handleShowEdit = (dosenWali) => {
        setIsEdit(true);
        setEditId(dosenWali.id);
        loadFormOptions();
        setValue('mahasiswa_id', dosenWali.mahasiswa_id);
        setValue('dosen_id', dosenWali.dosen_id);
        setShowModal(true);
    };

    const onSubmit = async (formData) => {
        try {
            if (isEdit) {
                const res = await updateDosenWali(editId, formData);
                toast.success(res.message);
            } else {
                const res = await createDosenWali(formData);
                toast.success(res.message);
            }
            setShowModal(false);
            fetchDosenWalis(currentPage, search);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Plotting?',
            text: 'Mahasiswa ini tidak akan memiliki dosen wali setelahnya.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--danger-color)',
            cancelButtonColor: 'var(--secondary-color)',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await deleteDosenWali(id);
                    toast.success(res.message);
                    fetchDosenWalis(currentPage, search);
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Gagal menghapus data');
                }
            }
        });
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-0">Plotting Dosen Wali</h4>
                    <p className="text-muted small mb-0">Atur relasi bimbingan mahasiswa dan dosen</p>
                </div>
                <Button variant="primary" className="btn-primary-custom d-flex align-items-center" onClick={handleShowAdd}>
                    <FiPlus className="me-2" /> Assign Dosen Wali
                </Button>
            </div>

            <Card className="card-custom border-0 shadow-sm">
                <Card.Body>
                    <form onSubmit={handleSearch} className="mb-4 col-md-4">
                        <InputGroup>
                            <FormControl
                                placeholder="Cari Mahasiswa atau Dosen..."
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
                                    <th>NIM</th>
                                    <th>Nama Mahasiswa</th>
                                    <th>Program Studi</th>
                                    <th>NIDN</th>
                                    <th>Nama Dosen Wali</th>
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
                                        <td colSpan="6" className="text-center py-4 text-muted">Belum ada data plotting dosen wali.</td>
                                    </tr>
                                ) : (
                                    data.map((row) => (
                                        <tr key={row.id}>
                                            <td className="fw-semibold">{row.mahasiswa?.nim || '-'}</td>
                                            <td>{row.mahasiswa?.nama || '-'}</td>
                                            <td>{row.mahasiswa?.prodi || '-'}</td>
                                            <td className="fw-semibold">{row.dosen?.nidn || '-'}</td>
                                            <td>{row.dosen?.nama || '-'}</td>
                                            <td className="text-center">
                                                <Button variant="light" size="sm" className="text-primary me-2 shadow-sm" onClick={() => handleShowEdit(row)}>
                                                    <FiEdit2 />
                                                </Button>
                                                <Button variant="light" size="sm" className="text-danger shadow-sm" onClick={() => handleDelete(row.id)}>
                                                    <FiTrash2 />
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

            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" centered>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="fs-5 fw-bold">{isEdit ? 'Ubah Dosen Wali' : 'Tetapkan Dosen Wali'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {isLoadingOptions ? (
                            <div className="text-center py-3">
                                <span className="spinner-border text-primary spinner-border-sm me-2" role="status"></span>
                                Memuat daftar...
                            </div>
                        ) : (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pilih Mahasiswa</Form.Label>
                                    <Form.Select
                                        isInvalid={!!errors.mahasiswa_id}
                                        {...register('mahasiswa_id', { required: 'Mahasiswa wajib dipilih' })}
                                    >
                                        <option value="">-- Silakan Pilih Mahasiswa --</option>
                                        {mahasiswaOptions.map(mhs => (
                                            <option key={mhs.id} value={mhs.id}>{mhs.nim} - {mhs.nama}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.mahasiswa_id?.message}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Pilih Dosen Wali</Form.Label>
                                    <Form.Select
                                        isInvalid={!!errors.dosen_id}
                                        {...register('dosen_id', { required: 'Dosen Wali wajib dipilih' })}
                                    >
                                        <option value="">-- Silakan Pilih Dosen --</option>
                                        {dosenOptions.map(dsn => (
                                            <option key={dsn.id} value={dsn.id}>{dsn.nidn} - {dsn.nama}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.dosen_id?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                            Batal
                        </Button>
                        <Button variant="primary" className="btn-primary-custom" type="submit" disabled={isSubmitting || isLoadingOptions}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
