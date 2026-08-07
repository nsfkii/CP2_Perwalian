<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DosenController;
use App\Http\Controllers\Api\DosenWaliController;
use App\Http\Controllers\Api\MahasiswaController;
use App\Http\Controllers\Api\PerwalianController;

// Endpoint publik (tidak perlu token)
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Endpoint terproteksi (wajib pakai token Bearer)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    // Endpoint untuk mendapatkan data profil user yang sedang login
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });

    // Endpoint Perwalian dapat diakses oleh mahasiswa, dosen, dan admin
    Route::apiResource('perwalian', PerwalianController::class);

    // Hanya Admin yang bisa mengelola data Mahasiswa, Dosen, dan Dosen Wali
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('mahasiswa', MahasiswaController::class);
        Route::apiResource('dosen', DosenController::class);
        Route::apiResource('dosen-wali', DosenWaliController::class);
    });
});
