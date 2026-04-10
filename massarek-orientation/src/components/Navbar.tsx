import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";
import MassarekLogo from "./MassarekLogo";
import { SidebarTrigger } from "./ui/sidebar";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 sticky top-0 z-30">
      <SidebarTrigger className="mr-1" />
      <Link to="/" className="lg:hidden">
        <MassarekLogo size="sm" />
      </Link>
      <div className="flex-1" />
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Search..."
          className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 w-56 transition-all"
        />
      </div>
      <ThemeToggle />
      <button className="p-2 rounded-lg hover:bg-accent transition-colors relative">
        <Bell size={18} className="text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full gradient-primary" />
      </button>
      <Link to="/profile" className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
        S
      </Link>
    </header>
  );
};

export default Navbar;
