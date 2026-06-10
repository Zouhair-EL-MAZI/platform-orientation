<?php

namespace App\Http\Controllers;

use App\Models\Career;
use App\Models\OrientationTest;
use App\Models\Recommendation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * GET /api/admin/dashboard
     * Returns all real statistics for the admin dashboard.
     */
    public function dashboard(Request $request)
    {
        // ── Core counts ────────────────────────────────────────────────────
        $totalStudents = User::where('role', 'student')->count();

        $activeStudents = User::where('role', 'student')
            ->where('status', 'active')
            ->count();

        $completedTests = DB::table('test_submissions')->count();

        $totalCareers = Career::count();

        $totalRecommendations = Recommendation::count();

        $totalTests = OrientationTest::count();

        // ── Chart: test submissions per day (last 14 days) ─────────────────
        $submissionsTrend = DB::table('test_submissions')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays(13))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Fill in zeros for days with no submissions
        $trend = [];
        for ($i = 13; $i >= 0; $i--) {
            $date     = now()->subDays($i)->format('Y-m-d');
            $trend[]  = [
                'date'  => now()->subDays($i)->format('M d'),
                'count' => $submissionsTrend[$date]->count ?? 0,
            ];
        }

        // ── Chart: students registered per day (last 14 days) ──────────────
        $registrationsTrend = DB::table('users')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('role', 'student')
            ->where('created_at', '>=', now()->subDays(13))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $regTrend = [];
        for ($i = 13; $i >= 0; $i--) {
            $date       = now()->subDays($i)->format('Y-m-d');
            $regTrend[] = [
                'date'  => now()->subDays($i)->format('M d'),
                'count' => $registrationsTrend[$date]->count ?? 0,
            ];
        }

        // ── Chart: recommendations per career (top 6) ──────────────────────
        $topCareers = Recommendation::select('career_id', DB::raw('COUNT(*) as count'))
            ->with('career:id,title')
            ->groupBy('career_id')
            ->orderByDesc('count')
            ->limit(6)
            ->get()
            ->map(fn($r) => [
                'career' => $r->career?->title ?? 'Unknown',
                'count'  => $r->count,
            ]);

        // ── Recent activity ────────────────────────────────────────────────
        $recentUsers = User::where('role', 'student')
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'created_at'])
            ->map(fn($u) => [
                'type'  => 'registration',
                'text'  => "New student: {$u->name}",
                'email' => $u->email,
                'time'  => $u->created_at->diffForHumans(),
            ]);

        $recentSubmissions = DB::table('test_submissions')
            ->join('users', 'test_submissions.user_id', '=', 'users.id')
            ->join('orientation_tests', 'test_submissions.test_id', '=', 'orientation_tests.id')
            ->select(
                'users.name as user_name',
                'orientation_tests.title as test_title',
                'test_submissions.created_at'
            )
            ->latest('test_submissions.created_at')
            ->limit(5)
            ->get()
            ->map(fn($s) => [
                'type' => 'test_completed',
                'text' => "{$s->user_name} completed "{$s->test_title}"",
                'time' => \Carbon\Carbon::parse($s->created_at)->diffForHumans(),
            ]);

        $recentRecs = Recommendation::with(['user:id,name', 'career:id,title'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($r) => [
                'type' => 'recommendation',
                'text' => "AI matched {$r->user?->name} → {$r->career?->title}",
                'time' => $r->created_at->diffForHumans(),
            ]);

        $activity = collect()
            ->concat($recentUsers)
            ->concat($recentSubmissions)
            ->concat($recentRecs)
            ->sortByDesc(fn($a) => \Carbon\Carbon::parse(
                str_replace(' ago', '', $a['time'])
            ))
            ->take(10)
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_students'       => $totalStudents,
                    'active_students'      => $activeStudents,
                    'completed_tests'      => $completedTests,
                    'total_careers'        => $totalCareers,
                    'total_recommendations'=> $totalRecommendations,
                    'total_tests'          => $totalTests,
                ],
                'charts' => [
                    'submissions_trend'    => $trend,
                    'registrations_trend'  => $regTrend,
                    'top_recommended_careers' => $topCareers,
                ],
                'recent_activity' => $activity,
            ],
        ]);
    }
}

    /**
     * GET /api/admin/analytics
     * Deep analytics for the analytics page.
     */
    public function analytics()
    {
        // ── Registrations last 30 days ─────────────────────────────────────
        $regRaw = DB::table('users')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('role', 'student')
            ->where('created_at', '>=', now()->subDays(29))
            ->groupBy('date')->orderBy('date')->get()->keyBy('date');

        $reg30 = [];
        for ($i = 29; $i >= 0; $i--) {
            $date   = now()->subDays($i)->format('Y-m-d');
            $reg30[]= ['date' => now()->subDays($i)->format('M d'), 'count' => $regRaw[$date]->count ?? 0];
        }

        // ── Test submissions last 30 days ──────────────────────────────────
        $subRaw = DB::table('test_submissions')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays(29))
            ->groupBy('date')->orderBy('date')->get()->keyBy('date');

        $sub30 = [];
        for ($i = 29; $i >= 0; $i--) {
            $date   = now()->subDays($i)->format('Y-m-d');
            $sub30[]= ['date' => now()->subDays($i)->format('M d'), 'count' => $subRaw[$date]->count ?? 0];
        }

        // ── Test performance (submissions + avg score per test) ────────────
        $testPerf = DB::table('test_submissions')
            ->join('orientation_tests', 'test_submissions.test_id', '=', 'orientation_tests.id')
            ->select(
                'orientation_tests.title',
                DB::raw('COUNT(*) as submissions'),
                DB::raw('AVG(total_score) as avg_score')
            )
            ->groupBy('orientation_tests.id', 'orientation_tests.title')
            ->orderByDesc('submissions')
            ->get()
            ->map(fn($r) => [
                'test'        => $r->title,
                'submissions' => $r->submissions,
                'avg_score'   => round((float) $r->avg_score, 1),
            ]);

        // ── Top recommended careers (more data than dashboard) ─────────────
        $topCareers = Recommendation::select('career_id', DB::raw('COUNT(*) as count'), DB::raw('AVG(match_score) as avg_score'))
            ->with('career:id,title,category_id', 'career.category:id,name')
            ->groupBy('career_id')->orderByDesc('count')->limit(10)->get()
            ->map(fn($r) => [
                'career'    => $r->career?->title ?? 'Unknown',
                'category'  => $r->career?->category?->name ?? '',
                'count'     => $r->count,
                'avg_score' => round((float) $r->avg_score, 1),
            ]);

        // ── Students per education level ───────────────────────────────────
        $byEducation = DB::table('profiles')
            ->select('education_level', DB::raw('COUNT(*) as count'))
            ->whereNotNull('education_level')
            ->groupBy('education_level')
            ->orderByDesc('count')
            ->get()
            ->map(fn($r) => ['level' => $r->education_level, 'count' => $r->count]);

        // ── Students by city (top 8) ───────────────────────────────────────
        $byCity = DB::table('profiles')
            ->select('city', DB::raw('COUNT(*) as count'))
            ->whereNotNull('city')
            ->groupBy('city')
            ->orderByDesc('count')
            ->limit(8)
            ->get()
            ->map(fn($r) => ['city' => $r->city, 'count' => $r->count]);

        // ── KPI summary ────────────────────────────────────────────────────
        $totalStudents   = User::where('role', 'student')->count();
        $totalSubs       = DB::table('test_submissions')->count();
        $avgScore        = round((float) DB::table('test_submissions')->avg('total_score'), 1);
        $totalRecs       = Recommendation::count();
        $avgMatchScore   = round((float) Recommendation::avg('match_score'), 1);

        // Week-over-week registration change
        $thisWeek = User::where('role', 'student')->where('created_at', '>=', now()->subDays(7))->count();
        $lastWeek = User::where('role', 'student')
            ->whereBetween('created_at', [now()->subDays(14), now()->subDays(7)])->count();
        $wowChange = $lastWeek > 0 ? round((($thisWeek - $lastWeek) / $lastWeek) * 100, 1) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'kpi' => [
                    'total_students'  => $totalStudents,
                    'total_subs'      => $totalSubs,
                    'avg_test_score'  => $avgScore,
                    'total_recs'      => $totalRecs,
                    'avg_match_score' => $avgMatchScore,
                    'wow_students'    => $wowChange,
                ],
                'charts' => [
                    'registrations_30d' => $reg30,
                    'submissions_30d'   => $sub30,
                    'test_performance'  => $testPerf,
                    'top_careers'       => $topCareers,
                    'by_education'      => $byEducation,
                    'by_city'           => $byCity,
                ],
            ],
        ]);
    }
