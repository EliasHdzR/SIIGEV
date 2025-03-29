<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Alumno extends Model
{
    protected $table = 'alumnos';
    protected $primaryKey = 'matricula';

    protected $fillable = [
        'matricula',
        'nombre',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function clases(): BelongsToMany
    {
        return $this->belongsToMany(Clase::class, 'alumnos_clases', 'alumno_matricula', 'clase_id');
    }

    public function entregas(): HasMany
    {
        return $this->hasMany(Entrega::class);
    }
}
