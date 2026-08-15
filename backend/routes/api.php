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

// Endpoint publik (tidak perlu token)
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Endpoint terproteksi (wajib pakai token Bearer)
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('logout');

    // =========================================================
    // USER YANG SEDANG LOGIN
    // =========================================================
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });

    // =========================================================
    // PROFIL MAHASISWA YANG SEDANG LOGIN
    // =========================================================
    Route::get(
        '/mahasiswa/profil',
        [MahasiswaController::class, 'profil']
    );

    // =========================================================
    // DOSEN - MAHASISWA WALI
    // =========================================================

    // Menampilkan daftar mahasiswa wali dari dosen yang sedang login
    Route::get(
        '/dosen/mahasiswa-wali',
        [DosenController::class, 'mahasiswaWali']
    );

    // Menampilkan histori perwalian mahasiswa wali tertentu
    Route::get(
        '/dosen/mahasiswa-wali/{mahasiswaId}/perwalian',
        [DosenController::class, 'historiMahasiswaWali']
    );

    // =========================================================
    // PERWALIAN
    // =========================================================
    // Dapat diakses oleh mahasiswa, dosen, dan admin
    Route::apiResource(
        'perwalian',
        PerwalianController::class
    );

    // =========================================================
    // KHUSUS ADMIN
    // =========================================================
    Route::middleware('role:admin')->group(function () {

        // -----------------------------------------------------
        // REKAP & EXPORT PERWALIAN
        // -----------------------------------------------------
        Route::get(
            '/rekap/perwalian',
            [RekapController::class, 'getRekap']
        );

        Route::get(
            '/rekap/perwalian/export/excel',
            [RekapController::class, 'exportExcel']
        );

        Route::get(
            '/rekap/perwalian/export/pdf',
            [RekapController::class, 'exportPdf']
        );

        // -----------------------------------------------------
        // IMPORT
        // -----------------------------------------------------
        Route::post(
            '/mahasiswa/import',
            [ImportController::class, 'importMahasiswa']
        );

        Route::post(
            '/dosen/import',
            [ImportController::class, 'importDosen']
        );

        // -----------------------------------------------------
        // MAHASISWA
        // -----------------------------------------------------
        Route::apiResource(
            'mahasiswa',
            MahasiswaController::class
        );

        // -----------------------------------------------------
        // DOSEN
        // -----------------------------------------------------
        Route::apiResource(
            'dosen',
            DosenController::class
        );

        // -----------------------------------------------------
        // PLOTTING BANYAK MAHASISWA
        // -----------------------------------------------------
        Route::get(
            '/dosen-wali/mahasiswa-belum-wali',
            [DosenWaliController::class, 'mahasiswaBelumPunyaWali']
        );

        Route::post(
            '/dosen-wali/store-many',
            [DosenWaliController::class, 'storeMany']
        );

        // -----------------------------------------------------
        // DOSEN WALI
        // -----------------------------------------------------
        Route::apiResource(
            'dosen-wali',
            DosenWaliController::class
        );
    });
});