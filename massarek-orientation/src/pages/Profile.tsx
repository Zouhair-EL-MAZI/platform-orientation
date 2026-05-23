import { useState } from "react";
import { User, Mail, BookOpen, Star, Save } from "lucide-react";

const skills = ["Problem Solving", "Critical Thinking", "Communication", "Mathematics", "Creativity", "Leadership", "Teamwork", "Research"];
const interests = ["Technology", "Science", "Arts", "Business", "Medicine", "Engineering", "Education", "Law"];

const Profile = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Problem Solving", "Mathematics", "Research"]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Technology", "Science", "Engineering"]);

  const toggle = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Avatar & Info */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">S</div>
          <div>
            <h2 className="text-lg font-semibold">Student Name</h2>
            <p className="text-sm text-muted-foreground">student@example.com</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><User size={14} /> Full Name</label>
            <input defaultValue="Student Name" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><Mail size={14} /> Email</label>
            <input defaultValue="student@example.com" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5"><BookOpen size={14} /> Education Level</label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20">
              <option>High School</option>
              <option>Bachelor's</option>
              <option>Master's</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Age</label>
            <input type="number" defaultValue={18} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Star size={18} className="text-primary" /> Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <button key={s} onClick={() => toggle(s, selectedSkills, setSelectedSkills)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSkills.includes(s) ? "gradient-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><BookOpen size={18} className="text-secondary" /> Interests</h2>
        <div className="flex flex-wrap gap-2">
          {interests.map((i) => (
            <button key={i} onClick={() => toggle(i, selectedInterests, setSelectedInterests)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedInterests.includes(i) ? "gradient-ai text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>
              {i}
            </button>
          ))}
        </div>
      </div>

      <button className="gradient-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2">
        <Save size={18} /> Save Profile
      </button>
    </div>
  );
};

export default Profile;
