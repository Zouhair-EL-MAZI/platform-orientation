import { Link } from "react-router-dom";
import { Sparkles, FileQuestion, Briefcase, MessageSquare, TrendingUp, BookOpen, Clock, CheckCircle } from "lucide-react";

const quickActions = [
  { icon: FileQuestion, title: "Take Test", desc: "Start orientation test", to: "/test", gradient: true },
  { icon: Sparkles, title: "AI Results", desc: "View recommendations", to: "/recommendations", gradient: false },
  { icon: Briefcase, title: "Careers", desc: "Explore career paths", to: "/careers", gradient: false },
  { icon: MessageSquare, title: "Chatbot", desc: "Ask AI assistant", to: "/chatbot", gradient: false },
];

const recommendations = [
  { field: "Computer Science", match: 92, trend: "High demand" },
  { field: "Data Science", match: 87, trend: "Growing" },
  { field: "UX Design", match: 78, trend: "Emerging" },
];

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="gradient-primary rounded-2xl p-6 md:p-8 text-primary-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Student! 👋</h1>
        <p className="opacity-90">Continue your orientation journey and discover the perfect path for your future.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((a) => (
          <Link key={a.title} to={a.to} className={`rounded-2xl p-5 border border-border shadow-card hover:shadow-elevated transition-all group ${a.gradient ? "gradient-primary text-primary-foreground" : "bg-card"}`}>
            <a.icon size={22} className={`mb-3 ${a.gradient ? "" : "text-primary"} group-hover:scale-110 transition-transform`} />
            <div className="font-semibold text-sm">{a.title}</div>
            <div className={`text-xs mt-0.5 ${a.gradient ? "opacity-80" : "text-muted-foreground"}`}>{a.desc}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress */}
        <div className="lg:col-span-1 bg-card rounded-2xl border border-border shadow-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-primary" /> Your Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Profile completion</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Tests completed</span>
                <span className="font-medium">2/5</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full" style={{ width: "40%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Career exploration</span>
                <span className="font-medium">60%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Preview */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Sparkles size={18} className="text-secondary" /> AI Recommendations</h2>
          <div className="space-y-3">
            {recommendations.map((r) => (
              <div key={r.field} className="flex items-center gap-4 p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {r.match}%
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{r.field}</div>
                  <div className="text-xs text-muted-foreground">{r.trend}</div>
                </div>
                <Link to="/recommendations" className="text-xs text-primary font-medium hover:underline">View →</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Clock size={18} className="text-muted-foreground" /> Recent Activity</h2>
        <div className="space-y-3">
          {[
            { icon: CheckCircle, text: "Completed Personality Test", time: "2 hours ago", color: "text-green-500" },
            { icon: BookOpen, text: "Explored Computer Science career path", time: "Yesterday", color: "text-primary" },
            { icon: Sparkles, text: "New AI recommendations available", time: "2 days ago", color: "text-secondary" },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <a.icon size={16} className={a.color} />
              <span className="flex-1">{a.text}</span>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
