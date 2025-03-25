<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Archivo extends Model
{
    protected $table = 'archivos';
    protected $fillable = [
        'publicacion_id',
        'publicacion_tipo',
        'nombre',
        'ruta',
    ];
}
