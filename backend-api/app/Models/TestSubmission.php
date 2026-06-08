<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'test_id',
        'total_score',
        'score_breakdown',
        'completed_at',
    ];

    protected $casts = [
        'score_breakdown' => 'array',
        'completed_at'    => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function test()
    {
        return $this->belongsTo(OrientationTest::class, 'test_id');
    }
}
