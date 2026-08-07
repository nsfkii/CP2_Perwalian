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
        Schema::create('perwalian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->restrictOnDelete();
            $table->foreignId('dosen_id')->constrained('dosen')->restrictOnDelete();
            $table->string('semester', 10);
            $table->string('tahun_ajaran', 10);
            $table->date('tanggal');
            $table->string('topik', 50);
            $table->text('isi_perwalian');
            $table->string('status', 20)->default('Selesai');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perwalian');
    }
};
