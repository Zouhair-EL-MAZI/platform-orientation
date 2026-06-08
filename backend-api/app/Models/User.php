<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
        'email_verification_token',
        'google_id',
        'avatar',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // ── Relationships ──────────────────────────────────────────────────────

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function testAnswers()
    {
        return $this->hasMany(TestAnswer::class);
    }

    /**
     * NEW — tracks completed/in-progress orientation test sessions.
     * Requires the user_test_sessions table (migration: 2026_05_29_000001).
     */
    // public function testSessions()
    // {
    //     return $this->hasMany(UserTestSession::class);
    // }

    public function recommendations()
    {
        return $this->hasMany(Recommendation::class);
    }
}
