<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MaestroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('maestros')->insert([
            'nombre' => 'Luis Flores',
            'email' => 'lfloresd@upv.edu.mx',
            'password' => Hash::make('secret'),
        ]);

        DB::table('maestros')->insert([
            'nombre' => 'Jorge Hernandez',
            'email' => 'jhernandeza@upv.edu.mx',
            'password' => Hash::make('secret'),
        ]);

        DB::table('maestros')->insert([
            'nombre' => 'Israel Pulido',
            'email' => 'ipulidop@upv.edu.mx',
            'password' => Hash::make('secret'),
        ]);

        DB::table('maestros')->insert([
            'nombre' => 'Juan Lumbreras',
            'email' => 'jlumbrerasv@upv.edu.mx',
            'password' => Hash::make('secret'),
        ]);

        DB::table('maestros')->insert([
            'nombre' => 'Marco Aurelio Nuño',
            'email' => 'mnunom@upv.edu.mx',
            'password' => Hash::make('secret'),
        ]);
    }
}
