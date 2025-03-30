<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ClasesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('clases')->insert([
            'carrera_id' => 1,
            'maestro_id' => 1,
            'nombre' => 'Programación I',
            'descripcion' => 'Introducción a la programación',
            'codigo' => 'ITI-101',
            'cuatrimestre' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('clases')->insert([
            'carrera_id' => 1,
            'maestro_id' => 2,
            'nombre' => 'Programación II',
            'descripcion' => 'Programación Estriucturada',
            'codigo' => 'ITI-102',
            'cuatrimestre' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('clases')->insert([
            'carrera_id' => 1,
            'maestro_id' => 3,
            'nombre' => 'Redes',
            'descripcion' => 'Introducción a las redes de Cisco',
            'codigo' => 'ITI-103',
            'cuatrimestre' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('clases')->insert([
            'carrera_id' => 1,
            'maestro_id' => 4,
            'nombre' => 'Base de Datos',
            'descripcion' => 'Introducción a las bases de datos de Oracle',
            'codigo' => 'ITI-104',
            'cuatrimestre' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('clases')->insert([
            'carrera_id' => 1,
            'maestro_id' => 5,
            'nombre' => 'Sistemas inteligentes',
            'descripcion' => 'Introducción a machine learning',
            'codigo' => 'ITI-105',
            'cuatrimestre' => 8,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}