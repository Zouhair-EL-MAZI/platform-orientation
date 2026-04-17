import {
  LayoutDashboard,
  FileQuestion,
  Sparkles,
  Briefcase,
  MessageSquare,
  User,
  Shield,
  Home,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import MassarekLogo from "./MassarekLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
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

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <Sidebar side={isRtl ? "right" : "left"} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-border">
        <MassarekLogo collapsed={collapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.main")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-accent/50" activeClassName="bg-accent text-accent-foreground font-medium">
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
          <SidebarGroupLabel>{t("sidebar.account")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.action === "logout" ? (
                    <SidebarMenuButton asChild>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition hover:bg-accent/50"
                      >
                        <item.icon className={`${iconMargin} h-4 w-4`} />
                        {!collapsed && <span>{item.title}</span>}
                      </button>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url} end className="hover:bg-accent/50" activeClassName="bg-accent text-accent-foreground font-medium">
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
      <SidebarFooter className="p-4 border-t border-border">
        {!collapsed && (
          <p className="text-xs text-muted-foreground">© 2026 Massarek</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
