import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/auth/Login';

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const Mahasiswa = lazy(() => import('../pages/admin/Mahasiswa'));
const ImportMahasiswa = lazy(() => import('../pages/admin/ImportMahasiswa'));
const Dosen = lazy(() => import('../pages/admin/Dosen'));
const ImportDosen = lazy(() => import('../pages/admin/ImportDosen'));
const DosenWali = lazy(() => import('../pages/admin/DosenWali'));
const RekapPerwalian = lazy(() => import('../pages/admin/RekapPerwalian'));

const MahasiswaDashboard = lazy(() => import('../pages/mahasiswa/Dashboard'));
const MahasiswaPerwalian = lazy(() => import('../pages/mahasiswa/Perwalian'));

const DosenDashboard = lazy(() => import('../pages/dosen/Dashboard'));
const DosenPerwalian = lazy(() => import('../pages/dosen/Perwalian'));
const MahasiswaWali = lazy(() => import('../pages/dosen/MahasiswaWali'));

const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Memuat halaman...</span>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Rute yang menggunakan MainLayout (Sidebar & Topbar) */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/mahasiswa" element={<Mahasiswa />} />
            <Route path="/admin/mahasiswa/import" element={<ImportMahasiswa />} />
            <Route path="/admin/dosen" element={<Dosen />} />
            <Route path="/admin/dosen/import" element={<ImportDosen />} />
            <Route path="/admin/dosen-wali" element={<DosenWali />} />
            <Route path="/admin/rekap-perwalian" element={<RekapPerwalian />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["mahasiswa"]} />}>
            <Route path="/mahasiswa/dashboard" element={<MahasiswaDashboard />} />
            <Route path="/mahasiswa/perwalian" element={<MahasiswaPerwalian />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["dosen"]} />}>
            <Route path="/dosen/dashboard" element={<DosenDashboard />} />
            <Route path="/dosen/perwalian" element={<DosenPerwalian />} />
            <Route path="/dosen/mahasiswa-wali" element={<MahasiswaWali />} />
          </Route>
        </Route>

        <Route path="*" element={<div className="p-5 text-center"><h2>404 - Halaman Tidak Ditemukan</h2></div>} />
      </Routes>
    </Suspense>
  );
}
