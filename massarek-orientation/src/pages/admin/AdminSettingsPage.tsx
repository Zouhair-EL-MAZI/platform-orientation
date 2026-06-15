import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import {
  Settings, Save, Eye, EyeOff, AlertCircle,
  CheckCircle, Shield, Globe, Moon, Sun, Info,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputCls = "w-full mt-1 px-3 py-2 rounded-xl bg-transparent text-sm outline-none transition-all";
const inputSty = { border: "1px solid var(--ms-border-subtle)", color: "inherit" };

function SectionCard({ title, icon: Icon, color = "var(--ms-accent-cyan)", children }: {
  title: string; icon: React.ElementType; color?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center gap-2.5 px-5 py-4"
        style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function FeedbackMsg({ msg }: { msg: { type: "success" | "error"; text: string } }) {
  const ok = msg.type === "success";
  return (
    <div className="rounded-xl px-3 py-2 flex items-center gap-2"
      style={{
        background: ok ? "rgba(52,211,153,0.08)"  : "rgba(248,113,113,0.08)",
        border:     ok ? "1px solid rgba(52,211,153,0.20)" : "1px solid rgba(248,113,113,0.18)",
      }}>
      {ok
        ? <CheckCircle size={13} style={{ color: "#34D399", flexShrink: 0 }} />
        : <AlertCircle size={13} style={{ color: "#F87171", flexShrink: 0 }} />}
      <p className="text-xs font-medium" style={{ color: ok ? "#34D399" : "#F87171" }}>{msg.text}</p>
    </div>
  );
}

// ─── Password field with eye toggle ──────────────────────────────────────────
function PwField({ label, value, onChange, disabled }: {
  label: string; value: string; onChange: (v: string) => void; disabled: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls + " pr-10"}
          style={inputSty}
          disabled={disabled}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-glow)")}
          onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminSettingsPage = () => {
  const { t }    = useTranslation();
  const { user } = useAuth();           // ← use auth hook, not localStorage directly
  const { theme } = useTheme();

  // ── Profile form ──────────────────────────────────────────────────────────
  const [name,       setName]       = useState(user?.name ?? "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg,    setNameMsg]    = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveName = async () => {
    if (!name.trim()) { setNameMsg({ type: "error", text: t("admin.users.labelName") + " is required." }); return; }
    setNameLoading(true); setNameMsg(null);
    try {
      await api.put("/student/profile", { name });
      // Keep localStorage in sync for other components that read it
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name }));
      window.dispatchEvent(new Event("storage"));
      setNameMsg({ type: "success", text: "Name updated successfully." });
    } catch (e: any) {
      setNameMsg({ type: "error", text: e?.response?.data?.message ?? "Failed to update name." });
    } finally { setNameLoading(false); }
  };

  // ── Password form ─────────────────────────────────────────────────────────
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [pwLoading,  setPwLoading]  = useState(false);
  const [pwMsg,      setPwMsg]      = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSavePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      setPwMsg({ type: "error", text: "All password fields are required." }); return;
    }
    if (newPw.length < 8) {
      setPwMsg({ type: "error", text: "Password must be at least 8 characters." }); return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: "error", text: "Passwords do not match." }); return;
    }
    setPwLoading(true); setPwMsg(null);
    try {
      await api.put("/student/profile", {
        current_password: currentPw,
        password: newPw,
        password_confirmation: confirmPw,
      });
      setPwMsg({ type: "success", text: "Password updated successfully." });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (e: any) {
      setPwMsg({ type: "error", text: e?.response?.data?.message ?? "Failed to update password." });
    } finally { setPwLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings size={18} style={{ color: "var(--ms-accent-cyan)" }} />
          {t("adminSidebar.settings")}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
          Manage your admin account and platform preferences
        </p>
      </div>

      {/* Platform info */}
      <SectionCard title="Platform Information" icon={Info} color="var(--ms-accent-sky)">
        <div className="space-y-2.5">
          {[
            ["Platform",  "Massarek Premium"],
            ["Version",   "1.0.0"],
            ["Your role", user?.role ?? "admin"],
            ["Email",     user?.email ?? "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-sm">
              <span style={{ color: "hsl(var(--muted-foreground))" }}>{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "hsl(var(--muted-foreground))" }}>Auth</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(167,139,250,0.10)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.22)" }}>
              <Shield size={9} className="inline mr-1" />Sanctum Token
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Appearance */}
      <SectionCard title="Appearance" icon={theme === "dark" ? Moon : Sun} color="#A78BFA">
        <Row label="Theme" desc="Toggle between dark and light mode">
          <ThemeToggle />
        </Row>
        <Row label="Language" desc="Change the interface language">
          <LanguageSwitcher />
        </Row>
      </SectionCard>

      {/* Update name */}
      <SectionCard title="Display Name" icon={Settings} color="var(--ms-accent-cyan)">
        <div>
          <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
            {t("admin.users.labelName")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            style={inputSty}
            disabled={nameLoading}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-glow)")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
          />
        </div>
        {nameMsg && <FeedbackMsg msg={nameMsg} />}
        <button
          onClick={handleSaveName}
          disabled={nameLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#1D4ED8,#0E7490)", boxShadow: "0 4px 14px rgba(14,116,144,0.22)" }}
        >
          <Save size={13} />
          {nameLoading ? t("admin.saving") : t("admin.save") + " Name"}
        </button>
      </SectionCard>

      {/* Change password */}
      <SectionCard title="Change Password" icon={Shield} color="#F59E0B">
        <PwField label="Current Password" value={currentPw} onChange={setCurrentPw} disabled={pwLoading} />
        <PwField label="New Password"     value={newPw}     onChange={setNewPw}     disabled={pwLoading} />
        <PwField label="Confirm Password" value={confirmPw} onChange={setConfirmPw} disabled={pwLoading} />
        {pwMsg && <FeedbackMsg msg={pwMsg} />}
        <button
          onClick={handleSavePassword}
          disabled={pwLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#D97706,#F59E0B)", boxShadow: "0 4px 14px rgba(245,158,11,0.22)" }}
        >
          <Save size={13} />
          {pwLoading ? t("admin.saving") : "Update Password"}
        </button>
      </SectionCard>

    </div>
  );
};

export default AdminSettingsPage;
