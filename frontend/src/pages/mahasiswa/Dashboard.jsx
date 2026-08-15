import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function MahasiswaDashboard() {
    const { user } = useAuth();

    const [mahasiswa, setMahasiswa] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfil = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch('http://127.0.0.1:8000/api/mahasiswa/profil', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Gagal mengambil data profil');
                }

                setMahasiswa(result.data);
            } catch (error) {
                console.error('Gagal mengambil profil mahasiswa:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfil();
    }, []);

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold text-dark">Dashboard Mahasiswa</h4>
                <p className="text-muted">
                    Selamat datang di Sistem Pencatatan Perwalian STMIK Bandung.
                </p>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card-custom p-4 mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3">
                                <FiBookOpen className="fs-4" />
                            </div>

                            <div>
                                <h5 className="fw-bold mb-1">
                                    Informasi Akademik
                                </h5>
                                <p className="text-muted mb-0 small">
                                    Pastikan Anda mencatat hasil perwalian setelah sesi konsultasi selesai.
                                </p>
                            </div>
                        </div>

                        <hr className="text-muted opacity-25" />

                        <div className="row mt-3">

                            {/* Nama */}
                            <div className="col-sm-4 mb-3">
                                <small className="text-muted d-block">
                                    Nama Lengkap
                                </small>

                                <span className="fw-semibold text-dark">
                                    {mahasiswa?.nama || user?.name}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="col-sm-4 mb-3">
                                <small className="text-muted d-block">
                                    Email Institusi
                                </small>

                                <span className="fw-semibold text-dark">
                                    {mahasiswa?.email || user?.email}
                                </span>
                            </div>

                            {/* Dosen Wali */}
                            <div className="col-sm-4 mb-3">
                                <small className="text-muted d-block">
                                    Dosen Wali
                                </small>

                                <span className="fw-semibold text-dark">
                                    {loading
                                        ? 'Memuat data...'
                                        : mahasiswa?.dosen_wali?.nama
                                            ? mahasiswa.dosen_wali.nama
                                            : 'Belum memiliki dosen wali'
                                    }
                                </span>
                            </div>

                        </div>

                        <div className="mt-2">
                            <Link
                                to="/mahasiswa/perwalian"
                                className="btn btn-primary-custom text-white"
                            >
                                Mulai Catat Perwalian
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}