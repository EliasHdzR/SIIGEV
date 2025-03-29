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
        Schema::create('alumnos_clases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumno_matricula')->references('matricula')->on('alumnos');
            $table->foreignId('clase_id')->references('id')->on('clases');
            $table->timestamps();
            $table->unique(['alumno_matricula', 'clase_id'], 'alumno_clase_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumnos_clases');
    }
};
