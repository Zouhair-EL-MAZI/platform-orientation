import { Users, FileQuestion, Briefcase, TrendingUp, MoreHorizontal } from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,284", change: "+12%", icon: Users },
  { label: "Tests Taken", value: "3,542", change: "+8%", icon: FileQuestion },
  { label: "Careers Explored", value: "856", change: "+15%", icon: Briefcase },
  { label: "Avg. Match Score", value: "84%", change: "+3%", icon: TrendingUp },
];

const users = [
  { name: "Ahmed B.", email: "ahmed@example.com", tests: 3, status: "Active" },
  { name: "Sara M.", email: "sara@example.com", tests: 5, status: "Active" },
  { name: "Youssef K.", email: "youssef@example.com", tests: 1, status: "Inactive" },
  { name: "Fatima Z.", email: "fatima@example.com", tests: 4, status: "Active" },
  { name: "Omar H.", email: "omar@example.com", tests: 2, status: "Active" },
];

const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={20} className="text-primary" />
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 font-medium text-muted-foreground">Name</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Email</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Tests</th>
                <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-3 font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-3 font-medium">{u.name}</td>
                  <td className="px-6 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-3">{u.tests}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.status === "Active" ? "bg-green-50 text-green-600" : "bg-muted text-muted-foreground"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button className="p-1 hover:bg-muted rounded-lg transition-colors"><MoreHorizontal size={16} /></button>
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

export default AdminDashboard;
