import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

export default function MainLayout() {
    return (
        <div className="d-flex min-vh-100" style={{ backgroundColor: 'var(--bg-color)' }}>
            <Sidebar />
            <div className="flex-grow-1" style={{ marginLeft: '260px' }}>
                <Topbar />
                <main className="p-4">
                    {/* Komponen halaman yang dinamis akan di-render di dalam Outlet */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
