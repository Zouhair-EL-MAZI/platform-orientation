import { BarChart3, TrendingUp, Users, FileQuestion, Briefcase, Sparkles, ArrowUpRight } from "lucide-react";

const weeklySignups = [12, 19, 8, 24, 31, 18, 27];
const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const topCareers = [
  { name: "Software Engineering", count: 342, pct: 88 },
  { name: "Data Science", count: 281, pct: 72 },
  { name: "UX Design", count: 198, pct: 51 },
  { name: "Civil Engineering", count: 167, pct: 43 },
  { name: "Financial Analyst", count: 144, pct: 37 },
];

const testCompletionRate = [
  { test: "Personality & Interests", completions: 1842, rate: 91 },
  { test: "Logical Reasoning", completions: 1203, rate: 79 },
  { test: "Creative Thinking", completions: 967, rate: 68 },
  { test: "STEM Aptitude", completions: 734, rate: 58 },
  { test: "Social & Communication", completions: 589, rate: 53 },
];

const kpiCards = [
  { label: "Total Users", value: "1,284", change: "+12%", icon: Users, color: "var(--ms-accent-cyan)", glow: "rgba(34,211,238,0.15)" },
  { label: "Tests Completed", value: "5,335", change: "+8%", icon: FileQuestion, color: "var(--ms-accent-sky)", glow: "rgba(14,165,233,0.15)" },
  { label: "Avg. Match Score", value: "84%", change: "+3%", icon: TrendingUp, color: "#34D399", glow: "rgba(52,211,153,0.15)" },
  { label: "Recs. Generated", value: "3,129", change: "+20%", icon: Sparkles, color: "#A78BFA", glow: "rgba(167,139,250,0.15)" },
];

const maxSignup = Math.max(...weeklySignups);

const AdminAnalyticsPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 size={22} style={{ color: "var(--ms-accent-cyan)" }} />
          Analytics & Statistics
        </h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Platform performance overview · Last 30 days
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl p-5 card-top-glow relative overflow-hidden"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, transparent, ${k.color}, transparent)` }}
            />
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: k.glow, border: `1px solid ${k.color}22` }}
              >
                <k.icon size={17} style={{ color: k.color }} />
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: "rgba(52,211,153,0.10)", color: "#34D399", border: "1px solid rgba(52,211,153,0.20)" }}
              >
                <ArrowUpRight size={10} />
                {k.change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-0.5">{k.value}</div>
            <div className="text-xs font-medium" style={{ color: k.color, opacity: 0.7 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Signups Bar Chart */}
        <div
          className="rounded-2xl p-6 card-top-glow"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
        >
          <h2 className="font-bold mb-5 flex items-center gap-2 text-base">
            <Users size={16} style={{ color: "var(--ms-accent-cyan)" }} />
            Weekly Signups
          </h2>
          <div className="flex items-end gap-2 h-32">
            {weeklySignups.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold" style={{ color: "var(--ms-accent-sky)" }}>{val}</span>
                <div
                  className="w-full rounded-t-md transition-all duration-500 relative overflow-hidden"
                  style={{
                    height: `${(val / maxSignup) * 100}px`,
                    background: "linear-gradient(180deg, var(--ms-accent-cyan), var(--ms-accent-blue))",
                    boxShadow: "0 0 10px var(--ms-accent-glow-strong)",
                    minHeight: 6,
                  }}
                >
                  {/* shimmer effect */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                      animation: "shimmer 2.5s ease-in-out infinite",
                    }}
                  />
                </div>
                <span className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{weekLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Careers */}
        <div
          className="rounded-2xl p-6 card-top-glow"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
        >
          <h2 className="font-bold mb-5 flex items-center gap-2 text-base">
            <Briefcase size={16} style={{ color: "var(--ms-accent-cyan)" }} />
            Top Career Paths
          </h2>
          <div className="space-y-4">
            {topCareers.map((c, i) => (
              <div key={c.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold"
                      style={{ background: "var(--ms-accent-glow)", color: "var(--ms-accent-sky)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <span className="font-bold" style={{ color: "var(--ms-accent-sky)" }}>
                    {c.count}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" }}
                >
                  <div
                    className="h-full progress-fill-glow"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Completion Rates */}
      <div
        className="rounded-2xl overflow-hidden card-top-glow"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
      >
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
          <h2 className="font-bold flex items-center gap-2 text-base">
            <FileQuestion size={16} style={{ color: "var(--ms-accent-cyan)" }} />
            Test Completion Rates
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                {["Test", "Completions", "Completion Rate", "Trend"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {testCompletionRate.map((t) => (
                <tr key={t.test} className="activity-hover" style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                  <td className="px-6 py-3 font-semibold text-sm">{t.test}</td>
                  <td className="px-6 py-3 font-bold text-sm" style={{ color: "var(--ms-accent-sky)" }}>
                    {t.completions.toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 rounded-full overflow-hidden" style={{ background: "var(--ms-bg-layer3)" }}>
                        <div className="h-full progress-fill-glow" style={{ width: `${t.rate}%` }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: "var(--ms-accent-sky)" }}>{t.rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs font-bold flex items-center gap-1" style={{ color: "#34D399" }}>
                      <TrendingUp size={12} />
                      +{Math.floor(Math.random() * 8) + 2}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
