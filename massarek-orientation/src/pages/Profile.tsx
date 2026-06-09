import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  User, Mail, BookOpen, Star, Save, Camera,
  Phone, MapPin, FileText, Heart, Briefcase,
  CheckCircle, RefreshCw, AlertCircle, Edit2, X,
  Shield, TrendingUp, Award, ChevronRight, Sparkles,
} from "lucide-react";
import {
  getProfile, updateProfile, uploadAvatar,
  type UserProfile,
} from "@/services/studentApi";

const EDUCATION_LEVELS = [
  "Collège", "Lycée", "Bac", "Bac+2 (BTS/DUT)", "Bac+3 (Licence)",
  "Bac+4", "Bac+5 (Master)", "Bac+8 (Doctorat)",
];
const INTEREST_OPTIONS = [
  "Technologie", "Informatique", "Sciences", "Mathématiques",
  "Médecine", "Biologie", "Droit", "Économie", "Commerce",
  "Arts & Design", "Communication", "Lettres", "Éducation",
  "Environnement", "Architecture", "Sport", "Musique", "Finance",
];
const FIELD_OPTIONS = [
  "Génie Informatique", "Génie Civil", "Génie Électrique",
  "Médecine Générale", "Pharmacie", "Droit", "Économie & Gestion",
  "Marketing", "Sciences Politiques", "Architecture",
  "Design Graphique", "Journalisme", "Éducation", "Psychologie",
  "Environnement", "Finance & Comptabilité", "Biologie", "Chimie",
];

const inputBase: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 12, fontSize: 14,
  background: "var(--ms-bg-layer3, hsl(var(--muted)/0.4))",
  border: "1px solid var(--ms-border-subtle)",
  color: "hsl(var(--foreground))", outline: "none",
  transition: "border-color .2s, box-shadow .2s",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "var(--ms-border-active, #0EA5E9)";
  e.target.style.boxShadow = "0 0 0 3px var(--ms-accent-glow, rgba(14,165,233,.15))";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "var(--ms-border-subtle)";
  e.target.style.boxShadow = "none";
};

function Section({ title, icon: Icon, iconColor = "var(--ms-accent-cyan)", children }: {
  title: string; icon: any; iconColor?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
      <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: "1px solid var(--ms-border-subtle)", background: "var(--ms-bg-layer2, hsl(var(--muted)/0.2))" }}>
        <Icon size={14} style={{ color: iconColor }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function TagPicker({ label, icon: Icon, options, selected, onChange, color }: {
  label: string; icon: any; options: string[]; selected: string[];
  onChange: (v: string[]) => void; color: string;
}) {
  const toggle = (item: string) =>
    onChange(selected.includes(item) ? selected.filter(i => i !== item) : [...selected, item]);
  return (
    <div>
      <label className="text-xs font-semibold mb-2.5 flex items-center gap-1.5 uppercase tracking-wide" style={{ color: "hsl(var(--muted-foreground))" }}>
        <Icon size={12} style={{ color }} /> {label}
        <span className="ml-auto font-normal normal-case" style={{ color }}>{selected.length} selected</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={selected.includes(opt)
              ? { background: `${color}20`, border: `1.5px solid ${color}70`, color }
              : { background: "var(--ms-bg-layer3, hsl(var(--muted)/0.3))", border: "1px solid var(--ms-border-subtle)", color: "hsl(var(--muted-foreground))" }
            }>{opt}</button>
        ))}
      </div>
    </div>
  );
}

