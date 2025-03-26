<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AlumnoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('alumnos')->insert([
            'matricula' => '2230200',
            'nombre' => 'Elias Hernandez',
            'email' => '2230200@upv.edu.mx',
            'password' => Hash::make('secret'),
        ]);

        DB::table('alumnos')->insert([
            'matricula' => '2230249',
            'nombre' => 'Luis Cabriales',
            'email' => '2230249@upv.edu.mx',
            'password' => Hash::make('secret'),
        ]);

        DB::table('alumnos')->insert([
            'matricula' => '2230163',
            'nombre' => 'Julissa Guerrero',
            'email' => '2230163@upv.edu.mx',
            'password' => Hash::make('secret'),
        ]);

        DB::table('alumnos')->insert([
            'matricula' => '2230224',
            'nombre' => 'Jesús Núñez',
            'email' => '2230224@upv.edu.mx',
            'password' => Hash::make('secret'),
        ]);

        DB::table('alumnos')->insert([
            'matricula' => '2230233',
            'nombre' => 'Alan Morales',
            'email' => '2230233@upv.edu.mx',
            'password' => Hash::make('secret'),
        ]);
    }
}
