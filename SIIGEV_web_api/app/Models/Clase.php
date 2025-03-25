<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Clase extends Model
{
    protected $table = 'clases';
    protected $fillable = [
        'carrera_id',
        'maestro_id',
        'nombre',
        'descripcion',
        'codigo',
        'cuatrimestre'
    ];

    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class);
    }

    public function maestro(): BelongsTo
    {
        return $this->belongsTo(Maestro::class);
    }

    public function alumnos(): BelongsToMany
    {
        return $this->belongsToMany(Alumno::class, 'alumnos_clases', 'clase_id', 'alumno_matricula');
    }

    public function avisos(): HasMany
    {
        return $this->hasMany(Aviso::class);
    }

    public function temas(): HasMany
    {
        return $this->hasMany(Tema::class);
    }
}
