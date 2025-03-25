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

    public function entregas(): HasMany
    {
        return $this->hasMany(Entrega::class);
    }
}
