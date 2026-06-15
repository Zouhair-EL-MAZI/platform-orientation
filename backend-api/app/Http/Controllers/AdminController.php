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
        // ── Core counts (single queries each) ─────────────────────────────
        $totalStudents        = User::where('role', 'student')->count();
        $totalAdmins          = User::where('role', 'admin')->count();
        $activeUsers          = User::where('status', 'active')->count();
        $verifiedUsers        = User::whereNotNull('email_verified_at')->count();
        $totalTests           = OrientationTest::count();
        $activeTests          = OrientationTest::where('status', 'active')->count();
        $totalSubmissions     = TestSubmission::count();
        $totalRecommendations = Recommendation::count();
        $totalCareers         = Career::count();
        $totalCategories      = CareerCategory::count();
        $avgMatchScore        = Recommendation::avg('match_score');
        $avgTestScore         = TestSubmission::whereNotNull('total_score')->avg('total_score');

        // ── Submissions trend — last 14 days (2 queries total) ─────────────
        $submissionsTrend = DB::table('test_submissions')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays(13)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $trend = [];
        for ($i = 13; $i >= 0; $i--) {
            $date    = now()->subDays($i)->format('Y-m-d');
            $trend[] = [
                'date'  => now()->subDays($i)->format('M d'),
                'count' => (int) ($submissionsTrend[$date]->count ?? 0),
            ];
        }

        // ── Recent registrations (1 query, no N+1) ─────────────────────────
        $recentUsers = User::where('role', 'student')
            ->latest()
            ->take(6)
            ->get(['id', 'name', 'email', 'status', 'email_verified_at', 'created_at'])
            ->map(fn($u) => [
                'id'       => $u->id,
                'name'     => $u->name,
                'email'    => $u->email,
                'status'   => $u->status ?? ($u->email_verified_at ? 'active' : 'inactive'),
                'verified' => (bool) $u->email_verified_at,
                'joined'   => $u->created_at->toDateString(),
                'joined_human' => $u->created_at->diffForHumans(),
            ]);

        // ── Recent test submissions (1 query with join) ────────────────────
        $recentSubmissions = DB::table('test_submissions')
            ->join('users', 'test_submissions.user_id', '=', 'users.id')
            ->join('orientation_tests', 'test_submissions.test_id', '=', 'orientation_tests.id')
            ->select(
                'users.name as user_name',
                'users.email as user_email',
                'orientation_tests.title as test_title',
                'test_submissions.total_score',
                'test_submissions.created_at'
            )
            ->orderByDesc('test_submissions.created_at')
            ->take(6)
            ->get()
            ->map(fn($s) => [
                'user_name'   => $s->user_name,
                'user_email'  => $s->user_email,
                'test_title'  => $s->test_title,
                'score'       => $s->total_score,
                'time'        => \Carbon\Carbon::parse($s->created_at)->diffForHumans(),
            ]);

        // ── Recent recommendations (1 eager-loaded query) ─────────────────
        $recentRecs = Recommendation::with(['user:id,name,email', 'career:id,title'])
            ->latest()
            ->take(6)
            ->get()
            ->map(fn($r) => [
                'user_name'   => $r->user?->name ?? '—',
                'user_email'  => $r->user?->email ?? '',
                'career'      => $r->career?->title ?? '—',
                'match_score' => round((float) $r->match_score),
                'time'        => $r->created_at->diffForHumans(),
            ]);

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_students'       => $totalStudents,
                    'total_admins'         => $totalAdmins,
                    'active_users'         => $activeUsers,
                    'verified_users'       => $verifiedUsers,
                    'total_tests'          => $totalTests,
                    'active_tests'         => $activeTests,
                    'total_submissions'    => $totalSubmissions,
                    'total_recommendations'=> $totalRecommendations,
                    'total_careers'        => $totalCareers,
                    'total_categories'     => $totalCategories,
                    'avg_match_score'      => $avgMatchScore ? round((float) $avgMatchScore, 1) : 0,
                    'avg_test_score'       => $avgTestScore  ? round((float) $avgTestScore, 1)  : 0,
                ],
                'trend'               => $trend,
                'recent_users'        => $recentUsers,
                'recent_submissions'  => $recentSubmissions,
                'recent_recommendations' => $recentRecs,
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
            'email_verified_at' => null,
        ]);

        return response()->json(['success' => true, 'data' => [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role'       => $user->role,
            'tests'      => 0,
            'status'     => 'Pending',
            'verified'   => false,
            'joined'     => $user->created_at->toDateString(),
            'lastActive' => $user->updated_at->diffForHumans(),
        ]], 201);
    }

    // GET /api/admin/users
    public function users(Request $request)
    {
        $search  = $request->query('search', '');
        $status  = $request->query('status', '');    // 'active' | 'inactive' | ''
        $academicLevel = $request->query('academic_level', '');
        $perPage = min((int) $request->query('per_page', 20), 100);

        // Pre-load submission counts in one query, keyed by user_id
        $submissionCounts = DB::table('test_submissions')
            ->select('user_id', DB::raw('COUNT(*) as cnt'))
            ->groupBy('user_id')
            ->pluck('cnt', 'user_id');

        $users = User::with('profile')
            ->where('role', 'student')
            ->when($search, fn($q) => $q->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhereHas('profile', function ($query) use ($search) {
                          $query->where('education_level', 'like', "%{$search}%")
                                ->orWhere('statut', 'like', "%{$search}%");
                      });
            }))
            ->when($status, fn($q) => $q->whereHas('profile', function ($query) use ($status) {
                $query->where('statut', $status === 'active' ? 'Actif' : 'Inactif');
            }))
            ->when($academicLevel, fn($q) => $q->whereHas('profile', function ($query) use ($academicLevel) {
                $query->where('education_level', $academicLevel);
            }))
            ->latest()
            ->paginate($perPage)
            ->through(fn($u) => [
                'id'           => $u->id,
                'name'         => $u->name,
                'email'        => $u->email,
                'role'         => $u->role,
                'status'       => $u->profile?->statut ?? ($u->status ?? 'Active'),
                'verified'     => (bool) $u->email_verified_at,
                'tests'        => (int) ($submissionCounts[$u->id] ?? 0),
                'academic_level' => $u->profile?->education_level,
                'profile'      => $u->profile ? [
                    'academic_level' => $u->profile->education_level,
                    'statut'         => $u->profile->statut,
                ] : null,
                'joined'       => $u->created_at->format('M d, Y'),
                'joined_human' => $u->created_at->diffForHumans(),
                'lastActive'   => $u->updated_at->diffForHumans(),
            ]);

        return response()->json(['success' => true, 'data' => $users]);
    }

    // GET /api/admin/users/{id}
    public function showUser(int $id)
    {
        $user = User::with(['profile', 'recommendations.career'])->findOrFail($id);

        $completedTests = DB::table('test_submissions')
            ->join('orientation_tests', 'test_submissions.test_id', '=', 'orientation_tests.id')
            ->where('test_submissions.user_id', $id)
            ->select('orientation_tests.title', 'test_submissions.total_score', 'test_submissions.completed_at')
            ->orderByDesc('test_submissions.completed_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->role,
                'status'     => $user->status ?? 'active',
                'verified'   => (bool) $user->email_verified_at,
                'joined'     => $user->created_at->toDateString(),
                'joined_human' => $user->created_at->diffForHumans(),
                'lastActive' => $user->updated_at->diffForHumans(),
                'profile'    => $user->profile ? [
                    'age'              => $user->profile->age,
                    'city'             => $user->profile->city,
                    'education_level'  => $user->profile->education_level,
                    'bio'              => $user->profile->bio,
                    'interests'        => $user->profile->interests ?? [],
                    'preferred_fields' => $user->profile->preferred_fields ?? [],
                    'phone'            => $user->profile->phone,
                ] : null,
                'completed_tests' => $completedTests,
                'recommendations' => $user->recommendations->map(fn($r) => [
                    'career'      => $r->career?->title ?? '—',
                    'match_score' => round((float) $r->match_score),
                    'created_at'  => $r->created_at->toDateString(),
                ]),
            ],
        ]);
    }

    // PUT /api/admin/users/{id}
    public function updateUser(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'   => 'sometimes|string|max:255',
            'email'  => 'sometimes|email|unique:users,email,' . $id,
            'role'   => 'sometimes|in:student,admin',
            'status' => 'sometimes|in:active,inactive',   // lowercase to match DB enum
        ]);

        $user->update($validated);

        return response()->json(['success' => true, 'data' => [
            'id'     => $user->id,
            'name'   => $user->name,
            'email'  => $user->email,
            'role'   => $user->role,
            'status' => $user->status,
        ]]);
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
        // Load submission stats in a single query, keyed by test_id
        $subStats = DB::table('test_submissions')
            ->select('test_id',
                DB::raw('COUNT(*) as submissions'),
                DB::raw('AVG(total_score) as avg_score'))
            ->groupBy('test_id')
            ->get()
            ->keyBy('test_id');

        $totalStudents = User::where('role', 'student')->count();

        $tests = OrientationTest::withCount('questions')
            ->latest()
            ->get()
            ->map(function ($t) use ($subStats, $totalStudents) {
                $stat = $subStats->get($t->id);
                return [
                    'id'               => $t->id,
                    'title'            => $t->title,
                    'description'      => $t->description,
                    'category'         => $t->category,
                    'duration'         => (int) $t->duration,
                    'status'           => $t->status,
                    'active'           => $t->status === 'active',
                    'questions_count'  => $t->questions_count,
                    'submissions'      => (int) ($stat->submissions ?? 0),
                    'avg_score'        => $stat ? round((float) $stat->avg_score, 1) : 0,
                    'completion_rate'  => $totalStudents > 0
                        ? round(((int) ($stat->submissions ?? 0) / $totalStudents) * 100, 1)
                        : 0,
                    'created_at'       => $t->created_at->toDateString(),
                ];
            });

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

    // GET /api/admin/analytics
    public function analytics()
    {
        // Registrations – last 30 days
        $regRaw = DB::table('users')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('role', 'student')
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->groupBy('date')->orderBy('date')->get()->keyBy('date');

        $reg30 = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $reg30[] = ['date' => now()->subDays($i)->format('M d'), 'count' => (int) ($regRaw[$date]->count ?? 0)];
        }

        // Submissions – last 30 days
        $subRaw = DB::table('test_submissions')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->groupBy('date')->orderBy('date')->get()->keyBy('date');

        $sub30 = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $sub30[] = ['date' => now()->subDays($i)->format('M d'), 'count' => (int) ($subRaw[$date]->count ?? 0)];
        }

        // Top recommended careers
        $topCareers = Recommendation::select('career_id',
                DB::raw('COUNT(*) as count'),
                DB::raw('AVG(match_score) as avg_score'))
            ->with('career:id,title')
            ->groupBy('career_id')->orderByDesc('count')->limit(8)->get()
            ->map(fn($r) => [
                'career'    => $r->career?->title ?? 'Unknown',
                'count'     => (int) $r->count,
                'avg_score' => round((float) $r->avg_score, 1),
            ]);

        // Test performance
        $testPerf = DB::table('test_submissions')
            ->join('orientation_tests', 'test_submissions.test_id', '=', 'orientation_tests.id')
            ->select('orientation_tests.title',
                DB::raw('COUNT(*) as submissions'),
                DB::raw('AVG(total_score) as avg_score'))
            ->groupBy('orientation_tests.id', 'orientation_tests.title')
            ->orderByDesc('submissions')->get()
            ->map(fn($r) => [
                'test'        => $r->title,
                'submissions' => (int) $r->submissions,
                'avg_score'   => round((float) $r->avg_score, 1),
            ]);

        // Students by education level
        $byEdu = DB::table('profiles')
            ->select('education_level', DB::raw('COUNT(*) as count'))
            ->whereNotNull('education_level')
            ->groupBy('education_level')->orderByDesc('count')->get()
            ->map(fn($r) => ['level' => $r->education_level, 'count' => (int) $r->count]);

        // Students by city
        $byCity = DB::table('profiles')
            ->select('city', DB::raw('COUNT(*) as count'))
            ->whereNotNull('city')
            ->groupBy('city')->orderByDesc('count')->limit(8)->get()
            ->map(fn($r) => ['city' => $r->city, 'count' => (int) $r->count]);

        // WoW registration change
        $thisWeek = User::where('role', 'student')->where('created_at', '>=', now()->subDays(7))->count();
        $lastWeek = User::where('role', 'student')->whereBetween('created_at', [now()->subDays(14), now()->subDays(7)])->count();
        $wowChange = $lastWeek > 0 ? round((($thisWeek - $lastWeek) / $lastWeek) * 100, 1) : 0;

        return response()->json([
            'success' => true,
            'data'    => [
                'kpi' => [
                    'total_students'  => User::where('role', 'student')->count(),
                    'total_subs'      => TestSubmission::count(),
                    'avg_test_score'  => round((float) TestSubmission::avg('total_score'), 1),
                    'total_recs'      => Recommendation::count(),
                    'avg_match_score' => round((float) Recommendation::avg('match_score'), 1),
                    'wow_students'    => $wowChange,
                ],
                'charts' => [
                    'registrations_30d' => $reg30,
                    'submissions_30d'   => $sub30,
                    'top_careers'       => $topCareers,
                    'test_performance'  => $testPerf,
                    'by_education'      => $byEdu,
                    'by_city'           => $byCity,
                ],
            ],
        ]);
    }

    // GET /api/admin/recommendations
    public function recommendations(Request $request)
    {
        $search  = $request->query('search', '');
        $perPage = min((int) $request->query('per_page', 20), 100);
        $page    = (int) $request->query('page', 1);

        $query = Recommendation::with(['user:id,name,email', 'career:id,title,category_id', 'career.category:id,name'])
            ->latest();

        if ($search) {
            $query->whereHas('user', fn($q) =>
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
            )->orWhereHas('career', fn($q) =>
                $q->where('title', 'like', "%{$search}%")
            );
        }

        $recs = $query->paginate($perPage, ['*'], 'page', $page);

        // Analytics: top careers
        $topCareers = Recommendation::select('career_id',
                DB::raw('COUNT(*) as count'),
                DB::raw('AVG(match_score) as avg_score'))
            ->with('career:id,title')
            ->groupBy('career_id')
            ->orderByDesc('count')
            ->limit(8)
            ->get()
            ->map(fn($r) => [
                'career'    => $r->career?->title ?? 'Unknown',
                'count'     => (int) $r->count,
                'avg_score' => round((float) $r->avg_score, 1),
            ]);

        return response()->json([
            'success' => true,
            'data'    => $recs->map(fn($r) => [
                'id'          => $r->id,
                'user'        => ['name' => $r->user?->name ?? '—', 'email' => $r->user?->email ?? ''],
                'career'      => $r->career?->title ?? '—',
                'category'    => $r->career?->category?->name ?? '',
                'match_score' => round((float) $r->match_score, 1),
                'ai_analysis' => $r->ai_analysis,
                'created_at'  => $r->created_at->toDateString(),
                'created_human' => $r->created_at->diffForHumans(),
            ]),
            'meta' => [
                'total'        => $recs->total(),
                'per_page'     => $recs->perPage(),
                'current_page' => $recs->currentPage(),
                'last_page'    => $recs->lastPage(),
            ],
            'analytics' => [
                'total'       => Recommendation::count(),
                'avg_score'   => round((float) Recommendation::avg('match_score'), 1),
                'top_careers' => $topCareers,
            ],
        ]);
    }
}
