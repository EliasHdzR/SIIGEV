<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Carrera extends Model
{
    protected $table = 'carreras';
    protected $fillable = [
        'nombre',
    ];

    public function clases(): HasMany
    {
        return $this->hasMany(Clase::class);
    }
}
