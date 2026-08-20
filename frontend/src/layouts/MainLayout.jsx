import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

export default function MainLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleMobileSidebar = () => {
        setIsMobileOpen((current) => !current);
    };

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    const toggleDesktopCollapse = () => {
        setIsCollapsed((current) => !current);
    };

    return (
        <div className="d-flex min-vh-100 overflow-hidden" style={{ backgroundColor: 'var(--bg-color)' }}>
            <Sidebar
                isMobileOpen={isMobileOpen}
                toggleMobileSidebar={toggleMobileSidebar}
                closeMobileSidebar={closeMobileSidebar}
                isCollapsed={isCollapsed}
            />

            <div
                className={`flex-grow-1 sidebar-transition main-content ${isCollapsed ? 'expanded' : ''}`}
            >
                <Topbar
                    toggleMobileSidebar={toggleMobileSidebar}
                    toggleDesktopCollapse={toggleDesktopCollapse}
                />
                <main className="p-3 p-md-4 container-fluid">
                    {/* Komponen halaman yang dinamis akan di-render di dalam Outlet */}
                    <Outlet />
                </main>
            </div>

            {isMobileOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none"
                    style={{ zIndex: 999 }}
                    onClick={closeMobileSidebar}
                />
            )}
        </div>
    );
}
