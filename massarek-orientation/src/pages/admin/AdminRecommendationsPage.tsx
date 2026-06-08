import { useState } from "react";
import { Sparkles, Search, RefreshCw, CheckCircle, AlertCircle, Eye, User } from "lucide-react";

const mockRecs = [
  {
    id: 1, user: "Ahmed B.", email: "ahmed@example.com",
    recommendations: ["Computer Science", "Data Science", "Software Engineering"],
    topScore: 92, testDate: "2026-05-10", status: "Generated", reviewed: false,
  },
  {
    id: 2, user: "Sara M.", email: "sara@example.com",
    recommendations: ["UX Design", "Graphic Design", "Product Management"],
    topScore: 88, testDate: "2026-05-12", status: "Generated", reviewed: true,
  },
  {
    id: 3, user: "Youssef K.", email: "youssef@example.com",
    recommendations: ["Civil Engineering", "Architecture"],
    topScore: 74, testDate: "2026-05-14", status: "Pending", reviewed: false,
  },
  {
    id: 4, user: "Fatima Z.", email: "fatima@example.com",
    recommendations: ["Medicine", "Biomedical Research", "Pharmacy"],
    topScore: 90, testDate: "2026-05-15", status: "Generated", reviewed: true,
  },
  {
    id: 5, user: "Omar H.", email: "omar@example.com",
    recommendations: ["Finance", "Accounting", "Economics"],
    topScore: 81, testDate: "2026-05-18", status: "Generated", reviewed: false,
  },
  {
    id: 6, user: "Nadia C.", email: "nadia@example.com",
    recommendations: ["Marketing", "Communication", "Business Admin"],
    topScore: 77, testDate: "2026-05-20", status: "Pending", reviewed: false,
  },
];

const statusStyle = (s: string) => {
  if (s === "Generated")
    return { background: "rgba(52,211,153,0.12)", color: "#34D399", border: "1px solid rgba(52,211,153,0.24)" };
  return { background: "rgba(251,191,36,0.20)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.30)" };
};

const AdminRecommendationsPage = () => {
  const [search, setSearch] = useState("");
  const [filterReviewed, setFilterReviewed] = useState<"all" | "reviewed" | "unreviewed">("all");

  const filtered = mockRecs.filter((r) => {
    const matchSearch =
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchReview =
      filterReviewed === "all" ||
      (filterReviewed === "reviewed" && r.reviewed) ||
      (filterReviewed === "unreviewed" && !r.reviewed);
    return matchSearch && matchReview;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles size={22} style={{ color: "var(--ms-accent-cyan)" }} />
            Recommendations
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Review and manage student recommendations
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #1D4ED8, #0E7490)",
            border: "1px solid rgba(34,211,238,0.25)",
            boxShadow: "0 4px 16px rgba(14,116,144,0.20)",
          }}
        >
          <RefreshCw size={14} />
          Regenerate All
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Rec. Generated", value: mockRecs.filter(r => r.status === "Generated").length, color: "#34D399", glow: "rgba(52,211,153,0.15)" },
          { label: "Pending Generation", value: mockRecs.filter(r => r.status === "Pending").length, color: "#FBBF24", glow: "rgba(251,191,36,0.15)" },
          { label: "Admin Reviewed", value: mockRecs.filter(r => r.reviewed).length, color: "var(--ms-accent-cyan)", glow: "rgba(34,211,238,0.15)" },
          { label: "Avg Top Score", value: `${Math.round(mockRecs.reduce((a, b) => a + b.topScore, 0) / mockRecs.length)}%`, color: "var(--ms-accent-sky)", glow: "rgba(14,165,233,0.15)" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 card-top-glow"
            style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }}
            />
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div
        className="rounded-2xl p-4 flex flex-wrap gap-3 items-center"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
      >
        <div
          className="relative flex items-center gap-2 flex-1 min-w-[200px] max-w-sm rounded-xl h-9 px-3"
          style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}
        >
          <Search size={13} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "reviewed", "unreviewed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterReviewed(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize"
              style={
                filterReviewed === f
                  ? { background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }
                  : { background: "transparent", border: "1px solid transparent", color: "hsl(var(--muted-foreground))" }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Table */}
      <div
        className="rounded-2xl overflow-hidden card-top-glow"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                {["Student", "Top Recommendations", "Top Score", "Test Date", "Status", "Reviewed", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--ms-accent-cyan)", opacity: 0.65 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="activity-hover"
                  style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)" }}
                      >
                        {r.user.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-xs">{r.user}</div>
                        <div className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.recommendations.slice(0, 2).map((rec) => (
                        <span
                          key={rec}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "var(--ms-accent-glow)", color: "var(--ms-accent-sky)", border: "1px solid var(--ms-border-glow)" }}
                        >
                          {rec}
                        </span>
                      ))}
                      {r.recommendations.length > 2 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: "hsl(var(--muted-foreground))" }}>
                          +{r.recommendations.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 rounded-full overflow-hidden" style={{ background: "var(--ms-bg-layer3)" }}>
                        <div className="h-full progress-fill-glow" style={{ width: `${r.topScore}%` }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: "var(--ms-accent-sky)" }}>{r.topScore}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{r.testDate}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={statusStyle(r.status)}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    {r.reviewed ? (
                      <CheckCircle size={16} style={{ color: "#34D399" }} />
                    ) : (
                      <AlertCircle size={16} style={{ color: "#FBBF24" }} />
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:text-[var(--ms-accent-cyan)]" style={{ color: "hsl(var(--muted-foreground))" }} title="View">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:text-[var(--ms-accent-sky)]" style={{ color: "hsl(var(--muted-foreground))" }} title="View User">
                        <User size={14} />
                      </button>
                    </div>
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

export default AdminRecommendationsPage;
