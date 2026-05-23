import { useState } from "react";
import { Search, Briefcase, TrendingUp, DollarSign, GraduationCap } from "lucide-react";

const careers = [
  { title: "Software Engineer", field: "Technology", salary: "$95K–$180K", growth: "25%", education: "Bachelor's", desc: "Design, develop, and maintain software systems and applications." },
  { title: "Data Scientist", field: "Technology", salary: "$90K–$160K", growth: "35%", education: "Master's", desc: "Analyze complex data to help organizations make better decisions." },
  { title: "UX Designer", field: "Design", salary: "$75K–$130K", growth: "13%", education: "Bachelor's", desc: "Create intuitive and engaging user experiences for digital products." },
  { title: "Biomedical Engineer", field: "Engineering", salary: "$70K–$120K", growth: "6%", education: "Bachelor's", desc: "Develop medical devices and equipment to improve healthcare." },
  { title: "Financial Analyst", field: "Business", salary: "$65K–$110K", growth: "9%", education: "Bachelor's", desc: "Evaluate financial data and provide investment recommendations." },
  { title: "Clinical Psychologist", field: "Healthcare", salary: "$80K–$130K", growth: "6%", education: "Doctorate", desc: "Diagnose and treat mental health disorders through therapy." },
  { title: "Environmental Scientist", field: "Science", salary: "$55K–$95K", growth: "8%", education: "Bachelor's", desc: "Study the environment and develop solutions for environmental problems." },
  { title: "Product Manager", field: "Business", salary: "$100K–$170K", growth: "10%", education: "Bachelor's", desc: "Lead product strategy and development from concept to launch." },
];

const fields = ["All", ...Array.from(new Set(careers.map((c) => c.field)))];

const CareerExplorer = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = careers.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || c.field === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Briefcase size={24} className="text-primary" /> Career Explorer</h1>
        <p className="text-muted-foreground mt-1">Discover career paths that match your skills and interests.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search careers..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {fields.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "gradient-primary text-primary-foreground" : "bg-card border border-border hover:bg-accent"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.title} className="bg-card rounded-2xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-lg font-medium">{c.field}</span>
            </div>
            <h3 className="font-semibold mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{c.desc}</p>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><DollarSign size={12} /> {c.salary}</div>
              <div className="flex items-center gap-1.5"><TrendingUp size={12} /> Growth: {c.growth}</div>
              <div className="flex items-center gap-1.5"><GraduationCap size={12} /> {c.education}</div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No careers found matching your criteria.</div>
      )}
    </div>
  );
};

export default CareerExplorer;
