import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Settings, Save, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import api from "@/lib/api";

const inputClass = "w-full mt-1 px-3 py-2 rounded-lg bg-transparent text-sm outline-none transition-all";
const inputStyle = { border: "1px solid var(--ms-border-subtle)", color: "inherit" };

const AdminSettingsPage = () => {
  const { t } = useTranslation();
  const stored = JSON.parse(localStorage.getItem("user") || "{}");

  const [name, setName] = useState(stored.name ?? "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveName = async () => {
    if (!name.trim()) { setNameMsg({ type: "error", text: t("admin.profile.nameRequired") }); return; }
    setNameLoading(true);
    setNameMsg(null);
    try {
      await api.put("/student/profile", { name });
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...user, name }));
      setNameMsg({ type: "success", text: t("admin.profile.nameUpdatedSuccess") });
    } catch (e: any) {
      setNameMsg({ type: "error", text: e?.response?.data?.message ?? t("admin.profile.failedUpdateName") });
    } finally { setNameLoading(false); }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwMsg({ type: "error", text: t("admin.profile.allFieldsRequired") }); return;
    }
    if (newPassword.length < 8) {
      setPwMsg({ type: "error", text: t("admin.profile.passwordMinLength") }); return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: "error", text: t("admin.profile.passwordMismatch") }); return;
    }
    setPwLoading(true);
    setPwMsg(null);
    try {
      await api.put("/student/profile", { current_password: currentPassword, password: newPassword, password_confirmation: confirmPassword });
      setPwMsg({ type: "success", text: t("admin.profile.passwordUpdatedSuccess") });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e: any) {
      setPwMsg({ type: "error", text: e?.response?.data?.message ?? t("admin.profile.failedUpdatePassword") });
    } finally { setPwLoading(false); }
  };

  const cardStyle = { background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" };
  const labelStyle = { color: "var(--ms-accent-cyan)", opacity: 0.65 };

  const Msg = ({ msg }: { msg: { type: "success" | "error"; text: string } }) => (
    <div className="rounded-lg p-3 flex items-center gap-2 mt-3"
      style={msg.type === "success"
        ? { background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.20)" }
        : { background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
      {msg.type === "success"
        ? <CheckCircle size={14} style={{ color: "#34D399", flexShrink: 0 }} />
        : <AlertCircle size={14} style={{ color: "#F87171", flexShrink: 0 }} />}
      <p className="text-xs font-medium" style={{ color: msg.type === "success" ? "#34D399" : "#F87171" }}>{msg.text}</p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings size={22} style={{ color: "var(--ms-accent-cyan)" }} />
          {t("admin.profile.title")}
        </h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.profile.subtitle")}</p>
      </div>

      {/* Change Name */}
      <div className="rounded-2xl p-6 space-y-4" style={cardStyle}>
        <h2 className="text-sm font-bold" style={{ color: "var(--ms-accent-sky)" }}>{t("admin.profile.changeName")}</h2>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider" style={labelStyle}>{t("admin.profile.name")}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className={inputClass} style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
            disabled={nameLoading} />
        </div>
        {nameMsg && <Msg msg={nameMsg} />}
        <button onClick={handleSaveName} disabled={nameLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)", border: "1px solid rgba(34,211,238,0.25)" }}>
          <Save size={12} />{nameLoading ? t("admin.profile.saving") : t("admin.profile.saveChanges")}
        </button>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl p-6 space-y-4" style={cardStyle}>
        <h2 className="text-sm font-bold" style={{ color: "var(--ms-accent-sky)" }}>{t("admin.profile.changePassword")}</h2>
        {[
          { label: t("admin.profile.currentPassword"), val: currentPassword, setter: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent((v) => !v) },
          { label: t("admin.profile.newPassword"), val: newPassword, setter: setNewPassword, show: showNew, toggle: () => setShowNew((v) => !v) },
          { label: t("admin.profile.confirmPassword"), val: confirmPassword, setter: setConfirmPassword, show: showNew, toggle: () => setShowNew((v) => !v) },
        ].map(({ label, val, setter, show, toggle }) => (
          <div key={label}>
            <label className="text-xs font-bold uppercase tracking-wider" style={labelStyle}>{label}</label>
            <div className="relative">
              <input type={show ? "text" : "password"} value={val} onChange={(e) => setter(e.target.value)}
                className={inputClass + " pr-9"} style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-active)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
                disabled={pwLoading} />
              <button type="button" onClick={toggle} className="absolute right-2 top-1/2 -translate-y-1/2 p-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                {show ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
        ))}
        {pwMsg && <Msg msg={pwMsg} />}
        <button onClick={handleSavePassword} disabled={pwLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)", border: "1px solid rgba(34,211,238,0.25)" }}>
          <Save size={12} />{pwLoading ? t("admin.profile.saving") : t("admin.profile.saveChanges")}
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
