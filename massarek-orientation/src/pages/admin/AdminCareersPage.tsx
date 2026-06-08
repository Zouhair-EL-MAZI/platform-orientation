import { useState } from "react";
import { Briefcase, Plus, Edit, Trash2, Search, TrendingUp, Star } from "lucide-react";

const mockCareers = [
  { id: 1, title: "Software Engineer", field: "Technology", matchAvg: 88, demand: "High", salary: "$85k–$140k", active: true, students: 342 },
  { id: 2, title: "Data Scientist", field: "Technology", matchAvg: 85, demand: "Very High", salary: "$90k–$155k", active: true, students: 281 },
  { id: 3, title: "UX Designer", field: "Design", matchAvg: 79, demand: "Growing", salary: "$70k–$110k", active: true, students: 198 },
  { id: 4, title: "Civil Engineer", field: "Engineering", matchAvg: 74, demand: "Stable", salary: "$65k–$100k", active: true, students: 167 },
  { id: 5, title: "Financial Analyst", field: "Finance", matchAvg: 76, demand: "High", salary: "$72k–$120k", active: true, students: 144 },
  { id: 6, title: "Biomedical Researcher", field: "Science", matchAvg: 82, demand: "Growing", salary: "$78k–$130k", active: false, students: 96 },
  { id: 7, title: "Marketing Manager", field: "Business", matchAvg: 71, demand: "Stable", salary: "$62k–$100k", active: true, students: 134 },
  { id: 8, title: "Architect", field: "Design", matchAvg: 77, demand: "Stable", salary: "$68k–$108k", active: true, students: 112 },
];

const fields = ["All", "Technology", "Design", "Engineering", "Finance", "Science", "Business"];

const demandStyle = (demand: string) => {
  if (demand === "Very High")
    return { color: "#34D399", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.20)" };
  if (demand === "High")
    return { color: "var(--ms-accent-sky)", background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)" };
  if (demand === "Growing")
    return { color: "#FBBF24", background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.20)" };
  return { color: "hsl(var(--muted-foreground))", background: "var(--ms-bg-layer3)", border: "1px solid var(--ms-border-subtle)" };
};

const AdminCareersPage = () => {
  const [search, setSearch] = useState("");
  const [activeField, setActiveField] = useState("All");

  const filtered = mockCareers.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchField = activeField === "All" || c.field === activeField;
    return matchSearch && matchField;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase size={22} style={{ color: "var(--ms-accent-cyan)" }} />
            Careers Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            {mockCareers.length} career paths · {mockCareers.filter((c) => c.active).length} active
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
          <Plus size={14} />
          Add Career
        </button>
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
            placeholder="Search careers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {fields.map((f) => (
            <button
              key={f}
              onClick={() => setActiveField(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={
                activeField === f
                  ? { background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }
                  : { background: "transparent", border: "1px solid transparent", color: "hsl(var(--muted-foreground))" }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden card-top-glow"
        style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
                {["Career", "Field", "Avg Match", "Demand", "Salary Range", "Students", "Status", ""].map((h) => (
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
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="activity-hover"
                  style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)" }}
                      >
                        <Briefcase size={14} style={{ color: "var(--ms-accent-cyan)" }} />
                      </div>
                      <span className="font-semibold">{c.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {c.field}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 w-16 rounded-full overflow-hidden"
                        style={{ background: "var(--ms-bg-layer3)" }}
                      >
                        <div
                          className="h-full progress-fill-glow"
                          style={{ width: `${c.matchAvg}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ color: "var(--ms-accent-sky)" }}>
                        {c.matchAvg}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={demandStyle(c.demand)}>
                      {c.demand}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs font-medium">
                    {c.salary}
                  </td>
                  <td className="px-5 py-3 text-xs font-bold" style={{ color: "var(--ms-accent-sky)" }}>
                    {c.students}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={
                        c.active
                          ? { background: "rgba(52,211,153,0.10)", color: "#34D399", border: "1px solid rgba(52,211,153,0.20)" }
                          : { background: "var(--ms-bg-layer3)", color: "hsl(var(--muted-foreground))", border: "1px solid var(--ms-border-subtle)" }
                      }
                    >
                      {c.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg transition-all hover:text-[var(--ms-accent-sky)]" style={{ color: "hsl(var(--muted-foreground))" }}>
                        <Star size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg transition-all hover:text-[var(--ms-accent-cyan)]" style={{ color: "hsl(var(--muted-foreground))" }}>
                        <Edit size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg transition-all hover:text-[#F87171]" style={{ color: "hsl(var(--muted-foreground))" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="px-5 py-3 flex items-center justify-between text-xs"
          style={{ borderTop: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }}
        >
          <span>Showing {filtered.length} of {mockCareers.length} careers</span>
          <div className="flex items-center gap-2">
            <TrendingUp size={12} style={{ color: "var(--ms-accent-cyan)" }} />
            <span style={{ color: "var(--ms-accent-sky)" }}>
              Avg demand: High
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCareersPage;
