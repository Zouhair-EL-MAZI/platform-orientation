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
use Illuminate\Support\Facades\Hash;

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

    // POST /api/admin/users
    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => 'required|in:student,admin',
        ]);

        $user = User::create([
            'name'              => $validated['name'],
            'email'             => $validated['email'],
            'password'          => Hash::make($validated['password']),
            'role'              => $validated['role'],
            'email_verified_at' => now(),
        ]);

        return response()->json(['success' => true, 'data' => [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role'       => $user->role,
            'tests'      => 0,
            'status'     => 'Active',
            'verified'   => true,
            'joined'     => $user->created_at->toDateString(),
            'lastActive' => $user->updated_at->diffForHumans(),
        ]], 201);
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

    // GET /api/admin/users/{id}
    public function showUser(int $id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->role,
                'tests'      => TestSubmission::where('user_id', $user->id)->count(),
                'status'     => $user->email_verified_at ? 'Active' : 'Pending',
                'verified'   => (bool) $user->email_verified_at,
                'joined'     => $user->created_at->toDateString(),
                'lastActive' => $user->updated_at->diffForHumans(),
                'created_at' => $user->created_at,
                'email_verified_at' => $user->email_verified_at,
            ],
        ]);
    }

    // PUT /api/admin/users/{id}
    public function updateUser(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:student,admin,counselor,moderator',
            'status' => 'sometimes|in:Active,Inactive,Pending',
        ]);

        $user->update($validated);

        return response()->json(['success' => true, 'data' => $user]);
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

    // GET /api/admin/users/export/csv
    public function exportUsers()
    {
        $users = User::select('id', 'name', 'email', 'role', 'email_verified_at', 'created_at', 'updated_at')
            ->latest()
            ->get();

        $csv = "ID,Name,Email,Role,Status,Verified,Joined,Last Updated\n";

        foreach ($users as $user) {
            $status = $user->email_verified_at ? 'Active' : 'Pending';
            $verified = $user->email_verified_at ? 'Yes' : 'No';
            $csv .= sprintf(
                "%d,%s,%s,%s,%s,%s,%s,%s\n",
                $user->id,
                '"' . $user->name . '"',
                $user->email,
                $user->role,
                $status,
                $verified,
                $user->created_at->toDateString(),
                $user->updated_at->toDateString()
            );
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="users_' . date('Y-m-d_H-i-s') . '.csv"');
    }

    // POST /api/admin/tests
    public function createTest(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'required|in:aptitude,personality,skills',
            'duration'    => 'nullable|integer|min:1',
        ]);
        $test = OrientationTest::create(array_merge($validated, ['status' => 'draft']));
        return response()->json(['success' => true, 'data' => [
            'id' => $test->id, 'title' => $test->title, 'description' => $test->description,
            'category' => $test->category, 'duration' => $test->duration,
            'status' => $test->status, 'questions_count' => 0, 'submissions' => 0, 'active' => false,
        ]], 201);
    }

    // PUT /api/admin/tests/{id}
    public function updateTest(Request $request, int $id)
    {
        $test = OrientationTest::findOrFail($id);
        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'sometimes|in:aptitude,personality,skills',
            'duration'    => 'nullable|integer|min:1',
        ]);
        $test->update($validated);
        return response()->json(['success' => true, 'data' => $test]);
    }

    // DELETE /api/admin/tests/{id}
    public function deleteTest(int $id)
    {
        OrientationTest::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // GET /api/admin/tests/{id}/questions
    public function testQuestions(int $id)
    {
        $questions = OrientationTest::findOrFail($id)->questions()->get()
            ->map(fn($q) => [
                'id' => $q->id, 'question' => $q->question,
                'type' => $q->type, 'options' => $q->options, 'points' => $q->points,
            ]);
        return response()->json(['success' => true, 'data' => $questions]);
    }

    // POST /api/admin/tests/{id}/questions
    public function createQuestion(Request $request, int $id)
    {
        OrientationTest::findOrFail($id);
        $validated = $request->validate([
            'question' => 'required|string',
            'type'     => 'required|in:single_choice,scale,text',
            'options'  => 'nullable|array',
            'points'   => 'nullable|integer|min:0',
        ]);
        $q = \App\Models\TestQuestion::create(array_merge($validated, ['test_id' => $id]));
        return response()->json(['success' => true, 'data' => [
            'id' => $q->id, 'question' => $q->question,
            'type' => $q->type, 'options' => $q->options, 'points' => $q->points,
        ]], 201);
    }

    // PUT /api/admin/tests/{id}/questions/{qid}
    public function updateQuestion(Request $request, int $id, int $qid)
    {
        $q = \App\Models\TestQuestion::where('test_id', $id)->findOrFail($qid);
        $validated = $request->validate([
            'question' => 'sometimes|string',
            'type'     => 'sometimes|in:single_choice,scale,text',
            'options'  => 'nullable|array',
            'points'   => 'nullable|integer|min:0',
        ]);
        $q->update($validated);
        return response()->json(['success' => true, 'data' => [
            'id' => $q->id, 'question' => $q->question,
            'type' => $q->type, 'options' => $q->options, 'points' => $q->points,
        ]]);
    }

    // DELETE /api/admin/tests/{id}/questions/{qid}
    public function deleteQuestion(int $id, int $qid)
    {
        \App\Models\TestQuestion::where('test_id', $id)->findOrFail($qid)->delete();
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

    // POST /api/admin/careers
    public function createCareer(Request $request)
    {
        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            'category_id'     => 'required|exists:career_categories,id',
            'salary_range'    => 'nullable|string|max:100',
            'demand_level'    => 'nullable|string|max:30',
            'required_skills' => 'nullable|array',
            'future_scope'    => 'nullable|string',
        ]);
        $career = Career::create($validated);
        $career->load('category');
        return response()->json(['success' => true, 'data' => $career], 201);
    }

    // PUT /api/admin/careers/{id}
    public function updateCareer(Request $request, int $id)
    {
        $career = Career::findOrFail($id);
        $validated = $request->validate([
            'title'           => 'sometimes|string|max:255',
            'description'     => 'nullable|string',
            'category_id'     => 'sometimes|exists:career_categories,id',
            'salary_range'    => 'nullable|string|max:100',
            'demand_level'    => 'nullable|string|max:30',
            'required_skills' => 'nullable|array',
            'future_scope'    => 'nullable|string',
        ]);
        $career->update($validated);
        $career->load('category');
        return response()->json(['success' => true, 'data' => $career]);
    }

    // DELETE /api/admin/careers/{id}
    public function deleteCareer(int $id)
    {
        Career::findOrFail($id)->delete();
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
