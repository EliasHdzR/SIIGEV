<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tarea extends Model
{
    protected $table = 'tareas';
    protected $fillable = [
        'tema_id',
        'titulo',
        'instrucciones',
        'fecha_entrega',
    ];

    public function tema(): BelongsTo
    {
        return $this->belongsTo(Tema::class);
    }

    public function statsTarea(): array
    {
        $cantidadAlumnos = $this->tema->clase->alumnos()->count();
        $entregasDB = $this->HasMany(Entrega::class);
        $entregas["cantAsignadas"] = $cantidadAlumnos;
        $entregas["cantEntregadas"] = $entregasDB->where("entregada", "=", true)->count();
        $entregas["cantCalificadas"] = $entregasDB->where("calificacion", "!=", null)->count();

        return $entregas;
    }

    public function entregas(): HasMany
    {
        return $this->hasMany(Entrega::class);
    }
}
