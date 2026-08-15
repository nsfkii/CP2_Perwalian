import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Button,
    Modal,
    Form,
    Table,
    InputGroup,
    FormControl
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiSearch,
    FiUsers
} from 'react-icons/fi';

import {
    getDosenWalis,
    createDosenWali,
    updateDosenWali,
    deleteDosenWali
} from '../../api/dosenWali';

import { getMahasiswas } from '../../api/mahasiswa';
import { getDosens } from '../../api/dosen';

export default function DosenWali() {

    // =========================================================
    // DATA DOSEN WALI
    // =========================================================
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // =========================================================
    // OPTIONS UNTUK FORM ASSIGN BIASA
    // =========================================================
    const [mahasiswaOptions, setMahasiswaOptions] = useState([]);
    const [dosenOptions, setDosenOptions] = useState([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    // =========================================================
    // MODAL ASSIGN BIASA
    // =========================================================
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // =========================================================
    // MODAL PLOT BANYAK
    // =========================================================
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkMahasiswa, setBulkMahasiswa] = useState([]);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState([]);
    const [selectedDosen, setSelectedDosen] = useState('');
    const [isLoadingBulk, setIsLoadingBulk] = useState(false);
    const [isSavingBulk, setIsSavingBulk] = useState(false);

    // =========================================================
    // REACT HOOK FORM
    // =========================================================
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm();

    // =========================================================
    // AMBIL DATA DOSEN WALI
    // =========================================================
    const fetchDosenWalis = useCallback(async () => {
        setLoading(true);

        try {
            const response = await getDosenWalis(currentPage, search);

            setData(response.data || []);
            setMeta(response.meta || {});
        } catch (error) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                'Gagal mengambil data dosen wali.'
            );
        } finally {
            setLoading(false);
        }
    }, [currentPage, search]);

    useEffect(() => {
        fetchDosenWalis();
    }, [fetchDosenWalis]);

    // =========================================================
    // SEARCH
    // =========================================================
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    // =========================================================
    // LOAD OPTION UNTUK ASSIGN BIASA
    // =========================================================
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
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                'Gagal mengambil data mahasiswa dan dosen.'
            );
        } finally {
            setIsLoadingOptions(false);
        }
    };

    // =========================================================
    // BUKA MODAL ASSIGN BIASA
    // =========================================================
    const handleShowAdd = async () => {
        setIsEdit(false);
        setEditId(null);
        reset({
            mahasiswa_id: '',
            dosen_id: ''
        });

        setShowModal(true);
        await loadFormOptions();
    };

    // =========================================================
    // BUKA MODAL EDIT
    // =========================================================
    const handleShowEdit = async (item) => {
        setIsEdit(true);
        setEditId(item.id);

        setShowModal(true);
        await loadFormOptions();

        setValue(
            'mahasiswa_id',
            item.mahasiswa_id || item.mahasiswa?.id || ''
        );

        setValue(
            'dosen_id',
            item.dosen_id || item.dosen?.id || ''
        );
    };

    // =========================================================
    // SUBMIT ASSIGN BIASA
    // =========================================================
    const onSubmit = async (formData) => {
        try {
            if (isEdit) {
                await updateDosenWali(editId, formData);

                toast.success('Data Dosen Wali berhasil diperbarui.');
            } else {
                await createDosenWali(formData);

                toast.success('Dosen Wali berhasil ditetapkan.');
            }

            setShowModal(false);
            reset();

            fetchDosenWalis();
        } catch (error) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                'Gagal menyimpan data Dosen Wali.'
            );
        }
    };

    // =========================================================
    // DELETE
    // =========================================================
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus data?',
            text: 'Penugasan Dosen Wali ini akan dihapus.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await deleteDosenWali(id);

            toast.success('Penugasan Dosen Wali berhasil dihapus.');

            fetchDosenWalis();
        } catch (error) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                'Gagal menghapus data Dosen Wali.'
            );
        }
    };

    // =========================================================
    // BUKA MODAL PLOT BANYAK
    // =========================================================
    const handleShowBulk = async () => {
        setShowBulkModal(true);
        setSelectedMahasiswa([]);
        setSelectedDosen('');

        await loadBulkData();
    };

    // =========================================================
    // LOAD DATA MAHASISWA YANG BELUM PUNYA WALI
    // + DATA DOSEN
    // =========================================================
    const loadBulkData = async () => {
        setIsLoadingBulk(true);

        try {
            const token = localStorage.getItem('token');

            const [mahasiswaResponse, dosenResponse] = await Promise.all([
                fetch(
                    'http://127.0.0.1:8000/api/dosen-wali/mahasiswa-belum-wali',
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }
                ),
                getDosens(1, '')
            ]);

            const mahasiswaResult = await mahasiswaResponse.json();

            if (!mahasiswaResponse.ok) {
                throw new Error(
                    mahasiswaResult.message ||
                    'Gagal mengambil mahasiswa yang belum memiliki wali.'
                );
            }

            setBulkMahasiswa(mahasiswaResult.data || []);
            setDosenOptions(dosenResponse.data || []);

        } catch (error) {
            console.error(error);

            toast.error(
                error?.message ||
                error?.response?.data?.message ||
                'Gagal mengambil data untuk plotting.'
            );
        } finally {
            setIsLoadingBulk(false);
        }
    };

    // =========================================================
    // CHECKBOX MAHASISWA
    // =========================================================
    const handleMahasiswaCheck = (id) => {
        setSelectedMahasiswa((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }

            return [...prev, id];
        });
    };

    // =========================================================
    // PILIH SEMUA MAHASISWA
    // =========================================================
    const handleSelectAll = () => {
        if (selectedMahasiswa.length === bulkMahasiswa.length) {
            setSelectedMahasiswa([]);
        } else {
            setSelectedMahasiswa(
                bulkMahasiswa.map((item) => item.id)
            );
        }
    };

    // =========================================================
    // SIMPAN PLOT BANYAK
    // =========================================================
    const handleSubmitBulk = async () => {

        if (!selectedDosen) {
            toast.warning('Silakan pilih Dosen Wali terlebih dahulu.');
            return;
        }

        if (selectedMahasiswa.length === 0) {
            toast.warning('Silakan pilih minimal satu mahasiswa.');
            return;
        }

        const result = await Swal.fire({
            title: 'Plot mahasiswa?',
            text: `${selectedMahasiswa.length} mahasiswa akan ditetapkan ke Dosen Wali yang dipilih.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, plot sekarang',
            cancelButtonText: 'Batal'
        });

        if (!result.isConfirmed) {
            return;
        }

        setIsSavingBulk(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                'http://127.0.0.1:8000/api/dosen-wali/store-many',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        dosen_id: selectedDosen,
                        mahasiswa_ids: selectedMahasiswa
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Gagal melakukan plotting mahasiswa.'
                );
            }

            toast.success(
                result.message ||
                'Mahasiswa berhasil diplot ke Dosen Wali.'
            );

            setShowBulkModal(false);
            setSelectedMahasiswa([]);
            setSelectedDosen('');

            // Refresh tabel utama
            fetchDosenWalis();

        } catch (error) {
            console.error(error);

            toast.error(
                error?.message ||
                'Gagal melakukan plotting mahasiswa.'
            );
        } finally {
            setIsSavingBulk(false);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================
    return (
        <div>

            {/* =================================================
                HEADER
            ================================================= */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h4 className="fw-bold text-dark mb-1">
                        Dosen Wali
                    </h4>

                    <p className="text-muted mb-0">
                        Kelola penugasan dosen wali mahasiswa.
                    </p>
                </div>

                <div className="d-flex gap-2">

                    {/* BUTTON ASSIGN BIASA */}
                    <Button
                        variant="primary"
                        className="btn-primary-custom d-flex align-items-center"
                        onClick={handleShowAdd}
                    >
                        <FiPlus className="me-2" />
                        Assign Dosen Wali
                    </Button>

                    {/* BUTTON PLOT BANYAK */}
                    <Button
                        variant="success"
                        className="d-flex align-items-center"
                        onClick={handleShowBulk}
                    >
                        <FiUsers className="me-2" />
                        Plot Banyak Mahasiswa
                    </Button>

                </div>
            </div>

            {/* =================================================
                TABLE
            ================================================= */}
            <Card className="card-custom border-0">

                <Card.Body>

                    {/* SEARCH */}
                    <div className="mb-4">
                        <InputGroup style={{ maxWidth: '350px' }}>
                            <InputGroup.Text>
                                <FiSearch />
                            </InputGroup.Text>

                            <FormControl
                                placeholder="Cari mahasiswa atau dosen..."
                                value={search}
                                onChange={handleSearch}
                            />
                        </InputGroup>
                    </div>

                    {/* TABLE */}
                    <div className="table-responsive">

                        <Table
                            hover
                            responsive
                            className="align-middle"
                        >
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Mahasiswa</th>
                                    <th>NIM</th>
                                    <th>Program Studi</th>
                                    <th>Dosen Wali</th>
                                    <th className="text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                        >
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4 text-muted"
                                        >
                                            Tidak ada data Dosen Wali.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item, index) => (
                                        <tr key={item.id}>

                                            <td>
                                                {((currentPage - 1) * 10) +
                                                    index +
                                                    1}
                                            </td>

                                            <td>
                                                {item.mahasiswa?.nama || '-'}
                                            </td>

                                            <td>
                                                {item.mahasiswa?.nim || '-'}
                                            </td>

                                            <td>
                                                {item.mahasiswa?.prodi || '-'}
                                            </td>

                                            <td>
                                                {item.dosen?.nama || '-'}
                                            </td>

                                            <td className="text-center">

                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() =>
                                                        handleShowEdit(item)
                                                    }
                                                >
                                                    <FiEdit2 />
                                                </Button>

                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    <FiTrash2 />
                                                </Button>

                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>
                        </Table>

                    </div>

                    {/* PAGINATION */}
                    {meta?.last_page > 1 && (
                        <div className="d-flex justify-content-center gap-2 mt-4">

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) => prev - 1)
                                }
                            >
                                Sebelumnya
                            </Button>

                            <span className="d-flex align-items-center px-2">
                                Halaman {currentPage} dari {meta.last_page}
                            </span>

                            <Button
                                variant="outline-secondary"
                                size="sm"
                                disabled={
                                    currentPage === meta.last_page
                                }
                                onClick={() =>
                                    setCurrentPage((prev) => prev + 1)
                                }
                            >
                                Berikutnya
                            </Button>

                        </div>
                    )}

                </Card.Body>

            </Card>

            {/* =================================================
                MODAL ASSIGN / EDIT BIASA
            ================================================= */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
            >

                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEdit
                            ? 'Edit Dosen Wali'
                            : 'Assign Dosen Wali'}
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit(onSubmit)}>

                    <Modal.Body>

                        {/* MAHASISWA */}
                        <Form.Group className="mb-3">

                            <Form.Label>
                                Mahasiswa
                            </Form.Label>

                            <Form.Select
                                {...register('mahasiswa_id', {
                                    required: 'Mahasiswa wajib dipilih.'
                                })}
                                disabled={isEdit || isLoadingOptions}
                            >

                                <option value="">
                                    {isLoadingOptions
                                        ? 'Memuat mahasiswa...'
                                        : 'Pilih Mahasiswa'}
                                </option>

                                {mahasiswaOptions.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.nim} - {item.nama}
                                    </option>
                                ))}

                            </Form.Select>

                            {errors.mahasiswa_id && (
                                <small className="text-danger">
                                    {errors.mahasiswa_id.message}
                                </small>
                            )}

                        </Form.Group>

                        {/* DOSEN */}
                        <Form.Group className="mb-3">

                            <Form.Label>
                                Dosen Wali
                            </Form.Label>

                            <Form.Select
                                {...register('dosen_id', {
                                    required: 'Dosen Wali wajib dipilih.'
                                })}
                                disabled={isLoadingOptions}
                            >

                                <option value="">
                                    {isLoadingOptions
                                        ? 'Memuat dosen...'
                                        : 'Pilih Dosen Wali'}
                                </option>

                                {dosenOptions.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.nidn
                                            ? `${item.nidn} - ${item.nama}`
                                            : item.nama}
                                    </option>
                                ))}

                            </Form.Select>

                            {errors.dosen_id && (
                                <small className="text-danger">
                                    {errors.dosen_id.message}
                                </small>
                            )}

                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>

                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                        >
                            Batal
                        </Button>

                        <Button
                            variant="primary"
                            type="submit"
                        >
                            {isEdit
                                ? 'Simpan Perubahan'
                                : 'Assign Dosen Wali'}
                        </Button>

                    </Modal.Footer>

                </Form>

            </Modal>

            {/* =================================================
                MODAL PLOT BANYAK MAHASISWA
            ================================================= */}
            <Modal
                show={showBulkModal}
                onHide={() => setShowBulkModal(false)}
                size="lg"
                centered
            >

                <Modal.Header closeButton>

                    <Modal.Title>
                        <FiUsers className="me-2" />
                        Plot Banyak Mahasiswa
                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    {/* DOSEN WALI */}
                    <Form.Group className="mb-4">

                        <Form.Label className="fw-semibold">
                            Pilih Dosen Wali
                        </Form.Label>

                        <Form.Select
                            value={selectedDosen}
                            onChange={(e) =>
                                setSelectedDosen(e.target.value)
                            }
                        >

                            <option value="">
                                Pilih Dosen Wali
                            </option>

                            {dosenOptions.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.nidn
                                        ? `${item.nidn} - ${item.nama}`
                                        : item.nama}
                                </option>
                            ))}

                        </Form.Select>

                    </Form.Group>

                    {/* MAHASISWA */}
                    <div className="d-flex justify-content-between align-items-center mb-2">

                        <div>
                            <h6 className="fw-bold mb-1">
                                Pilih Mahasiswa
                            </h6>

                            <small className="text-muted">
                                Hanya mahasiswa yang belum memiliki Dosen Wali.
                            </small>
                        </div>

                        {bulkMahasiswa.length > 0 && (
                            <Form.Check
                                type="checkbox"
                                label="Pilih Semua"
                                checked={
                                    selectedMahasiswa.length ===
                                        bulkMahasiswa.length &&
                                    bulkMahasiswa.length > 0
                                }
                                onChange={handleSelectAll}
                            />
                        )}

                    </div>

                    {/* LIST MAHASISWA */}
                    {isLoadingBulk ? (

                        <div className="text-center py-4">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <p className="text-muted mt-2 mb-0">
                                Memuat mahasiswa...
                            </p>
                        </div>

                    ) : bulkMahasiswa.length === 0 ? (

                        <div className="alert alert-success text-center">
                            Semua mahasiswa sudah memiliki Dosen Wali.
                        </div>

                    ) : (

                        <div
                            className="border rounded"
                            style={{
                                maxHeight: '350px',
                                overflowY: 'auto'
                            }}
                        >

                            <Table
                                hover
                                className="mb-0 align-middle"
                            >

                                <thead className="table-light">

                                    <tr>
                                        <th
                                            style={{
                                                width: '50px'
                                            }}
                                        >
                                            #
                                        </th>

                                        <th>NIM</th>
                                        <th>Nama</th>
                                        <th>Program Studi</th>
                                        <th>Angkatan</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {bulkMahasiswa.map((item) => (

                                        <tr key={item.id}>

                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedMahasiswa.includes(
                                                        item.id
                                                    )}
                                                    onChange={() =>
                                                        handleMahasiswaCheck(
                                                            item.id
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td>
                                                {item.nim || '-'}
                                            </td>

                                            <td>
                                                {item.nama || '-'}
                                            </td>

                                            <td>
                                                {item.prodi || '-'}
                                            </td>

                                            <td>
                                                {item.angkatan || '-'}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </Table>

                        </div>

                    )}

                    {/* JUMLAH TERPILIH */}
                    {bulkMahasiswa.length > 0 && (
                        <div className="mt-3">

                            <span className="badge bg-primary">
                                {selectedMahasiswa.length} mahasiswa dipilih
                            </span>

                        </div>
                    )}

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() => setShowBulkModal(false)}
                        disabled={isSavingBulk}
                    >
                        Batal
                    </Button>

                    <Button
                        variant="success"
                        onClick={handleSubmitBulk}
                        disabled={
                            isSavingBulk ||
                            selectedMahasiswa.length === 0 ||
                            !selectedDosen
                        }
                    >

                        {isSavingBulk ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <FiUsers className="me-2" />
                                Plot {selectedMahasiswa.length} Mahasiswa
                            </>
                        )}

                    </Button>

                </Modal.Footer>

            </Modal>

        </div>
    );
}