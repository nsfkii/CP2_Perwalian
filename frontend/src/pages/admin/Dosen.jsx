import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal, Form, Table, InputGroup, FormControl } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import { getDosens, createDosen, updateDosen, deleteDosen } from '../../api/dosen';

export default function Dosen() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

  const fetchDosens = useCallback(async (page, searchQuery) => {
    setLoading(true);
    try {
      const res = await getDosens(page, searchQuery);
      setData(res.data);
      setMeta(res.meta);
    } catch (error) {
      toast.error('Gagal mengambil data dosen');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDosens(currentPage, search);
  }, [currentPage, search, fetchDosens]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDosens(1, search);
  };

  const handleShowAdd = () => {
    reset();
    setIsEdit(false);
    setEditId(null);
    setShowModal(true);
  };

  const handleShowEdit = (dosen) => {
    setIsEdit(true);
    setEditId(dosen.id);
    setValue('nidn', dosen.nidn);
    setValue('nama', dosen.nama);
    setValue('email', dosen.email_profil || '');
    setValue('no_hp', dosen.no_hp || '');
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        const res = await updateDosen(editId, formData);
        toast.success(res.message);
      } else {
        const res = await createDosen(formData);
        toast.success(res.message);
      }
      setShowModal(false);
      fetchDosens(currentPage, search);
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
          const res = await deleteDosen(id);
          toast.success(res.message);
          fetchDosens(currentPage, search);
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
          <h4 className="fw-bold text-dark mb-0">Data Dosen</h4>
          <p className="text-muted small mb-0">Kelola master data dosen STMIK Bandung</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/dosen/import" className="btn btn-outline-primary d-flex align-items-center bg-white">
            <FiUpload className="me-2" /> Import Excel
          </Link>
          <Button variant="primary" className="btn-primary-custom d-flex align-items-center" onClick={handleShowAdd}>
            <FiPlus className="me-2" /> Tambah Dosen
          </Button>
        </div>
      </div>

      <Card className="card-custom border-0 shadow-sm">
        <Card.Body>
          <form onSubmit={handleSearch} className="mb-4 col-md-4">
            <InputGroup>
              <FormControl
                placeholder="Cari NIDN atau Nama..."
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
                  <th>NIDN</th>
                  <th>Nama Lengkap</th>
                  <th>Email Kontak</th>
                  <th>No. HP</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
                      Memuat data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">Tidak ada data dosen ditemukan.</td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id}>
                      <td className="fw-semibold">{row.nidn}</td>
                      <td>{row.nama}</td>
                      <td>{row.email_profil || '-'}</td>
                      <td>{row.no_hp || '-'}</td>
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
            <Modal.Title className="fs-5 fw-bold">{isEdit ? 'Edit Dosen' : 'Tambah Dosen'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>NIDN</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Masukkan NIDN"
                isInvalid={!!errors.nidn}
                {...register('nidn', { 
                  required: 'NIDN wajib diisi',
                  pattern: { value: /^[0-9]+$/, message: 'NIDN harus berupa angka' }
                })} 
              />
              <Form.Control.Feedback type="invalid">{errors.nidn?.message}</Form.Control.Feedback>
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
              <Form.Label>Email Kontak (Opsional)</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Email pribadi dosen"
                isInvalid={!!errors.email}
                {...register('email')} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nomor HP (Opsional)</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Contoh: 08123456789"
                isInvalid={!!errors.no_hp}
                {...register('no_hp')} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowModal(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button variant="primary" className="btn-primary-custom" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
