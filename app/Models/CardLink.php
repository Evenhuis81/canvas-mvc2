<?php

declare(strict_types = 1);

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardLink extends Model
{
    use HasFactory;

        /**
         * The attributes that are mass assignable.
         *
         * @var array<string>
         */
    protected $fillable = [
        'user_id', 'end_time', 'is_linked', 'card_number',
    ];

    /**
     * The user the cardlink belongs to
     *
     * @return Belongsto
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
