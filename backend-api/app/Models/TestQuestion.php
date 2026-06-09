<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_id',
        'question',
        'question_fr',
        'question_ar',
        'type',
        'options',
        'options_fr',
        'options_ar',
        'points',
    ];

    protected $casts = [
        'options'    => 'array',
        'options_fr' => 'array',
        'options_ar' => 'array',
    ];

    public function test()
    {
        return $this->belongsTo(OrientationTest::class, 'test_id');
    }

    public function answers()
    {
        return $this->hasMany(TestAnswer::class, 'question_id');
    }
}
