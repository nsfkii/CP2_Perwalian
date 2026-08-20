<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DosenController;
use App\Http\Controllers\Api\DosenWaliController;
use App\Http\Controllers\Api\MahasiswaController;
use App\Http\Controllers\Api\PerwalianController;
use App\Http\Controllers\Api\RekapController;
use App\Http\Controllers\Api\ImportController;

// =========================================================
// ENDPOINT PUBLIK
// =========================================================

// Login
Route::post('/login', [AuthController::class, 'login'])
    ->name('login');


// =========================================================
// ENDPOINT TERPROTEKSI
// WAJIB MENGGUNAKAN TOKEN BEARER
// =========================================================

Route::middleware('auth:sanctum')->group(function () {

    // =====================================================
    // LOGOUT
    // =====================================================

    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('logout');


    // =====================================================
    // USER YANG SEDANG LOGIN
    // =====================================================

    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });


    // =====================================================
    // PROFIL MAHASISWA YANG SEDANG LOGIN
    // =====================================================

    Route::get(
        '/mahasiswa/profil',
        [MahasiswaController::class, 'profil']
    );


    // =====================================================
    // DOSEN - MAHASISWA WALI
    // =====================================================

    // Menampilkan daftar mahasiswa wali
    // dari dosen yang sedang login
    Route::get(
        '/dosen/mahasiswa-wali',
        [DosenController::class, 'mahasiswaWali']
    );

    // Menampilkan histori perwalian
    // mahasiswa wali tertentu
    Route::get(
        '/dosen/mahasiswa-wali/{mahasiswaId}/perwalian',
        [DosenController::class, 'historiMahasiswaWali']
    );


    // =====================================================
    // PERWALIAN
    // =====================================================
    // Dapat diakses oleh mahasiswa, dosen, dan admin

    Route::apiResource(
        'perwalian',
        PerwalianController::class
    );


    // =====================================================
    // EXPORT REKAP KHUSUS DOSEN
    // =====================================================
    // Dosen tidak boleh masuk ke route admin.
    // Jadi dibuat route khusus di luar middleware role:admin.
    //
    // Controller tetap menggunakan:
    // RekapController::exportExcel
    // RekapController::exportPdf
    //
    // Untuk Dosen, controller otomatis mengambil
    // dosen berdasarkan user yang sedang login.

    Route::get(
        '/dosen/rekap/export/excel',
        [RekapController::class, 'exportExcel']
    );

    Route::get(
        '/dosen/rekap/export/pdf',
        [RekapController::class, 'exportPdf']
    );


    // =====================================================
    // KHUSUS ADMIN
    // =====================================================

    Route::middleware('role:admin')->group(function () {

        // =================================================
        // REKAP & EXPORT PERWALIAN
        // =================================================

        // Menampilkan rekap seluruh data perwalian
        Route::get(
            '/rekap/perwalian',
            [RekapController::class, 'getRekap']
        );

        // Export Excel Admin
        // Admin bisa mengirim dosen_id untuk
        // export berdasarkan dosen tertentu
        Route::get(
            '/rekap/perwalian/export/excel',
            [RekapController::class, 'exportExcel']
        );

        // Export PDF Admin
        // Admin bisa mengirim dosen_id untuk
        // export berdasarkan dosen tertentu
        Route::get(
            '/rekap/perwalian/export/pdf',
            [RekapController::class, 'exportPdf']
        );


        // =================================================
        // IMPORT MAHASISWA & DOSEN
        // =================================================

        Route::post(
            '/mahasiswa/import',
            [ImportController::class, 'importMahasiswa']
        );

        Route::post(
            '/dosen/import',
            [ImportController::class, 'importDosen']
        );


        // =================================================
        // CRUD MAHASISWA
        // =================================================

        Route::apiResource(
            'mahasiswa',
            MahasiswaController::class
        );


        // =================================================
        // CRUD DOSEN
        // =================================================

        Route::apiResource(
            'dosen',
            DosenController::class
        );


        // =================================================
        // PLOTTING BANYAK MAHASISWA
        // =================================================

        // Menampilkan mahasiswa yang belum memiliki dosen wali
        Route::get(
            '/dosen-wali/mahasiswa-belum-wali',
            [DosenWaliController::class, 'mahasiswaBelumPunyaWali']
        );

        // Menyimpan plotting banyak mahasiswa sekaligus
        Route::post(
            '/dosen-wali/store-many',
            [DosenWaliController::class, 'storeMany']
        );


        // =================================================
        // DOSEN WALI
        // =================================================

        Route::apiResource(
            'dosen-wali',
            DosenWaliController::class
        );
    });
});