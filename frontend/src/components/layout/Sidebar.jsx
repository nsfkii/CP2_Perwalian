import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUsers, FiUserCheck, FiBookOpen, FiFileText } from 'react-icons/fi';

export default function Sidebar() {
    const { user } = useAuth();

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end vh-100 position-fixed" style={{ width: '260px', zIndex: 1000 }}>
            <div className="d-flex align-items-center mb-4 px-2 mt-2">
                <span className="fs-5 fw-bold" style={{ color: 'var(--primary-color)' }}>STMIK Bandung</span>
            </div>
            
            <ul className="nav nav-pills flex-column mb-auto">
                {/* MENU ADMIN */}
                {user?.role === 'admin' && (
                    <>
                        <li className="nav-item">
                            <NavLink to="/admin/dashboard" className="nav-link sidebar-link d-flex align-items-center" end>
                                <FiHome className="me-3 fs-5" /> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/mahasiswa" className="nav-link sidebar-link d-flex align-items-center">
                                <FiUsers className="me-3 fs-5" /> Data Mahasiswa
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/dosen" className="nav-link sidebar-link d-flex align-items-center">
                                <FiUserCheck className="me-3 fs-5" /> Data Dosen
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/dosen-wali" className="nav-link sidebar-link d-flex align-items-center">
                                <FiBookOpen className="me-3 fs-5" /> Plotting Dosen Wali
                            </NavLink>
                        </li>
                        <li className="nav-item mt-3 mb-2 px-3 text-muted small fw-bold text-uppercase">Laporan</li>
                        <li className="nav-item">
                            <NavLink to="/admin/rekap-perwalian" className="nav-link sidebar-link d-flex align-items-center">
                                <FiFileText className="me-3 fs-5" /> Rekap Perwalian
                            </NavLink>
                        </li>
                    </>
                )}

                {/* MENU MAHASISWA */}
                {user?.role === 'mahasiswa' && (
                    <>
                        <li className="nav-item">
                            <NavLink to="/mahasiswa/dashboard" className="nav-link sidebar-link d-flex align-items-center" end>
                                <FiHome className="me-3 fs-5" /> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/mahasiswa/perwalian" className="nav-link sidebar-link d-flex align-items-center">
                                <FiFileText className="me-3 fs-5" /> Histori Perwalian
                            </NavLink>
                        </li>
                    </>
                )}

                {/* MENU DOSEN */}
                {user?.role === 'dosen' && (
                    <>
                        <li className="nav-item">
                            <NavLink to="/dosen/dashboard" className="nav-link sidebar-link d-flex align-items-center" end>
                                <FiHome className="me-3 fs-5" /> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/dosen/mahasiswa-wali" className="nav-link sidebar-link d-flex align-items-center">
                                <FiUsers className="me-3 fs-5" /> Mahasiswa Wali
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/dosen/perwalian" className="nav-link sidebar-link d-flex align-items-center">
                                <FiFileText className="me-3 fs-5" /> Histori Perwalian
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}
