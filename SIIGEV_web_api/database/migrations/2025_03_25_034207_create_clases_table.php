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
        Schema::create('clases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carrera_id')->references('id')->on('carreras');
            $table->foreignId('maestro_id')->references('id')->on('maestros');
            $table->string('nombre');
            $table->string('descripcion');
            $table->string('codigo');
            $table->tinyInteger("cuatrimestre");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clases');
    }
};
