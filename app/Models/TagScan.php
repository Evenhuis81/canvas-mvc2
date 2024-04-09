<?php

declare(strict_types = 1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TagScan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'check_in_datetime',
        'check_out_datetime',
        'user_id',
    ];

    /**
     * The user the tagscan belongs to
     *
     * @return Belongsto
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
