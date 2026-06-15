import {
  LayoutDashboard, Users, FileQuestion, Briefcase,
  Sparkles, Settings, LogOut, Shield, BarChart3, ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import MassarekLogo from "@/components/MassarekLogo";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const { t, i18n } = useTranslation();
  const { state }   = useSidebar();
  const collapsed   = state === "collapsed";
  const location    = useLocation();
  const navigate    = useNavigate();
  const { role }    = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isRtl    = i18n.dir() === "rtl";
  const iconGap  = collapsed ? "" : (isRtl ? "ml-2" : "mr-2");

  // ── Nav items ─────────────────────────────────────────────────────────────

  const mainItems = [
    { title: t("adminSidebar.dashboard"),       url: "/admin/dashboard",       icon: LayoutDashboard, roles: ["admin", "counselor", "moderator"] },
    { title: t("adminSidebar.users"),           url: "/admin/users",           icon: Users,           roles: ["admin", "moderator"]              },
    { title: t("adminSidebar.tests"),           url: "/admin/tests",           icon: FileQuestion,    roles: ["admin", "counselor"]              },
    { title: t("adminSidebar.careers"),         url: "/admin/careers",         icon: Briefcase,       roles: ["admin"]                           },
    { title: t("adminSidebar.recommendations"), url: "/admin/recommendations", icon: Sparkles,        roles: ["admin", "counselor"]              },
    { title: t("adminSidebar.analytics") || "Analytics", url: "/admin/analytics", icon: BarChart3, roles: ["admin"]                            },
  ];

  const visibleMainItems = mainItems.filter(
    item => !item.roles || !role || item.roles.includes(role)
  );

  const activeStyle: React.CSSProperties = {
    color: "var(--ms-accent-sky)",
    background: "var(--ms-accent-glow)",
    border: "1px solid var(--ms-border-glow)",
    borderRadius: "8px",
  };

  const hoverCls = "transition-all duration-200 rounded-lg border border-transparent hover:border-[var(--ms-border-subtle)] hover:bg-[var(--ms-accent-glow)] hover:text-[var(--ms-accent-sky)]";

  const renderLink = (item: { title: string; url: string; icon: React.ElementType }) => {
    const Icon = item.icon;
    return (
      <NavLink
        to={item.url}
        end
        title={item.title}
        className={`flex items-center ${collapsed ? "justify-center" : ""} px-3 py-2 text-sm font-semibold text-muted-foreground relative ${hoverCls}`}
        activeClassName=""
        style={isActive(item.url) ? activeStyle : {}}
      >
        {isActive(item.url) && !collapsed && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full"
            style={{ background: "var(--ms-accent-cyan)", boxShadow: "0 0 8px var(--ms-accent-cyan)" }}
          />
        )}
        <Icon className={`h-4 w-4 flex-shrink-0 ${iconGap}`} />
        {!collapsed && <span>{item.title}</span>}
      </NavLink>
    );
  };

  return (
    <Sidebar
      side={isRtl ? "right" : "left"}
      collapsible="icon"
      style={{
        "--sidebar-width": "15rem",
        background: "var(--ms-bg-sidebar)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid var(--ms-border-subtle)",
      } as React.CSSProperties}
    >
      {/* Header */}
      <SidebarHeader className="p-4" style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}>
        <div className={collapsed ? "flex justify-center" : "flex items-center gap-2.5"}>
          <MassarekLogo collapsed={collapsed} />
          {!collapsed && (
            <span
              className="text-[9px] font-bold uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-md"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.20), rgba(34,211,238,0.15))",
                border: "1px solid var(--ms-border-glow)",
                color: "var(--ms-accent-sky)",
              }}
            >
              Admin
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Admin badge when collapsed */}
        {collapsed && (
          <div className="flex justify-center py-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1D4ED8, #0E7490)", border: "1px solid var(--ms-border-glow)" }}
            >
              <Shield size={12} style={{ color: "var(--ms-accent-sky)" }} />
            </div>
          </div>
        )}

        {/* Management group */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel
              className="text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ color: "var(--ms-accent-cyan)", opacity: 0.7 }}
            >
              {t("adminSidebar.management")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMainItems.map(item => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    {renderLink(item)}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System group */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel
              className="text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ color: "var(--ms-accent-cyan)", opacity: 0.7 }}
            >
              {t("adminSidebar.system")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>

              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/settings")}>
                  {renderLink({ title: t("adminSidebar.settings"), url: "/admin/settings", icon: Settings })}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Back to Student App */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    type="button"
                    title={t("adminSidebar.viewStudentApp") || "Student App"}
                    onClick={() => navigate("/dashboard")}
                    className={`flex w-full items-center ${collapsed ? "justify-center" : ""} gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold ${hoverCls}`}
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    <ExternalLink className={`h-4 w-4 flex-shrink-0 ${iconGap}`} />
                    {!collapsed && <span>{t("adminSidebar.viewStudentApp") || "Student App"}</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Sign Out */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    type="button"
                    title={t("adminSidebar.signOut")}
                    onClick={() => navigate("/logout")}
                    className={`flex w-full items-center ${collapsed ? "justify-center" : ""} gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-all duration-200`}
                    style={{
                      color: "#F87171",
                      background: "rgba(248,113,113,0.05)",
                      border: "1px solid rgba(248,113,113,0.10)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.12)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(248,113,113,0.05)")}
                  >
                    <LogOut className={`h-4 w-4 flex-shrink-0 ${iconGap}`} />
                    {!collapsed && <span>{t("adminSidebar.signOut")}</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4" style={{ borderTop: "1px solid var(--ms-border-subtle)" }}>
        {!collapsed && (
          <p className="text-xs font-mono" style={{ color: "var(--ms-accent-cyan)", opacity: 0.35 }}>
            © {new Date().getFullYear()} Massarek
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AdminSidebar;
