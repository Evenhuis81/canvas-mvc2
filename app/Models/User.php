<?php

declare(strict_types = 1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * The cards the user has
     *
     * @return HasMany
     */
    public function cards(): HasMany
    {
        return $this->hasMany(Card::class);
    }

    /**
     * The tagscans the user has
     *
     * @return HasMany
     */
    public function tagScans(): HasMany
    {
        return $this->hasMany(TagScan::class);
    }

    /**
     * The roles the user belongs to
     *
     * @return BelongsToMany
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    /**
     * The invitations the user has
     *
     * @return HasMany
     */
    public function adminInvitations(): HasMany
    {
        return $this->hasMany(AdminInvitation::class, 'invitee_user_id');
    }

    /**
     * Is the user admin?
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->roles->contains((function ($item) {
            return $item->name === "Admin";
        }));
    }
}
