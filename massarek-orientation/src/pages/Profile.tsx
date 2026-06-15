import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import {
  User, Mail, BookOpen, Star, Save, Camera,
  Phone, MapPin, FileText, Heart, Briefcase,
  CheckCircle, RefreshCw, AlertCircle, Edit2, X,
  Shield, TrendingUp, ChevronRight, Sparkles, ChevronDown,
} from "lucide-react";
import {
  getProfile, updateProfile, uploadAvatar,
  type UserProfile,
} from "@/services/studentApi";

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
  const { t } = useTranslation();
  if (!profile) return null;
  const fields = [
    { label: t("profile.labels.fullName"), done: !!profile.name },
    { label: t("profile.labels.age"), done: !!profile.age },
    { label: t("profile.labels.educationLevel"), done: !!profile.education_level },
    { label: t("profile.labels.city"), done: !!profile.city },
    { label: t("profile.labels.phone"), done: !!profile.phone },
    { label: t("profile.labels.bio"), done: !!profile.bio },
    { label: t("profile.quickStats.interests"), done: (profile.interests?.length ?? 0) > 0 },
    { label: t("profile.titles.academicProfile"), done: (profile.preferred_fields?.length ?? 0) > 0 },
  ];
  const done = fields.filter(f => f.done).length;
  const pct  = Math.round((done / fields.length) * 100);
  const color = pct === 100 ? "#10B981" : pct >= 60 ? "#0EA5E9" : "#F59E0B";
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)" }}>
      <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--ms-border-subtle)", background: "var(--ms-bg-layer2, hsl(var(--muted)/0.2))" }}>
        <div className="flex items-center gap-2">
          <TrendingUp size={14} style={{ color }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>{t("profile.completion.title")}</span>
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
            {t("profile.completion.incompleteMessage")}
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
  const { t } = useTranslation();
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

  const educationLevels = t("profile.educationLevels", { returnObjects: true }) as string[];
  const interestOptions = t("profile.interestOptions", { returnObjects: true }) as string[];
  const fieldOptions = t("profile.fieldOptions", { returnObjects: true }) as string[];

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
      .catch(() => setError(t("profile.errors.loadFailed")))
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
      setError(e?.response?.data?.message || t("profile.errors.saveFailed"));
    } finally { setSaving(false); }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError(t("profile.errors.avatarSize")); return; }
    setAvatarUploading(true); setError(null);
    try {
      const res = await uploadAvatar(file);
      setProfile(prev => prev ? { ...prev, avatar: res.data.avatar } : prev);
      setForm(prev => ({ ...prev, avatar: res.data.avatar }));
      syncAuthUser({ avatar: res.data.avatar });
    } catch { setError(t("profile.errors.avatarUpload")); }
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
              <button onClick={() => fileRef.current?.click()} disabled={avatarUploading} title={t("profile.buttons.changeAvatar")}
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
                  <Edit2 size={13} /> {t("profile.buttons.editProfile")}
                </button>
              ) : (
                <>
                  <button onClick={cancelEdit}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: "var(--ms-bg-layer3, hsl(var(--muted)/0.3))", border: "1px solid var(--ms-border-subtle)" }}>
                    <X size={13} /> {t("profile.buttons.cancel")}
                  </button>
                  <button onClick={save} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#1E40AF,#0E7490)", boxShadow: "0 4px 12px rgba(14,116,144,0.25)" }}>
                    {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
                    {saving ? t("profile.buttons.saving") : t("profile.buttons.save")}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5" style={{ borderTop: "1px solid var(--ms-border-subtle)" }}>
            {[
              { label: t("profile.quickStats.interests"), value: profile?.interests?.length ?? 0, icon: Heart, color: "#0EA5E9" },
              { label: t("profile.quickStats.fields"),    value: profile?.preferred_fields?.length ?? 0, icon: Briefcase, color: "#A78BFA" },
              { label: t("profile.quickStats.completion"), value: `${pct}%`, icon: TrendingUp, color: pct === 100 ? "#10B981" : "#F59E0B" },
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
          <CheckCircle size={15} /> {t("profile.success.saved")}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
          <AlertCircle size={15} /> {error}
          <button onClick={() => setError(null)} className="ml-auto opacity-70 hover:opacity-100"><X size={13} /></button>
        </div>
      )}

      {/* Personal Information */}
      <Section title={t("profile.titles.personalInformation")} icon={User}>
        {editing ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>{t("profile.labels.fullName")}</label>
              <input value={field("name")} onChange={e => setField("name", e.target.value)} placeholder={t("profile.placeholders.fullName")} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>{t("profile.labels.age")}</label>
              <input type="number" min={10} max={100} value={form.age ?? ""}
                onChange={e => setField("age", e.target.value ? parseInt(e.target.value) : null)}
                placeholder={t("profile.placeholders.age")} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>{t("profile.labels.phone")}</label>
              <input value={field("phone")} onChange={e => setField("phone", e.target.value)} placeholder={t("profile.placeholders.phone")} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>{t("profile.labels.city")}</label>
              <input value={field("city")} onChange={e => setField("city", e.target.value)} placeholder={t("profile.placeholders.city")} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>{t("profile.labels.educationLevel")}</label>
              <div className="relative w-full">
                <select value={field("education_level")} onChange={e => setField("education_level", e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-[#131c35] text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm appearance-none pr-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  style={inputBase} onFocus={onFocus} onBlur={onBlur}>
                  <option className="bg-white dark:bg-[#131c35]" value="">{t("profile.placeholders.selectEducationLevel")}</option>
                  {educationLevels.map(l => <option key={l} className="bg-white dark:bg-[#131c35]" value={l}>{l}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center justify-between" style={{ color: "hsl(var(--muted-foreground))" }}>
                <span>{t("profile.labels.bio")}</span>
                <span className="font-normal normal-case" style={{ color: "hsl(var(--muted-foreground)/0.6)" }}>{field("bio").length}/1000</span>
              </label>
              <textarea value={field("bio")} onChange={e => setField("bio", e.target.value)}
                rows={3} maxLength={1000} placeholder={t("profile.placeholders.bio")}
                style={{ ...inputBase, resize: "none" }} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>
        ) : (
          <div>
            <InfoRow icon={User}     label={t("profile.labels.fullName")}       value={profile?.name} />
            <InfoRow icon={User}     label={t("profile.labels.age")}             value={profile?.age?.toString()} />
            <InfoRow icon={Phone}    label={t("profile.labels.phone")}           value={profile?.phone} />
            <InfoRow icon={MapPin}   label={t("profile.labels.city")}            value={profile?.city} />
            <InfoRow icon={BookOpen} label={t("profile.labels.educationLevel")} value={profile?.education_level} />
            <div className="pt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>{t("profile.labels.bio")}</p>
              <p className="text-sm leading-relaxed" style={{ color: profile?.bio ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground)/0.5)" }}>
                {profile?.bio || t("profile.emptyStates.bio")}
              </p>
            </div>
          </div>
        )}
      </Section>

      {/* Account Information */}
      <Section title={t("profile.titles.accountInformation")} icon={Shield} iconColor="#A78BFA">
        <div>
          <InfoRow icon={Mail}   label={t("profile.labels.emailAddress")} value={profile?.email} />
          <InfoRow icon={Shield} label={t("profile.labels.role")}          value={profile?.role?.toUpperCase()} />
          <div className="flex items-center gap-2 pt-2.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            <CheckCircle size={12} style={{ color: "#10B981" }} /> {t("profile.status.verified")}
          </div>
        </div>
      </Section>

      {/* Academic Profile */}
      <Section title={t("profile.titles.academicProfile")} icon={Sparkles} iconColor="#F59E0B">
        {editing ? (
          <div className="space-y-6">
            <TagPicker label={t("profile.quickStats.interests")} icon={Heart} options={interestOptions}
              selected={form.interests ?? []} onChange={v => setField("interests", v)} color="var(--ms-accent-cyan, #0EA5E9)" />
            <TagPicker label={t("profile.labels.preferredFields")} icon={Briefcase} options={fieldOptions}
              selected={form.preferred_fields ?? []} onChange={v => setField("preferred_fields", v)} color="#A78BFA" />
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                <Heart size={11} style={{ color: "var(--ms-accent-cyan, #0EA5E9)" }} /> {t("profile.quickStats.interests")}
              </h3>
              <TagList items={profile?.interests ?? []} color="#0EA5E9" emptyMsg={t("profile.emptyStates.interests")} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                <Star size={11} style={{ color: "#A78BFA" }} /> {t("profile.labels.preferredFields")}
              </h3>
              <TagList items={profile?.preferred_fields ?? []} color="#A78BFA" emptyMsg={t("profile.emptyStates.preferredFields")} />
            </div>
          </div>
        )}
      </Section>

      {/* Profile Completion */}
      <ProfileCompletion profile={liveProfile} />

    </div>
  );
};

export default Profile;
