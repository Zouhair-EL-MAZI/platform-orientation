import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      <Sun size={18} className="text-muted-foreground hidden dark:block" />
      <Moon size={18} className="text-muted-foreground block dark:hidden" />
    </button>
  );
};

export default ThemeToggle;
