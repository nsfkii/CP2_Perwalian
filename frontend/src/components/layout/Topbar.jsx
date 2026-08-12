import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function Topbar() {
    const { user, logout } = useAuth();

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
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
    };

    return (
        <header className="d-flex justify-content-end align-items-center py-3 px-4 bg-white border-bottom sticky-top" style={{ zIndex: 999 }}>
            <div className="d-flex align-items-center gap-4">
                <div className="text-end">
                    <div className="fw-bold fs-6 text-dark">{user?.name}</div>
                    <div className="text-muted small text-capitalize">{user?.role}</div>
                </div>
                <div 
                    className="bg-light rounded-circle d-flex justify-content-center align-items-center" 
                    style={{ width: '40px', height: '40px' }}
                >
                    <FiUser className="fs-5 text-secondary" />
                </div>
                <button 
                    onClick={handleLogout} 
                    className="btn btn-light text-danger border-0 d-flex align-items-center"
                    title="Logout"
                >
                    <FiLogOut className="fs-5" />
                </button>
            </div>
        </header>
    );
}
