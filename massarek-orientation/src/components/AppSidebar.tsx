import {
  LayoutDashboard, FileQuestion, Sparkles, Briefcase,
  MessageSquare, User, Shield, Home, LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import MassarekLogo from "./MassarekLogo";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { t, i18n } = useTranslation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const isRtl = i18n.dir() === "rtl";
  const iconMargin = isRtl ? "ml-2" : "mr-2";

  const mainItems = [
    { title: t("sidebar.home"), url: "/", icon: Home },
    { title: t("sidebar.dashboard"), url: "/dashboard", icon: LayoutDashboard },
    { title: t("sidebar.orientationTest"), url: "/test", icon: FileQuestion },
    { title: t("sidebar.recommendations"), url: "/recommendations", icon: Sparkles },
    { title: t("sidebar.careers"), url: "/careers", icon: Briefcase },
    { title: t("sidebar.chatbot"), url: "/chatbot", icon: MessageSquare },
  ];

  const accountItems = [
    { title: t("sidebar.profile"), url: "/profile", icon: User },
    { title: t("sidebar.admin"), url: "/admin", icon: Shield },
    { title: t("sidebar.signOut"), url: "/logout", icon: LogOut, action: "logout" },
  ];

  const activeStyle = {
    color: "var(--ms-accent-sky)",
    background: "var(--ms-accent-glow)",
    border: "1px solid var(--ms-border-glow)",
    borderRadius: "8px",
  };

  const hoverClass = "transition-all duration-200 rounded-lg border border-transparent hover:border-[var(--ms-border-subtle)] hover:bg-[var(--ms-accent-glow)] hover:text-[var(--ms-accent-sky)]";

  return (
    <Sidebar
      side={isRtl ? "right" : "left"}
      collapsible="icon"
      style={{
        background: "var(--ms-bg-sidebar)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid var(--ms-border-subtle)",
      }}
    >
      <SidebarHeader
        className="p-4"
        style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
      >
        <MassarekLogo collapsed={collapsed} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className="text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "var(--ms-accent-cyan)", opacity: 0.7 }}
          >
            {t("sidebar.main")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end
                      className={`flex items-center px-3 py-2 text-sm font-semibold text-muted-foreground relative ${hoverClass}`}
                      activeClassName=""
                      style={isActive(item.url) ? activeStyle : {}}
                    >
                      {isActive(item.url) && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full"
                          style={{ background: "var(--ms-accent-cyan)", boxShadow: "0 0 8px var(--ms-accent-cyan)" }}
                        />
                      )}
                      <item.icon className={`${iconMargin} h-4 w-4`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel
            className="text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "var(--ms-accent-cyan)", opacity: 0.7 }}
          >
            {t("sidebar.account")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.action === "logout" ? (
                    <SidebarMenuButton asChild>
                      <button
                        type="button"
                        onClick={() => navigate("/logout")}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-all duration-200"
                        style={{
                          color: "#F87171",
                          background: "rgba(248,113,113,0.05)",
                          border: "1px solid rgba(248,113,113,0.10)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.12)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(248,113,113,0.05)")}
                      >
                        <item.icon className={`${iconMargin} h-4 w-4`} />
                        {!collapsed && <span>{item.title}</span>}
                      </button>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center px-3 py-2 text-sm font-semibold text-muted-foreground relative ${hoverClass}`}
                        activeClassName=""
                        style={isActive(item.url) ? activeStyle : {}}
                      >
                        <item.icon className={`${iconMargin} h-4 w-4`} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className="p-4"
        style={{ borderTop: "1px solid var(--ms-border-subtle)" }}
      >
        {!collapsed && (
          <p className="text-xs font-mono-ts" style={{ color: "var(--ms-accent-cyan)", opacity: 0.4 }}>
            © 2026 Massarek
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

