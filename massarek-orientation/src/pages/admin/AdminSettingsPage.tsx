import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Settings, Shield, Bell, Globe, Database, Save, RefreshCw, AlertTriangle } from "lucide-react";

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!enabled)}
    className="relative w-10 h-5 rounded-full transition-all duration-300 flex items-center"
    style={{
      background: enabled
        ? "linear-gradient(90deg, var(--ms-accent-blue), var(--ms-accent-cyan))"
        : "var(--ms-bg-layer3)",
      border: enabled ? "1px solid var(--ms-border-glow)" : "1px solid var(--ms-border-subtle)",
      boxShadow: enabled ? "0 0 10px var(--ms-accent-glow-strong)" : "none",
    }}
  >
    <div
      className="w-4 h-4 rounded-full transition-all duration-300"
      style={{
        background: "#fff",
        transform: enabled ? "translateX(22px)" : "translateX(2px)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
      }}
    />
  </button>
);

const inputStyle = {
  background: "var(--ms-bg-layer2)",
  border: "1px solid var(--ms-border-subtle)",
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 13,
  width: "100%",
  outline: "none",
  color: "inherit",
  transition: "border-color 0.2s",
};

const AdminSettingsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("general");

  const [general, setGeneral] = useState({
    platformName: "Massarek",
    supportEmail: "support@massarek.com",
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAdmin: true,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    ipWhitelist: false,
  });

  const [notifications, setNotifications] = useState({
    newUserEmail: true,
    testCompletionEmail: false,
    weeklyReport: true,
    systemAlerts: true,
  });

  const tabs = [
    { id: "general", label: t("admin.settings.tabs.general"), icon: Settings },
    { id: "security", label: t("admin.settings.tabs.security"), icon: Shield },
    { id: "notifications", label: t("admin.settings.tabs.notifications"), icon: Bell },
    { id: "localization", label: t("admin.settings.tabs.localization"), icon: Globe },
    { id: "data", label: t("admin.settings.tabs.data"), icon: Database },
  ];

  const cardStyle = {
    background: "var(--ms-bg-card)",
    border: "1px solid var(--ms-border-subtle)",
    backdropFilter: "blur(12px)" as const,
    borderRadius: 16,
    padding: "24px",
  };

  const labelStyle = { fontSize: 12, fontWeight: 700, color: "hsl(var(--muted-foreground))", marginBottom: 6, display: "block" as const };
  const sectionTitle = { fontSize: 13, fontWeight: 700, color: "var(--ms-accent-sky)", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid var(--ms-border-subtle)" };

  const renderGeneral = () => (
    <div className="space-y-6">
      <div style={cardStyle}>
        <h3 style={sectionTitle}>{t("admin.settings.general.platformConfig")}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>{t("admin.settings.general.platformName")}</label>
            <input
              style={inputStyle}
              value={general.platformName}
              onChange={(e) => setGeneral({ ...general, platformName: e.target.value })}
              onFocus={(e) => (e.target.style.borderColor = "var(--ms-border-active)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--ms-border-subtle)")}
            />
          </div>
          <div>
            <label style={labelStyle}>{t("admin.settings.general.supportEmail")}</label>
            <input
              style={inputStyle}
              value={general.supportEmail}
              onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
              onFocus={(e) => (e.target.style.borderColor = "var(--ms-border-active)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--ms-border-subtle)")}
            />
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitle}>{t("admin.settings.general.accessControl")}</h3>
        <div className="space-y-4">
          {[
            { key: "maintenanceMode", label: t("admin.settings.general.maintenanceMode"), desc: t("admin.settings.general.maintenanceModeDesc") },
            { key: "allowRegistrations", label: t("admin.settings.general.allowRegistrations"), desc: t("admin.settings.general.allowRegistrationsDesc") },
            { key: "requireEmailVerification", label: t("admin.settings.general.requireEmailVerification"), desc: t("admin.settings.general.requireEmailVerificationDesc") },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 py-1">
              <div>
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{item.desc}</div>
              </div>
              <ToggleSwitch
                enabled={general[item.key as keyof typeof general] as boolean}
                onChange={(v) => setGeneral({ ...general, [item.key]: v })}
              />
            </div>
          ))}
        </div>
      </div>

      {general.maintenanceMode && (
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.20)" }}
        >
          <AlertTriangle size={16} style={{ color: "#FBBF24", flexShrink: 0, marginTop: 2 }} />
          <div>
            <div className="text-sm font-bold" style={{ color: "#FBBF24" }}>{t("admin.settings.general.maintenanceWarningTitle")}</div>
            <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("admin.settings.general.maintenanceWarningDesc")}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div style={cardStyle}>
        <h3 style={sectionTitle}>{t("admin.settings.security.authentication")}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-semibold">{t("admin.settings.security.twoFactorAdmin")}</div>
              <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.settings.security.twoFactorAdminDesc")}</div>
            </div>
            <ToggleSwitch enabled={security.twoFactorAdmin} onChange={(v) => setSecurity({ ...security, twoFactorAdmin: v })} />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-semibold">{t("admin.settings.security.ipWhitelist")}</div>
              <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{t("admin.settings.security.ipWhitelistDesc")}</div>
            </div>
            <ToggleSwitch enabled={security.ipWhitelist} onChange={(v) => setSecurity({ ...security, ipWhitelist: v })} />
          </div>
        </div>
      </div>
      <div style={cardStyle}>
        <h3 style={sectionTitle}>{t("admin.settings.security.sessionSettings")}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>{t("admin.settings.security.sessionTimeout")}</label>
            <input style={inputStyle} value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} type="number" />
          </div>
          <div>
            <label style={labelStyle}>{t("admin.settings.security.maxLoginAttempts")}</label>
            <input style={inputStyle} value={security.maxLoginAttempts} onChange={(e) => setSecurity({ ...security, maxLoginAttempts: e.target.value })} type="number" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div style={cardStyle}>
      <h3 style={sectionTitle}>{t("admin.settings.notifications.emailPreferences")}</h3>
      <div className="space-y-4">
        {[
          { key: "newUserEmail", label: t("admin.settings.notifications.newUserEmail"), desc: t("admin.settings.notifications.newUserEmailDesc") },
          { key: "testCompletionEmail", label: t("admin.settings.notifications.testCompletionEmail"), desc: t("admin.settings.notifications.testCompletionEmailDesc") },
          { key: "weeklyReport", label: t("admin.settings.notifications.weeklyReport"), desc: t("admin.settings.notifications.weeklyReportDesc") },
          { key: "systemAlerts", label: t("admin.settings.notifications.systemAlerts"), desc: t("admin.settings.notifications.systemAlertsDesc") },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4 py-1" style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
            <div>
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{item.desc}</div>
            </div>
            <ToggleSwitch
              enabled={notifications[item.key as keyof typeof notifications]}
              onChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderLocalization = () => (
    <div style={cardStyle}>
      <h3 style={sectionTitle}>{t("admin.settings.localization.languageRegion")}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>{t("admin.settings.localization.defaultLanguage")}</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--ms-border-active)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--ms-border-subtle)")}
          >
            <option>English</option>
            <option>Français</option>
            <option>العربية</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>{t("admin.settings.localization.defaultRegion")}</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--ms-border-active)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--ms-border-subtle)")}
          >
            <option>Morocco</option>
            <option>Algeria</option>
            <option>Tunisia</option>
            <option>France</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderData = () => (
    <div className="space-y-6">
      <div style={cardStyle}>
        <h3 style={sectionTitle}>{t("admin.settings.data.databaseManagement")}</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { label: t("admin.settings.data.exportUsers"), desc: t("admin.settings.data.exportUsersDesc"), icon: Database, color: "var(--ms-accent-sky)" },
            { label: t("admin.settings.data.exportTestResults"), desc: t("admin.settings.data.exportTestResultsDesc"), icon: RefreshCw, color: "#A78BFA" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
              style={{ background: "var(--ms-bg-layer2)", border: "1px solid var(--ms-border-subtle)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-glow)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--ms-border-subtle)")}
            >
              <action.icon size={16} style={{ color: action.color }} />
              <div>
                <div className="text-sm font-semibold">{action.label}</div>
                <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{action.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}
      >
        <AlertTriangle size={16} style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }} />
        <div>
          <div className="text-sm font-bold" style={{ color: "#F87171" }}>{t("admin.settings.data.dangerZone")}</div>
          <div className="text-xs mt-1 mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            {t("admin.settings.data.dangerZoneDesc")}
          </div>
          <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.25)", color: "#F87171" }}>
            {t("admin.settings.data.clearTestData")}
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === "general") return renderGeneral();
    if (activeTab === "security") return renderSecurity();
    if (activeTab === "notifications") return renderNotifications();
    if (activeTab === "localization") return renderLocalization();
    if (activeTab === "data") return renderData();
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings size={22} style={{ color: "var(--ms-accent-cyan)" }} />
            {t("admin.settings.title")}
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            {t("admin.settings.subtitle")}
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #1D4ED8, #0E7490)",
            border: "1px solid rgba(34,211,238,0.25)",
            boxShadow: "0 4px 16px rgba(14,116,144,0.20)",
          }}
        >
          <Save size={14} />
          {t("admin.settings.save")}
        </button>
      </div>

      {/* Tabs + Content */}
      <div className="flex gap-6 flex-wrap lg:flex-nowrap">
        {/* Sidebar Tabs */}
        <div
          className="w-full lg:w-48 flex-shrink-0 rounded-2xl p-2 h-fit"
          style={{ background: "var(--ms-bg-card)", border: "1px solid var(--ms-border-subtle)", backdropFilter: "blur(12px)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-200 mb-0.5"
              style={
                activeTab === tab.id
                  ? { background: "var(--ms-accent-glow)", border: "1px solid var(--ms-border-glow)", color: "var(--ms-accent-sky)" }
                  : { background: "transparent", border: "1px solid transparent", color: "hsl(var(--muted-foreground))" }
              }
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
