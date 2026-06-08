<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Career extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'description',
        'salary_range',
        'required_skills',
        'future_scope',
        'image',
        // New Moroccan context fields
        'moroccan_context',
        'study_paths',
        'recommended_schools',
        'demand_level',
    ];

    protected $casts = [
        'required_skills'     => 'array',
        'study_paths'         => 'array',
        'recommended_schools' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(CareerCategory::class, 'category_id');
    }

    public function recommendations()
    {
        return $this->hasMany(Recommendation::class);
    }
}
