/**
 * AppSidebar.tsx
 *
 * Changes:
 *  - Logo shows icon-only (centered) when collapsed, full logo when expanded
 *  - Tooltip text on every item when collapsed (accessibility + UX)
 *  - All labels go through i18n (en/fr/ar already exist in locale files)
 *  - RTL support preserved
 *  - Admin item hidden for non-admin users (preserved)
 *  - Hover/active styles preserved
 */
import {
  LayoutDashboard, FileQuestion, Sparkles, Briefcase,
  MessageSquare, User, Shield, Home, LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
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
  const { state }   = useSidebar();
  const collapsed   = state === "collapsed";
  const location    = useLocation();
  const navigate    = useNavigate();
  const { role }    = useAuth();

  const isActive  = (path: string) => location.pathname === path;
  const isRtl     = i18n.dir() === "rtl";
  const iconClass = isRtl ? "ml-2" : "mr-2";

  // ── Navigation items ─────────────────────────────────────────────────────

  const mainItems = [
    { title: t("sidebar.home"),            url: "/",               icon: Home,           action: "navigate" },
    { title: t("sidebar.dashboard"),       url: "/dashboard",      icon: LayoutDashboard                   },
    { title: t("sidebar.orientationTest"), url: "/test",           icon: FileQuestion                      },
    { title: t("sidebar.recommendations"), url: "/recommendations", icon: Sparkles                          },
    { title: t("sidebar.careers"),         url: "/careers",        icon: Briefcase                         },
    { title: t("sidebar.chatbot"),         url: "/chatbot",        icon: MessageSquare                     },
  ];

  const accountItems = [
    { title: t("sidebar.profile"),  url: "/profile", icon: User                           },
    { title: t("sidebar.admin"),    url: "/admin",   icon: Shield, adminOnly: true         },
    { title: t("sidebar.signOut"),  url: "/logout",  icon: LogOut, action: "logout"        },
  ].filter(item => !(item.adminOnly && role !== "admin"));

  // ── Styles ────────────────────────────────────────────────────────────────

  const activeStyle = {
    color:        "var(--ms-accent-sky)",
    background:   "var(--ms-accent-glow)",
    border:       "1px solid var(--ms-border-glow)",
    borderRadius: "8px",
  };

  const baseClass = "transition-all duration-200 rounded-lg border border-transparent hover:border-[var(--ms-border-subtle)] hover:bg-[var(--ms-accent-glow)] hover:text-[var(--ms-accent-sky)]";

  // ── Helper: render a nav item ─────────────────────────────────────────────

  const renderItem = (item: typeof mainItems[0], isLogout = false) => {
    const Icon    = item.icon;
    const active  = isActive(item.url);
    const tooltip = collapsed ? item.title : undefined;

    if (isLogout) {
      return (
        <SidebarMenuButton asChild key={item.title}>
          <button
            type="button"
            title={tooltip}
            onClick={() => navigate("/logout")}
            className={`flex w-full items-center ${collapsed ? "justify-center" : ""} gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-all duration-200`}
            style={{
              color:      "#F87171",
              background: "rgba(248,113,113,0.05)",
              border:     "1px solid rgba(248,113,113,0.10)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(248,113,113,0.05)")}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </button>
        </SidebarMenuButton>
      );
    }

    if (item.action === "navigate") {
      return (
        <SidebarMenuButton asChild key={item.title}>
          <button
            type="button"
            title={tooltip}
            onClick={() => navigate(item.url)}
            className={`flex w-full items-center ${collapsed ? "justify-center" : ""} gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-muted-foreground ${baseClass}`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </button>
        </SidebarMenuButton>
      );
    }

    return (
      <SidebarMenuButton asChild isActive={active} key={item.title}>
        <NavLink
          to={item.url}
          end
          title={tooltip}
          className={`flex items-center ${collapsed ? "justify-center" : ""} px-3 py-2 text-sm font-semibold text-muted-foreground relative ${baseClass}`}
          activeClassName=""
          style={active ? activeStyle : {}}
        >
          {/* Active left bar indicator */}
          {active && !collapsed && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full"
              style={{ background: "var(--ms-accent-cyan)", boxShadow: "0 0 8px var(--ms-accent-cyan)" }}
            />
          )}
          <Icon className={`h-4 w-4 flex-shrink-0 ${!collapsed ? iconClass : ""}`} />
          {!collapsed && <span>{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    );
  };

  return (
    <Sidebar
      side={isRtl ? "right" : "left"}
      collapsible="icon"
      style={{
        background:           "var(--ms-bg-sidebar)",
        backdropFilter:       "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight:          "1px solid var(--ms-border-subtle)",
      }}
    >
      {/* ── Logo header ──────────────────────────────────────────── */}
      <SidebarHeader
        className="p-4"
        style={{ borderBottom: "1px solid var(--ms-border-subtle)" }}
      >
        {/*
          KEY FIX:
          When collapsed → show only the square icon, centred.
          When expanded  → show full logo with text.
          We pass collapsed prop to MassarekLogo which already handles
          hiding the text. We just fix the alignment here.
        */}
        <div className={collapsed ? "flex justify-center" : ""}>
          <MassarekLogo collapsed={collapsed} />
        </div>
      </SidebarHeader>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <SidebarContent>

        {/* MAIN group */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel
              className="text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ color: "var(--ms-accent-cyan)", opacity: 0.7 }}
            >
              {t("sidebar.main")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map(item => (
                <SidebarMenuItem key={item.url}>
                  {renderItem(item)}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ACCOUNT group */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel
              className="text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ color: "var(--ms-accent-cyan)", opacity: 0.7 }}
            >
              {t("sidebar.account")}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map(item => (
                <SidebarMenuItem key={item.url}>
                  {renderItem(item, item.action === "logout")}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <SidebarFooter
        className="p-4"
        style={{ borderTop: "1px solid var(--ms-border-subtle)" }}
      >
        {!collapsed && (
          <p className="text-xs" style={{ color: "var(--ms-accent-cyan)", opacity: 0.35, fontVariant: "tabular-nums" }}>
            © 2026 Massarek
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
