<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Material extends Model
{
    protected $table = 'materiales';
    protected $fillable = [
        'tema_id',
        'titulo',
        'descripcion',
    ];

    public function tema(): BelongsTo
    {
        return $this->belongsTo(Tema::class);
    }
}
