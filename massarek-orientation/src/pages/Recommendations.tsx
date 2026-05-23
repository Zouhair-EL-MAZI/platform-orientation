import { Sparkles, TrendingUp, Users, BookOpen } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const recommendations = [
  { field: "Computer Science", match: 92, desc: "Study algorithms, software engineering, AI, and systems design. High demand in tech industry.", skills: ["Problem Solving", "Mathematics", "Logic"], color: "hsl(234, 89%, 60%)" },
  { field: "Data Science", match: 87, desc: "Analyze large datasets, build predictive models, and extract insights for decision-making.", skills: ["Statistics", "Programming", "Analytics"], color: "hsl(270, 60%, 55%)" },
  { field: "UX Design", match: 78, desc: "Design intuitive digital experiences by combining psychology, design, and technology.", skills: ["Creativity", "Empathy", "Prototyping"], color: "hsl(300, 70%, 55%)" },
  { field: "Mechanical Engineering", match: 72, desc: "Design and build mechanical systems, from robotics to aerospace components.", skills: ["Physics", "CAD", "Problem Solving"], color: "hsl(200, 70%, 50%)" },
];

const chartData = recommendations.map((r) => ({ name: r.field, value: r.match, fill: r.color }));

const Recommendations = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles size={24} className="text-secondary" /> AI Recommendations</h1>
        <p className="text-muted-foreground mt-1">Based on your test results and profile, here are your top matches.</p>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <h2 className="font-semibold mb-4">Compatibility Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={140} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {recommendations.map((r) => (
          <div key={r.field} className="bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold">{r.field}</h3>
              <div className="gradient-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-xl">{r.match}%</div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{r.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {r.skills.map((s) => (
                <span key={s} className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-lg font-medium">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
