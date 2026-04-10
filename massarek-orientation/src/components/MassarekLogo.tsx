import { Compass } from "lucide-react";

interface MassarekLogoProps {
  collapsed?: boolean;
  size?: "sm" | "md" | "lg";
}

const MassarekLogo = ({ collapsed = false, size = "md" }: MassarekLogoProps) => {
  const iconSize = size === "sm" ? 20 : size === "lg" ? 32 : 24;

  return (
    <div className="flex items-center gap-2.5">
      <div className="gradient-primary rounded-xl p-1.5 flex items-center justify-center">
        <Compass className="text-primary-foreground" size={iconSize} strokeWidth={2.2} />
      </div>
      {!collapsed && (
        <span className={`font-bold tracking-tight gradient-text ${size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl"}`}>
          Massarek
        </span>
      )}
    </div>
  );
};

export default MassarekLogo;
