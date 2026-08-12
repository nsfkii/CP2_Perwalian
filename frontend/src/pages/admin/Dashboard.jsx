import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRekapData } from '../../api/rekap';
import { FiUsers, FiUserCheck, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [summary, setSummary] = useState({ total_mahasiswa: 0, total_dosen: 0, total_perwalian: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setIsError(false);
                const res = await getRekapData({});
                // Memastikan membaca dari res.data.summary (karena struktur JSON backend kita dibungkus 'data')
                if (res && res.data && res.data.summary) {
                    setSummary(res.data.summary);
                } else {
                    throw new Error("Struktur data tidak sesuai");
                }
            } catch (error) {
                console.error("Gagal mengambil data summary", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, []);

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold text-dark">Dashboard Admin</h4>
                <p className="text-muted">Selamat datang kembali, {user?.name}.</p>
            </div>

            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : isError ? (
                <div className="alert alert-danger d-flex align-items-center rounded-3 border-0 shadow-sm">
                    <FiAlertCircle className="fs-4 me-3" />
                    <div>
                        <strong>Gagal memuat data ringkasan.</strong>
                        <p className="mb-0 small">Pastikan endpoint /api/rekap/perwalian merespons dengan benar.</p>
                    </div>
                </div>
            ) : (
                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="card-custom p-4 border-start border-primary border-4 h-100">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1 fw-semibold">Total Mahasiswa</p>
                                    <h2 className="fw-bold mb-0 text-dark">{summary.total_mahasiswa}</h2>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                                    <FiUsers className="fs-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-custom p-4 border-start border-success border-4 h-100">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1 fw-semibold">Total Dosen</p>
                                    <h2 className="fw-bold mb-0 text-dark">{summary.total_dosen}</h2>
                                </div>
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                                    <FiUserCheck className="fs-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-custom p-4 border-start border-warning border-4 h-100">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted mb-1 fw-semibold">Total Perwalian</p>
                                    <h2 className="fw-bold mb-0 text-dark">{summary.total_perwalian}</h2>
                                </div>
                                <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                                    <FiFileText className="fs-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {!isLoading && !isError && (
                <div className="row">
                    <div className="col-12">
                        <div className="card-custom p-4 bg-light">
                            <h6 className="fw-bold text-secondary mb-3">Jalan Pintas Administrasi</h6>
                            <div className="d-flex gap-3">
                                <Link to="/admin/mahasiswa" className="btn btn-outline-primary bg-white">Kelola Mahasiswa</Link>
                                <Link to="/admin/dosen" className="btn btn-outline-success bg-white">Kelola Dosen</Link>
                                <Link to="/admin/rekap-perwalian" className="btn btn-outline-warning text-dark bg-white">Lihat Rekap Lengkap</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
