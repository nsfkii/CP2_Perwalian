import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

import {
    FiHome,
    FiUsers,
    FiUserCheck,
    FiBookOpen,
    FiFileText,
    FiX,
    FiLogOut,
    FiUser
} from 'react-icons/fi';

export default function Sidebar({ isMobileOpen, toggleMobileSidebar, closeMobileSidebar, isCollapsed }) {

    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleNavClick = () => {
        if (window.innerWidth <= 768) {
            closeMobileSidebar();
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Konfirmasi Logout',
            text: "Apakah Anda yakin ingin keluar dari sistem?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary-color)',
            cancelButtonColor: 'var(--danger-color)',
            confirmButtonText: 'Ya, Keluar!',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'card-custom'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoggingOut(true);
                await logout();
            }
        });
    };

    return (

        <aside
            className={`d-flex flex-column bg-white border-end vh-100 position-fixed sidebar-transition sidebar-mobile ${isMobileOpen ? 'show' : ''} ${isCollapsed ? 'sidebar-collapsed' : ''}`}
            style={{
                width: '260px',
                zIndex: 1000
            }}
        >
            {isLoggingOut && (
                <div className="app-loading-overlay">
                    <div className="app-loading-box">
                        <div className="spinner-border text-primary" role="status" />
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ height: '70px' }}>

                <div className="d-flex align-items-center gap-2 overflow-hidden">
                    <img
                        src="/logo.png"
                        alt="Logo STMIK Bandung"
                        className="sidebar-brand-logo"
                    />

                    <span className="fs-6 fw-bold text-dark sidebar-header-text text-nowrap">
                        STMIK Bandung
                    </span>
                </div>

                <button className="btn btn-link text-dark d-md-none p-0" onClick={toggleMobileSidebar} aria-label="Tutup menu">
                    <FiX className="fs-4" />
                </button>

            </div>

            <div className="flex-grow-1 overflow-auto p-3">
            <ul className="nav nav-pills flex-column gap-1">

                {/* MENU ADMIN */}
                {user?.role === 'admin' && (
                    <>

                        <li className="nav-item">
                            <NavLink
                                to="/admin/dashboard"
                                className="nav-link sidebar-link d-flex align-items-center py-2"
                                onClick={handleNavClick}
                                title="Dashboard"
                                end
                            >
                                <FiHome className="me-3 fs-5" />
                                <span className="sidebar-text">Dashboard</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/admin/mahasiswa"
                                className="nav-link sidebar-link d-flex align-items-center py-2"
                                onClick={handleNavClick}
                                title="Data Mahasiswa"
                            >
                                <FiUsers className="me-3 fs-5" />
                                <span className="sidebar-text">Data Mahasiswa</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/admin/dosen"
                                className="nav-link sidebar-link d-flex align-items-center py-2"
                                onClick={handleNavClick}
                                title="Data Dosen"
                            >
                                <FiUserCheck className="me-3 fs-5" />
                                <span className="sidebar-text">Data Dosen</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/admin/dosen-wali"
                                className="nav-link sidebar-link d-flex align-items-center py-2"
                                onClick={handleNavClick}
                                title="Plotting Dosen Wali"
                            >
                                <FiBookOpen className="me-3 fs-5" />
                                <span className="sidebar-text">Plotting Dosen Wali</span>
                            </NavLink>
                        </li>

                        <li className="nav-item mt-3 mb-1 sidebar-section-title">
                            <span className="text-muted small fw-bold text-uppercase px-2" style={{ fontSize: '10px' }}>Laporan</span>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/admin/rekap-perwalian"
                                className="nav-link sidebar-link d-flex align-items-center py-2"
                                onClick={handleNavClick}
                                title="Rekap Perwalian"
                            >
                                <FiFileText className="me-3 fs-5" />
                                <span className="sidebar-text">Rekap Perwalian</span>
                            </NavLink>
                        </li>

                    </>
                )}


                {/* MENU MAHASISWA */}
                {user?.role === 'mahasiswa' && (
                    <>

                        <li className="nav-item">
                            <NavLink
                                to="/mahasiswa/dashboard"
                                className="nav-link sidebar-link d-flex align-items-center py-2"
                                onClick={handleNavClick}
                                title="Dashboard"
                                end
                            >
                                <FiHome className="me-3 fs-5" />
                                <span className="sidebar-text">Dashboard</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/mahasiswa/perwalian"
                                className="nav-link sidebar-link d-flex align-items-center py-2"
                                onClick={handleNavClick}
                                title="Histori Perwalian"
                            >
                                <FiFileText className="me-3 fs-5" />
                                <span className="sidebar-text">Histori Perwalian</span>
                            </NavLink>
                        </li>

                    </>
                )}


                {/* MENU DOSEN */}
                {user?.role === 'dosen' && (
                    <>

                        <li className="nav-item">
                            <NavLink
                                to="/dosen/dashboard"
                                className="nav-link sidebar-link d-flex align-items-center py-2"
                                onClick={handleNavClick}
                                title="Dashboard"
                                end
                            >
                                <FiHome className="me-3 fs-5" />
                                <span className="sidebar-text">Dashboard</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/dosen/mahasiswa-wali"
                                className="nav-link sidebar-link d-flex align-items-center py-2"
                                onClick={handleNavClick}
                                title="Mahasiswa Wali"
                            >
                                <FiUsers className="me-3 fs-5" />
                                <span className="sidebar-text">Mahasiswa Wali</span>
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/dosen/perwalian"
                                className="nav-link sidebar-link d-flex align-items-center py-2"
                                onClick={handleNavClick}
                                title="Histori Perwalian"
                            >
                                <FiFileText className="me-3 fs-5" />
                                <span className="sidebar-text">Histori Perwalian</span>
                            </NavLink>
                        </li>

                    </>

                )}

            </ul>
            </div>

            <div className="sidebar-footer p-3 border-top bg-light">
                <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="sidebar-profile d-flex align-items-center gap-2 overflow-hidden">
                        <div className="bg-white border rounded-circle d-flex justify-content-center align-items-center text-primary" style={{ minWidth: '36px', height: '36px' }}>
                            <FiUser className="fs-5" />
                        </div>
                        <div className="sidebar-text overflow-hidden">
                            <div className="fw-bold text-dark text-truncate small">{user?.name}</div>
                            <div className="text-muted small text-capitalize" style={{ fontSize: '11px' }}>{user?.role}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="sidebar-logout-btn btn btn-light text-danger border-0 p-2 d-flex align-items-center justify-content-center rounded-3 sidebar-link ms-auto"
                        title="Logout"
                        aria-label="Logout"
                    >
                        {isLoggingOut ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        ) : (
                            <FiLogOut className="fs-5" />
                        )}
                    </button>
                </div>
            </div>

        </aside>
    );
}
