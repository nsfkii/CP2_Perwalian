<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->index('user_id', 'mahasiswa_user_id_index');
            $table->index('nama', 'mahasiswa_nama_index');
            $table->index('prodi', 'mahasiswa_prodi_index');
        });

        Schema::table('dosen', function (Blueprint $table) {
            $table->index('user_id', 'dosen_user_id_index');
            $table->index('nama', 'dosen_nama_index');
        });

        Schema::table('dosen_wali', function (Blueprint $table) {
            $table->index('mahasiswa_id', 'dosen_wali_mahasiswa_id_index');
            $table->index('dosen_id', 'dosen_wali_dosen_id_index');
        });

        Schema::table('perwalian', function (Blueprint $table) {
            $table->index('mahasiswa_id', 'perwalian_mahasiswa_id_index');
            $table->index('dosen_id', 'perwalian_dosen_id_index');
            $table->index('tahun_ajaran', 'perwalian_tahun_ajaran_index');
            $table->index('semester', 'perwalian_semester_index');
            $table->index('topik', 'perwalian_topik_index');
            $table->index(['dosen_id', 'mahasiswa_id'], 'perwalian_dosen_mahasiswa_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('perwalian', function (Blueprint $table) {
            $table->dropIndex('perwalian_dosen_mahasiswa_index');
            $table->dropIndex('perwalian_topik_index');
            $table->dropIndex('perwalian_semester_index');
            $table->dropIndex('perwalian_tahun_ajaran_index');
            $table->dropIndex('perwalian_dosen_id_index');
            $table->dropIndex('perwalian_mahasiswa_id_index');
        });

        Schema::table('dosen_wali', function (Blueprint $table) {
            $table->dropIndex('dosen_wali_dosen_id_index');
            $table->dropIndex('dosen_wali_mahasiswa_id_index');
        });

        Schema::table('dosen', function (Blueprint $table) {
            $table->dropIndex('dosen_nama_index');
            $table->dropIndex('dosen_user_id_index');
        });

        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->dropIndex('mahasiswa_prodi_index');
            $table->dropIndex('mahasiswa_nama_index');
            $table->dropIndex('mahasiswa_user_id_index');
        });
    }
};