function ProfileCompletion({ profile }: { profile: UserProfile | null }) {
  if (!profile) return null;
  const fields = [
    { label: "Full name",        done: !!profile.name },
    { label: "Age",              done: !!profile.age },
    { label: "Education level",  done: !!profile.education_level },
    { label: "City",             done: !!profile.city },
    { label: "Phone",            done: !!profile.phone },
    { label: "Bio",              done: !!profile.bio },
    { label: "Interests",        done: (profile.interests?.length ?? 0) > 0 },
    { label: "Preferred fields", done: (profile.preferred_fields?.length ?? 0) > 0 },
  ];
  const done = fields.filter(f => f.done).length;
  const pct  = Math.round((done / fields.length) * 100);
  const color = pct === 100 ? "#10B981" : pct >= 60 ? "#0EA5E9" : "#F59E0B";
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
      <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--ms-border-subtle)", background: "var(--ms-bg-layer2, hsl(var(--muted)/0.2))" }}>
        <div className="flex items-center gap-2">
          <TrendingUp size={14} style={{ color }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>Profile Completion</span>
        </div>
        <span className="text-sm font-extrabold" style={{ color }}>{pct}%</span>
      </div>
      <div className="p-5">
        <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "var(--ms-bg-layer3, hsl(var(--muted)/0.4))" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: pct === 100 ? "linear-gradient(90deg,#10B981,#34D399)" : `linear-gradient(90deg,${color},${color}aa)` }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fields.map(f => (
            <div key={f.label} className="flex items-center gap-2 text-xs py-1">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={f.done
                  ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)" }
                  : { background: "var(--ms-bg-layer3, hsl(var(--muted)/0.3))", border: "1px solid var(--ms-border-subtle)" }}>
                {f.done && <CheckCircle size={9} style={{ color: "#10B981" }} />}
              </div>
              <span style={{ color: f.done ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground)/0.5)" }}>{f.label}</span>
            </div>
          ))}
        </div>
        {pct < 100 && (
          <p className="text-xs mt-3 text-center" style={{ color: "hsl(var(--muted-foreground)/0.6)" }}>
            Complete your profile to get better AI recommendations
          </p>
        )}
      </div>
    </div>
  );
}

