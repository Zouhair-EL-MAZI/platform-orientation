<?php

namespace App\Http\Controllers;

use App\Models\Career;
use App\Models\CareerCategory;
use App\Models\OrientationTest;
use App\Models\Recommendation;
use App\Models\TestAnswer;
use App\Models\TestSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // GET /api/admin/dashboard
    public function dashboard()
    {
        $totalUsers        = User::where('role', 'student')->orWhere('role', 'user')->count();
        $totalVerifiedUsers = User::whereNotNull('email_verified_at')->count();
        $totalTests        = OrientationTest::where('status', 'active')->count();
        $totalSubmissions  = TestSubmission::count();
        $totalRecommendations = Recommendation::count();
        $totalCareers      = Career::count();
        $totalCategories   = CareerCategory::count();
        $avgScore          = TestSubmission::whereNotNull('total_score')->avg('total_score');
        $avgMatchScore     = Recommendation::avg('match_score');

        $recentUsers = User::latest()
            ->take(5)
            ->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'role'       => $u->role,
                'tests'      => TestSubmission::where('user_id', $u->id)->count(),
                'status'     => $u->email_verified_at ? 'Active' : 'Pending',
                'verified'   => (bool) $u->email_verified_at,
                'joined'     => $u->created_at->toDateString(),
                'lastActive' => $u->updated_at->diffForHumans(),
            ]);

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_users'         => $totalUsers,
                    'total_verified_users' => $totalVerifiedUsers,
                    'total_submissions'   => $totalSubmissions,
                    'total_tests'         => $totalTests,
                    'total_recommendations'=> $totalRecommendations,
                    'total_careers'       => $totalCareers,
                    'total_categories'    => $totalCategories,
                    'avg_match_score'     => $avgMatchScore ? round($avgMatchScore) : 0,
                ],
                'recent_users' => $recentUsers,
            ],
        ]);
    }

    // GET /api/admin/users
    public function users(Request $request)
    {
        $search = $request->query('search', '');

        $users = User::when($search, fn($q) =>
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
            )
            ->latest()
            ->paginate(20)
            ->through(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'role'       => $u->role,
                'tests'      => TestSubmission::where('user_id', $u->id)->count(),
                'status'     => $u->email_verified_at ? 'Active' : 'Pending',
                'verified'   => (bool) $u->email_verified_at,
                'joined'     => $u->created_at->toDateString(),
                'lastActive' => $u->updated_at->diffForHumans(),
            ]);

        return response()->json(['success' => true, 'data' => $users]);
    }

    // DELETE /api/admin/users/{id}
    public function deleteUser(int $id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return response()->json(['success' => false, 'message' => 'Cannot delete admin users.'], 403);
        }
        $user->delete();
        return response()->json(['success' => true]);
    }

    // GET /api/admin/tests
    public function tests()
    {
        $tests = OrientationTest::withCount('questions')
            ->latest()
            ->get()
            ->map(fn($t) => [
                'id'              => $t->id,
                'title'           => $t->title,
                'category'        => $t->category,
                'duration'        => $t->duration,
                'status'          => $t->status,
                'questions_count' => $t->questions_count,
                'submissions'     => TestSubmission::where('test_id', $t->id)->count(),
                'created_at'      => $t->created_at->toDateString(),
            ]);

        return response()->json(['success' => true, 'data' => $tests]);
    }

    // PUT /api/admin/tests/{id}/status
    public function updateTestStatus(Request $request, int $id)
    {
        $test = OrientationTest::findOrFail($id);
        $test->update(['status' => $request->status]);
        return response()->json(['success' => true]);
    }

    // GET /api/admin/recommendations
    public function recommendations()
    {
        $recs = Recommendation::with(['user', 'career'])
            ->latest()
            ->take(50)
            ->get()
            ->map(fn($r) => [
                'id'          => $r->id,
                'user'        => ['name' => $r->user?->name, 'email' => $r->user?->email],
                'career'      => $r->career?->title,
                'match_score' => round($r->match_score),
                'created_at'  => $r->created_at->diffForHumans(),
            ]);

        return response()->json(['success' => true, 'data' => $recs]);
    }
}
