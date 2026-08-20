import { FiMenu } from 'react-icons/fi';

export default function Topbar({ toggleMobileSidebar, toggleDesktopCollapse }) {
    return (
        <header className="d-flex align-items-center px-3 px-md-4 bg-white border-bottom sticky-top" style={{ height: '70px', zIndex: 998 }}>
            <div className="d-flex align-items-center gap-3">
                <button
                    className="btn btn-light d-md-none border-0 p-2"
                    onClick={toggleMobileSidebar}
                    aria-label="Buka menu"
                >
                    <FiMenu className="fs-4 text-dark" />
                </button>

                <button
                    className="btn btn-light d-none d-md-flex border-0 p-2 align-items-center justify-content-center"
                    onClick={toggleDesktopCollapse}
                    title="Ciutkan/Buka Sidebar"
                    aria-label="Ciutkan atau buka sidebar"
                >
                    <FiMenu className="fs-4 text-dark" />
                </button>

                <span className="fw-semibold text-secondary d-none d-sm-inline">
                    Sistem Perwalian Digital
                </span>
            </div>
        </header>
    );
}
