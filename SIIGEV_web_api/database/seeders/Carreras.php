<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class Carreras extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('carreras')->insert([
            'nombre' => 'Ingeniería en Tecnologías de la Información',
        ]);

        DB::table('carreras')->insert([
            'nombre' => 'Ingeniería en Mecatrónica',
        ]);

        DB::table('carreras')->insert([
            'nombre' => 'Ingeniería en Sistemas Automotrices',
        ]);

        DB::table('carreras')->insert([
            'nombre' => 'Ingeniería en Manufactura',
        ]);
    }
}
