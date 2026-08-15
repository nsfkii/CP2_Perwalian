import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/auth/Login';

// Import dashboards
import AdminDashboard from '../pages/admin/Dashboard';
import MahasiswaDashboard from '../pages/mahasiswa/Dashboard';
import DosenDashboard from '../pages/dosen/Dashboard';
import Mahasiswa from '../pages/admin/Mahasiswa';
import Dosen from '../pages/admin/Dosen';
import DosenWali from '../pages/admin/DosenWali';
import RekapPerwalian from '../pages/admin/RekapPerwalian';
import ImportMahasiswa from '../pages/admin/ImportMahasiswa';
import ImportDosen from '../pages/admin/ImportDosen';
import MahasiswaPerwalian from '../pages/mahasiswa/Perwalian';
import DosenPerwalian from '../pages/dosen/Perwalian';
import MahasiswaWali from '../pages/dosen/MahasiswaWali';

export default function AppRoutes() {
  return (
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
  );
}