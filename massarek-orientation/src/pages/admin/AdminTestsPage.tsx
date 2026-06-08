import { useState } from "react";
import {
  FileQuestion, Plus, Edit, Trash2, Eye, Search,
  ToggleLeft, ToggleRight, Clock, Users,
} from "lucide-react";

const mockTests = [
  {
    id: 1, title: "Personality & Interests", description: "Discover your core traits and academic preferences",
    questions: 24, duration: "15 min", completions: 1842, active: true, category: "Personality",
  },
  {
    id: 2, title: "Logical Reasoning", description: "Assess your analytical and problem-solving abilities",
    questions: 30, duration: "20 min", completions: 1203, active: true, category: "Aptitude",
  },
  {
    id: 3, title: "Creative Thinking", description: "Evaluate your creative and innovative mindset",
    questions: 18, duration: "12 min", completions: 967, active: true, category: "Skills",
  },
  {
    id: 4, title: "STEM Aptitude", description: "Measure your affinity for science and technology fields",
    questions: 35, duration: "25 min", completions: 734, active: false, category: "Aptitude",
  },
  {
    id: 5, title: "Social & Communication", description: "Evaluate interpersonal and communication strengths",
    questions: 20, duration: "14 min", completions: 589, active: true, category: "Skills",
  },
];

const categories = ["All", "Personality", "Aptitude", "Skills"];

const categoryStyle = (cat: string) => {
  if (cat === "Personality")
    return { background: "rgba(167,139,250,0.10)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.20)" };
  if (cat === "Aptitude")
    return { background: "rgba(251,191,36,0.10)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.20)" };
  return { background: "var(--ms-accent-glow)", color: "var(--ms-accent-sky)", border: "1px solid var(--ms-border-glow)" };
};

const AdminTestsPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [tests, setTests] = useState(mockTests);

  const filtered = tests.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  const toggleActive = (id: number) =>
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileQuestion size={22} style={{ color: "var(--ms-accent-cyan)" }} />
            Tests Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            {tests.length} tests · {tests.filter((t) => t.active).length} active
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #1D4ED8, #0E7490)",
            border: "1px solid rgba(34,211,238,0.25)",
            boxShadow: "0 4px 16px rgba(14,116,144,0.20)",
          }}
        >
          <Plus size={14} />
          New Test
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
          <Search size={13} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
              style={
                activeCategory === c
                  ? { background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }
                  : { background: "transparent", border: "1px solid transparent", color: "hsl(var(--muted-foreground))" }
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((test) => (
          <div
            key={test.id}
            className="rounded-2xl p-5 relative overflow-hidden card-top-glow group"
            style={{
              background: "var(--ms-bg-card)",
              border: `1px solid ${test.active ? "var(--ms-border-subtle)" : "rgba(248,113,113,0.10)"}`,
              backdropFilter: "blur(12px)",
              opacity: test.active ? 1 : 0.72,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = test.active ? "var(--ms-border-glow)" : "rgba(248,113,113,0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = test.active ? "var(--ms-border-subtle)" : "rgba(248,113,113,0.10)")
            }
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{
                background: test.active
                  ? "linear-gradient(90deg, transparent, var(--ms-accent-cyan), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(248,113,113,0.5), transparent)",
              }}
            />

            {/* Category + Status */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={categoryStyle(test.category)}>
                {test.category}
              </span>
              <button
                onClick={() => toggleActive(test.id)}
                className="transition-all"
                title={test.active ? "Deactivate" : "Activate"}
              >
                {test.active ? (
                  <ToggleRight size={20} style={{ color: "#34D399" }} />
                ) : (
                  <ToggleLeft size={20} style={{ color: "hsl(var(--muted-foreground))" }} />
                )}
              </button>
            </div>

            <h3 className="font-bold text-base mb-1">{test.title}</h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              {test.description}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              <span className="flex items-center gap-1">
                <FileQuestion size={11} style={{ color: "var(--ms-accent-cyan)" }} />
                {test.questions} questions
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} style={{ color: "var(--ms-accent-cyan)" }} />
                {test.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users size={11} style={{ color: "var(--ms-accent-cyan)" }} />
                {test.completions.toLocaleString()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: "var(--ms-accent-glow)",
                  border: "1px solid var(--ms-border-glow)",
                  color: "var(--ms-accent-sky)",
                }}
              >
                <Edit size={12} />
                Edit
              </button>
              <button
                className="p-2 rounded-xl text-xs font-bold transition-all hover:text-[var(--ms-accent-cyan)]"
                style={{
                  background: "transparent",
                  border: "1px solid var(--ms-border-subtle)",
                  color: "hsl(var(--muted-foreground))",
                }}
                title="Preview"
              >
                <Eye size={14} />
              </button>
              <button
                className="p-2 rounded-xl text-xs font-bold transition-all hover:text-[#F87171]"
                style={{
                  background: "transparent",
                  border: "1px solid var(--ms-border-subtle)",
                  color: "hsl(var(--muted-foreground))",
                }}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestsPage;
