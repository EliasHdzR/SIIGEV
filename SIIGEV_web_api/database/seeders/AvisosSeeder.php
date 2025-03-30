<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AvisosSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('avisos')->insert([
            'clase_id' => 1,
            'mensaje' => 'Mensaja de prueba para comprobar que el Seeder funciona',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('avisos')->insert([
            'clase_id' => 2,
            'mensaje' => 'Mensaja de prueba para comprobar que el Seeder funciona',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('avisos')->insert([
            'clase_id' => 3,
            'mensaje' => 'Mensaja de prueba para comprobar que el Seeder funciona',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('avisos')->insert([
            'clase_id' => 1,
            'mensaje' => 'Les mando este mensaje para notificarles que el dia de hoy no habra clase',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('avisos')->insert([
            'clase_id' => 1,
            'mensaje' => 'Les mando este mensaje para notificarles que el examen de esta semana sera pospuesto para la proxima semana',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

    }
}