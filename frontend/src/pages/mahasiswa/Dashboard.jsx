import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function MahasiswaDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold text-dark">Dashboard Mahasiswa</h4>
                <p className="text-muted">Selamat datang di Sistem Pencatatan Perwalian STMIK Bandung.</p>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card-custom p-4 mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3">
                                <FiBookOpen className="fs-4" />
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Informasi Akademik</h5>
                                <p className="text-muted mb-0 small">Pastikan Anda mencatat hasil perwalian setelah sesi konsultasi selesai.</p>
                            </div>
                        </div>
                        <hr className="text-muted opacity-25" />
                        <div className="row mt-3">
                            <div className="col-sm-4 mb-3">
                                <small className="text-muted d-block">Nama Lengkap</small>
                                <span className="fw-semibold text-dark">{user?.name}</span>
                            </div>
                            <div className="col-sm-4 mb-3">
                                <small className="text-muted d-block">Email Institusi</small>
                                <span className="fw-semibold text-dark">{user?.email}</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <Link to="/mahasiswa/perwalian" className="btn btn-primary-custom text-white">
                                Mulai Catat Perwalian
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
