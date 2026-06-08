<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrientationTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'duration',
        'status',
    ];

    // ── Relationships ──────────────────────────────────────────────────────

    /**
     * Existing relationship — questions ordered by creation.
     */
    public function questions()
    {
        return $this->hasMany(TestQuestion::class, 'test_id')->orderBy('id');
    }

    /**
     * NEW — links to UserTestSession records for completion tracking.
     */
    public function sessions()
    {
        return $this->hasMany(UserTestSession::class, 'test_id');
    }

    // ── Scopes ─────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
