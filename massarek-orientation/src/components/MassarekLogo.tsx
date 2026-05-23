interface MassarekLogoProps {
  collapsed?: boolean;
  size?: "sm" | "md" | "lg";
  imageSize?: "sm" | "md" | "lg";
}

const MassarekLogo = ({ collapsed = false, size = "md", imageSize }: MassarekLogoProps) => {
  const resolvedImageSize = imageSize ?? size;
  const sizeClass = resolvedImageSize === "sm" ? "w-8" : resolvedImageSize === "lg" ? "w-16" : "w-10";
  const textClass = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${sizeClass} flex-shrink-0 rounded-xl flex items-center justify-center`}
        style={{
          background: "linear-gradient(135deg, #2563EB, #22D3EE)",
          boxShadow: "0 0 16px rgba(34,211,238,0.40)",
          padding: "2px",
        }}
      >
        <img
          src="/logo1.png"
          alt="Massarek logo"
          className="h-auto w-full object-contain transition-all duration-300"
        />
      </div>
      {!collapsed && (
        <span className="relative inline-flex items-center" style={{ lineHeight:1 }}>
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 8,
              background: "radial-gradient(circle at 50% 40%, rgba(56,189,248,0.24), transparent 55%)",
              filter: "blur(16px)",
              opacity: 0.55,
              pointerEvents: "none",
              transform: "translateY(1px)",
            }}
          />
          <span
            className={`${textClass}`}
            style={{
              position: "relative",
              display: "inline-block",
              background: "linear-gradient(92deg, #38BDF8 0%, #22D3EE 36%, #60A5FA 72%, #0EA5E9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 10px 24px rgba(34,211,238,0.18), 0 0 30px rgba(59,130,246,0.12)",
              letterSpacing: "-0.035em",
            }}
          >
            Massarek
          </span>
        </span>
      )}
    </div>
  );
};

export default MassarekLogo;
