<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aviso extends Model
{
    protected $table = 'avisos';
    protected $fillable = [
        'clase_id',
        'mensaje',
    ];

    public function clase(): BelongsTo
    {
        return $this->belongsTo(Clase::class);
    }
}
