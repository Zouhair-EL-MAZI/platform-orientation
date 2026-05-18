interface MassarekLogoProps {
  collapsed?: boolean;
  size?: "sm" | "md" | "lg";
  imageSize?: "sm" | "md" | "lg";
}

const MassarekLogo = ({ collapsed = false, size = "md", imageSize }: MassarekLogoProps) => {
  const resolvedImageSize = imageSize ?? size;
  const sizeClass = resolvedImageSize === "sm" ? "w-8" : resolvedImageSize === "lg" ? "w-16" : "w-12";
  const textClass = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className="flex items-center gap-3">
      <div className={` ${sizeClass}`}>
        <img
          src="/logo1.png"
          alt="Massarek logo"
          className="h-auto w-full object-contain transition-all duration-300" 
        />
      </div>
      {!collapsed && (
        <span className={`font-bold tracking-tight text-slate-950 dark:text-white ${textClass}`}>
          Massarek
        </span>
      )}
    </div>
  );
};

export default MassarekLogo;
