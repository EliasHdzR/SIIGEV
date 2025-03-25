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
        Schema::create('refresh_tokens', function (Blueprint $table) {
            $table->char('refresh_token', 26)->primary();
            $table->unsignedBigInteger('alumno_matricula')->nullable();
            $table->unsignedBigInteger('maestro_id')->nullable();
            $table->timestamp('fecha_generado');
            $table->timestamp('fecha_caduca');
            $table->boolean('activo')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refresh_tokens');
    }
};
