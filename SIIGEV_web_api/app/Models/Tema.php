<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tema extends Model
{
    protected $table = 'temas';
    protected $fillable = [
        'clase_id',
        'nombre',
    ];

    public function clase(): BelongsTo
    {
        return $this->belongsTo(Clase::class);
    }

    public function materiales(): HasMany
    {
        return $this->hasMany(Material::class);
    }

    public function tareas(): HasMany
    {
        return $this->hasMany(Tarea::class);
    }
}
