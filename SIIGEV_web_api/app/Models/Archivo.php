<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archivo extends Model
{
    protected $table = 'archivos';
    protected $fillable = [
        'publicacion_id',
        'publicacion_tipo',
        'nombre_original',
        'nombre_storage',
        'extension',
    ];
}
