import { useState } from "react";
import { Settings, Shield, Bell, Globe, Database, Save, RefreshCw, AlertTriangle } from "lucide-react";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "localization", label: "Localization", icon: Globe },
  { id: "data", label: "Data & Storage", icon: Database },
];

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
        <h3 style={sectionTitle}>Platform Configuration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Platform Name</label>
            <input
              style={inputStyle}
              value={general.platformName}
              onChange={(e) => setGeneral({ ...general, platformName: e.target.value })}
              onFocus={(e) => (e.target.style.borderColor = "var(--ms-border-active)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--ms-border-subtle)")}
            />
          </div>
          <div>
            <label style={labelStyle}>Support Email</label>
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
        <h3 style={sectionTitle}>Access Control</h3>
        <div className="space-y-4">
          {[
            { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily disable access for all non-admin users" },
            { key: "allowRegistrations", label: "Allow New Registrations", desc: "Enable or disable new user sign-ups" },
            { key: "requireEmailVerification", label: "Require Email Verification", desc: "Users must verify email before accessing the platform" },
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
            <div className="text-sm font-bold" style={{ color: "#FBBF24" }}>Maintenance Mode Active</div>
            <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
              All students will see a maintenance page. Only admin accounts can log in.
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-semibold">Two-Factor Auth for Admins</div>
              <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>Require 2FA for all administrator accounts</div>
            </div>
            <ToggleSwitch enabled={security.twoFactorAdmin} onChange={(v) => setSecurity({ ...security, twoFactorAdmin: v })} />
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-semibold">IP Whitelist</div>
              <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>Restrict admin access to specific IP addresses</div>
            </div>
            <ToggleSwitch enabled={security.ipWhitelist} onChange={(v) => setSecurity({ ...security, ipWhitelist: v })} />
          </div>
        </div>
      </div>
      <div style={cardStyle}>
        <h3 style={sectionTitle}>Session Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Session Timeout (minutes)</label>
            <input style={inputStyle} value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} type="number" />
          </div>
          <div>
            <label style={labelStyle}>Max Login Attempts</label>
            <input style={inputStyle} value={security.maxLoginAttempts} onChange={(e) => setSecurity({ ...security, maxLoginAttempts: e.target.value })} type="number" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div style={cardStyle}>
      <h3 style={sectionTitle}>Email Notification Preferences</h3>
      <div className="space-y-4">
        {[
          { key: "newUserEmail", label: "New User Registration", desc: "Receive email when a new user signs up" },
          { key: "testCompletionEmail", label: "Test Completions", desc: "Get notified when users complete orientation tests" },
          { key: "weeklyReport", label: "Weekly Analytics Report", desc: "Automated weekly summary of platform activity" },
          { key: "systemAlerts", label: "System Alerts", desc: "Critical notifications about system health and errors" },
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
      <h3 style={sectionTitle}>Language & Region</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Default Language</label>
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
          <label style={labelStyle}>Default Region</label>
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
        <h3 style={sectionTitle}>Database Management</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { label: "Export All Users", desc: "Download CSV of all users", icon: Database, color: "var(--ms-accent-sky)" },
            { label: "Export Test Results", desc: "All test responses", icon: RefreshCw, color: "#A78BFA" },
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
          <div className="text-sm font-bold" style={{ color: "#F87171" }}>Danger Zone</div>
          <div className="text-xs mt-1 mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            Irreversible actions. Proceed with extreme caution.
          </div>
          <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.25)", color: "#F87171" }}>
            Clear All Test Data
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
            Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Manage platform configuration and preferences
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
          Save Changes
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