function TagList({ items, color, emptyMsg }: { items: string[]; color: string; emptyMsg: string }) {
  if (!items?.length) return <p className="text-xs" style={{ color: "hsl(var(--muted-foreground)/0.6)" }}>{emptyMsg}</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(i => (
        <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold"
          style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}>{i}</span>
      ))}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string | number | null }) {
  return (
    <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
      <div className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "var(--ms-bg-layer3, hsl(var(--muted)/0.3))", border: "1px solid var(--ms-border-subtle)" }}>
        <Icon size={13} style={{ color: "var(--ms-accent-cyan)" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
        <p className="text-sm font-medium truncate" style={{ color: value ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground)/0.5)" }}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

const Profile = () => {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [form, setForm]       = useState<Partial<UserProfile>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const syncAuthUser = (updates: Partial<Pick<UserProfile, "name" | "avatar">>) => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const userData = JSON.parse(stored);
      const merged = {
        ...userData,
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.avatar ? { avatar: updates.avatar } : {}),
      };
      localStorage.setItem("user", JSON.stringify(merged));
      window.dispatchEvent(new Event("storage"));
      refreshUser();
    } catch {
      // ignore invalid localStorage payload
    }
  };

  useEffect(() => {
    getProfile()
      .then(r => { setProfile(r.data.data); setForm(r.data.data); })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const startEdit  = () => { setForm({ ...profile }); setEditing(true); setSuccess(false); setError(null); };
  const cancelEdit = () => { setForm({ ...profile }); setEditing(false); setError(null); };

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const res = await updateProfile({
        name: form.name, age: form.age ?? undefined,
        education_level: form.education_level ?? undefined,
        interests: form.interests, preferred_fields: form.preferred_fields,
        bio: form.bio ?? undefined, phone: form.phone ?? undefined, city: form.city ?? undefined,
      });
      setProfile(res.data.data); setForm(res.data.data);
      syncAuthUser({ name: res.data.data.name, avatar: res.data.data.avatar });
      setEditing(false); setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save profile.");
    } finally { setSaving(false); }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Image must be under 2MB."); return; }
    setAvatarUploading(true); setError(null);
    try {
      const res = await uploadAvatar(file);
      setProfile(prev => prev ? { ...prev, avatar: res.data.avatar } : prev);
      setForm(prev => ({ ...prev, avatar: res.data.avatar }));
      syncAuthUser({ avatar: res.data.avatar });
    } catch { setError("Failed to upload avatar."); }
    finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const field    = (key: keyof UserProfile) => (form[key] ?? "") as string;
  const setField = (key: keyof UserProfile, val: any) => setForm(f => ({ ...f, [key]: val }));

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-36 rounded-2xl" style={{ background: "var(--ms-bg-card)" }} />
        <div className="grid sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl" style={{ background: "var(--ms-bg-card)" }} />)}
        </div>
        <div className="h-48 rounded-2xl" style={{ background: "var(--ms-bg-card)" }} />
        <div className="h-32 rounded-2xl" style={{ background: "var(--ms-bg-card)" }} />
      </div>
    );
  }

  const avatarSrc = profile?.avatar
    ? profile.avatar.startsWith("http")
      ? profile.avatar
      : `http://127.0.0.1:8000${profile.avatar}`
    : null;
  const initials     = profile?.name?.slice(0, 2).toUpperCase() || "ST";
  const liveProfile  = editing ? { ...profile!, ...form } as UserProfile : profile;
  const completionFields = [
    !!profile?.name, !!profile?.age, !!profile?.education_level, !!profile?.city,
    !!profile?.phone, !!profile?.bio,
    (profile?.interests?.length ?? 0) > 0, (profile?.preferred_fields?.length ?? 0) > 0,
  ];
  const pct = Math.round(completionFields.filter(Boolean).length / completionFields.length * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Hero / Avatar card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#1E40AF,#0EA5E9,#22D3EE)" }} />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold overflow-hidden"
                style={{ background: "linear-gradient(135deg,#1E40AF,#0E7490)", border: "2px solid var(--ms-border-glow)" }}>
                {avatarSrc
                  ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : initials}
              </div>
              <button onClick={() => fileRef.current?.click()} disabled={avatarUploading} title="Change avatar"
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl flex items-center justify-center transition-all"
                style={{ background: "linear-gradient(135deg,#1E40AF,#0E7490)", border: "2px solid var(--ms-bg-card)", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
                {avatarUploading ? <RefreshCw size={12} className="text-white animate-spin" /> : <Camera size={12} className="text-white" />}
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold truncate">{profile?.name}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
                  {profile?.role?.toUpperCase()}
                </span>
              </div>
              <p className="text-sm mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{profile?.email}</p>
              {profile?.city && (
                <p className="text-xs flex items-center gap-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <MapPin size={11} /> {profile.city}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              {!editing ? (
                <button onClick={startEdit}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }}>
                  <Edit2 size={13} /> Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={cancelEdit}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: "var(--ms-bg-layer3, hsl(var(--muted)/0.3))", border: "1px solid var(--ms-border-subtle)" }}>
                    <X size={13} /> Cancel
                  </button>
                  <button onClick={save} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#1E40AF,#0E7490)", boxShadow: "0 4px 12px rgba(14,116,144,0.25)" }}>
                    {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
                    {saving ? "Saving…" : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5" style={{ borderTop: "1px solid var(--ms-border-subtle)" }}>
            {[
              { label: "Interests", value: profile?.interests?.length ?? 0, icon: Heart, color: "#0EA5E9" },
              { label: "Fields",    value: profile?.preferred_fields?.length ?? 0, icon: Briefcase, color: "#A78BFA" },
              { label: "Completion", value: `${pct}%`, icon: TrendingUp, color: pct === 100 ? "#10B981" : "#F59E0B" },
            ].map(s => (
              <div key={s.label} className="text-center py-2.5 rounded-xl" style={{ background: "var(--ms-bg-layer3, hsl(var(--muted)/0.3))" }}>
                <s.icon size={14} style={{ color: s.color, margin: "0 auto 4px" }} />
                <p className="text-lg font-extrabold leading-none">{s.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback banners */}
      {success && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm" style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}>
          <CheckCircle size={15} /> Profile saved successfully!
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
          <AlertCircle size={15} /> {error}
          <button onClick={() => setError(null)} className="ml-auto opacity-70 hover:opacity-100"><X size={13} /></button>
        </div>
      )}

      {/* Personal Information */}
      <Section title="Personal Information" icon={User}>
        {editing ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>Full Name</label>
              <input value={field("name")} onChange={e => setField("name", e.target.value)} placeholder="Your full name" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>Age</label>
              <input type="number" min={10} max={100} value={form.age ?? ""}
                onChange={e => setField("age", e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Your age" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>Phone</label>
              <input value={field("phone")} onChange={e => setField("phone", e.target.value)} placeholder="+212 6XX XXX XXX" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>City</label>
              <input value={field("city")} onChange={e => setField("city", e.target.value)} placeholder="Casablanca, Rabat…" style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>Education Level</label>
              <select value={field("education_level")} onChange={e => setField("education_level", e.target.value)}
                style={{ ...inputBase, color: "hsl(var(--foreground))" }} onFocus={onFocus} onBlur={onBlur}>
                <option value="">Select level…</option>
                {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center justify-between" style={{ color: "hsl(var(--muted-foreground))" }}>
                <span>Bio</span>
                <span className="font-normal normal-case" style={{ color: "hsl(var(--muted-foreground)/0.6)" }}>{field("bio").length}/1000</span>
              </label>
              <textarea value={field("bio")} onChange={e => setField("bio", e.target.value)}
                rows={3} maxLength={1000} placeholder="Tell us about yourself, your goals, and your interests…"
                style={{ ...inputBase, resize: "none" }} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>
        ) : (
          <div>
            <InfoRow icon={User}     label="Full Name"       value={profile?.name} />
            <InfoRow icon={User}     label="Age"             value={profile?.age?.toString()} />
            <InfoRow icon={Phone}    label="Phone"           value={profile?.phone} />
            <InfoRow icon={MapPin}   label="City"            value={profile?.city} />
            <InfoRow icon={BookOpen} label="Education Level" value={profile?.education_level} />
            <div className="pt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>Bio</p>
              <p className="text-sm leading-relaxed" style={{ color: profile?.bio ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground)/0.5)" }}>
                {profile?.bio || "No bio added yet. Edit your profile to add one."}
              </p>
            </div>
          </div>
        )}
      </Section>

      {/* Account Information */}
      <Section title="Account Information" icon={Shield} iconColor="#A78BFA">
        <div>
          <InfoRow icon={Mail}   label="Email Address" value={profile?.email} />
          <InfoRow icon={Shield} label="Role"          value={profile?.role?.toUpperCase()} />
          <div className="flex items-center gap-2 pt-2.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            <CheckCircle size={12} style={{ color: "#10B981" }} /> Account verified and active
          </div>
        </div>
      </Section>

      {/* Academic Profile */}
      <Section title="Academic Profile" icon={Sparkles} iconColor="#F59E0B">
        {editing ? (
          <div className="space-y-6">
            <TagPicker label="Interests" icon={Heart} options={INTEREST_OPTIONS}
              selected={form.interests ?? []} onChange={v => setField("interests", v)} color="var(--ms-accent-cyan, #0EA5E9)" />
            <TagPicker label="Preferred Fields of Study" icon={Briefcase} options={FIELD_OPTIONS}
              selected={form.preferred_fields ?? []} onChange={v => setField("preferred_fields", v)} color="#A78BFA" />
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                <Heart size={11} style={{ color: "var(--ms-accent-cyan, #0EA5E9)" }} /> Interests
              </h3>
              <TagList items={profile?.interests ?? []} color="#0EA5E9" emptyMsg="No interests added. Edit your profile to add some." />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                <Star size={11} style={{ color: "#A78BFA" }} /> Preferred Fields
              </h3>
              <TagList items={profile?.preferred_fields ?? []} color="#A78BFA" emptyMsg="No preferred fields added. Edit your profile to add some." />
            </div>
          </div>
        )}
      </Section>

      {/* Orientation Summary */}
      <Section title="Orientation Summary" icon={Award} iconColor="#10B981">
        <div className="flex flex-col items-center py-4 text-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <Award size={22} style={{ color: "#10B981" }} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">No orientation results yet</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              Complete the orientation test to see your recommended career paths here.
            </p>
          </div>
          <a href="/test"
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}>
            Take orientation test <ChevronRight size={12} />
          </a>
        </div>
      </Section>

      {/* Profile Completion */}
      <ProfileCompletion profile={liveProfile} />

    </div>
  );
};

export default Profile;
