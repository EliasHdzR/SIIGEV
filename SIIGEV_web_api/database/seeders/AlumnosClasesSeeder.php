<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AlumnosClasesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('alumnos_clases')->insert([
            'alumno_matricula' => 2230163,
            'clase_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('alumnos_clases')->insert([
            'alumno_matricula' => 2230163,
            'clase_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('alumnos_clases')->insert([
            'alumno_matricula' => 2230163,
            'clase_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('alumnos_clases')->insert([
            'alumno_matricula' => 2230163,
            'clase_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('alumnos_clases')->insert([
            'alumno_matricula' => 2230163,
            'clase_id' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}