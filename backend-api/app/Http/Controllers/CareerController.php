<?php

namespace App\Http\Controllers;

use App\Models\Career;
use App\Models\CareerCategory;
use Illuminate\Http\Request;

class CareerController extends Controller
{
    /**
     * GET /api/student/careers
     * List careers with optional search, category filter, and skill filter.
     * API contract preserved — only response enriched with new fields.
     */
    public function index(Request $request)
    {
        $query = Career::with('category');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($skill = $request->query('skill')) {
            $query->whereJsonContains('required_skills', $skill);
        }

        // Admin gets all, student gets paginated
        $isAdmin = auth()->user()?->role === 'admin';
        $careers = $isAdmin
            ? $query->orderBy('title')->get()->map(fn($c) => $this->formatCareer($c))
            : $query->orderBy('title')->paginate(10)->through(fn($c) => $this->formatCareer($c));

        return response()->json(['success' => true, 'data' => $careers]);
    }

    /**
     * GET /api/student/careers/{id}
     * Get a single career with full detail including new Moroccan fields.
     */
    public function show(int $id)
    {
        $career = Career::with('category')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $this->formatCareer($career),
        ]);
    }

    /**
     * GET /api/student/career-categories
     * List categories with career counts.
     */
    public function categories()
    {
        $categories = CareerCategory::withCount('careers')
            ->orderBy('name')
            ->get()
            ->map(fn($c) => [
                'id'            => $c->id,
                'name'          => $c->name,
                'description'   => $c->description,
                'careers_count' => $c->careers_count,
            ]);

        return response()->json(['success' => true, 'data' => $categories]);
    }

    /**
     * Format a career for API response.
     * Backward-compatible: existing fields unchanged, new fields added.
     */
    private function formatCareer(Career $career): array
    {
        return [
            // ── Existing fields (unchanged) ──────────────────────────────────
            'id'               => $career->id,
            'title'            => $career->title,
            'description'      => $career->description,
            'salary_range'     => $career->salary_range,
            'required_skills'  => $career->required_skills ?? [],
            'future_scope'     => $career->future_scope,
            'image'            => $career->image,
            'category_id'      => $career->category_id,
            'category' => [
                'id'   => $career->category?->id,
                'name' => $career->category?->name,
            ],

            // ── New Moroccan context fields (nullable, additive) ─────────────
            'moroccan_context'    => $career->moroccan_context,
            'study_paths'         => $career->study_paths ?? [],
            'recommended_schools' => $career->recommended_schools ?? [],
            'demand_level'        => $career->demand_level,
        ];
    }
}
