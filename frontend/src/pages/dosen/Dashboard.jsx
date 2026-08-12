import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function DosenDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold text-dark">Dashboard Dosen</h4>
                <p className="text-muted">Selamat datang kembali, {user?.name}.</p>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card-custom p-4 mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3">
                                <FiUsers className="fs-4" />
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Mahasiswa Bimbingan</h5>
                                <p className="text-muted mb-0 small">Pantau histori perwalian mahasiswa wali Anda.</p>
                            </div>
                        </div>
                        <hr className="text-muted opacity-25" />
                        
                        <div className="row mt-3 mb-4">
                            <div className="col-sm-6 mb-3">
                                <small className="text-muted d-block">Nama Dosen</small>
                                <span className="fw-semibold text-dark">{user?.name}</span>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <small className="text-muted d-block">Email Kontak</small>
                                <span className="fw-semibold text-dark">{user?.email}</span>
                            </div>
                        </div>

                        <div className="mt-2 bg-light p-3 rounded-3 border">
                            <p className="text-muted small mb-3">
                                Seluruh catatan konsultasi akademik dari mahasiswa yang berada di bawah bimbingan Anda akan terekam secara otomatis di dalam sistem.
                            </p>
                            <Link to="/dosen/perwalian" className="btn btn-primary-custom text-white d-inline-flex align-items-center">
                                Lihat Histori Mahasiswa <FiArrowRight className="ms-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
