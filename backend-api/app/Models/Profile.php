<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'age',
        'education_level',
        'interests',
        'preferred_fields',
        'bio',
        'phone',
        'city',
    ];

    protected $casts = [
        'interests' => 'array',
        'preferred_fields' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
