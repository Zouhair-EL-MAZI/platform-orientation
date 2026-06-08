/**
 * MassarekLogo.tsx
 *
 * Changes:
 *  - collapsed=true → shows ONLY the square icon, perfectly centred, no text
 *  - collapsed=false → shows icon + "Massarek" gradient text (unchanged)
 *  - Icon size adjusts cleanly for sidebar collapsed state
 */
interface MassarekLogoProps {
  collapsed?:  boolean;
  size?:       "sm" | "md" | "lg";
  imageSize?:  "sm" | "md" | "lg";
}

const MassarekLogo = ({ collapsed = false, size = "md", imageSize }: MassarekLogoProps) => {
  const resolvedImageSize = imageSize ?? size;

  // When collapsed in sidebar, use a fixed small size so it fits the narrow bar
  const iconSizeClass = collapsed
    ? "w-8 h-8"
    : resolvedImageSize === "sm" ? "w-8" : resolvedImageSize === "lg" ? "w-16" : "w-10";

  const textSizeClass = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"}`}>
      {/* Icon square */}
      <div
        className={`${iconSizeClass} flex-shrink-0 rounded-xl flex items-center justify-center`}
        style={{
          background: "linear-gradient(135deg, #2563EB, #22D3EE)",
          boxShadow:  "0 0 16px rgba(34,211,238,0.35)",
          padding:    "2px",
        }}
      >
        <img
          src="/logo1.png"
          alt="Massarek"
          className="h-auto w-full object-contain transition-all duration-300"
        />
      </div>

      {/* Text — hidden when collapsed */}
      {!collapsed && (
        <span className="relative inline-flex items-center" style={{ lineHeight: 1 }}>
          {/* Glow behind text */}
          <span
            style={{
              position:     "absolute",
              inset:        0,
              borderRadius: 8,
              background:   "radial-gradient(circle at 50% 40%, rgba(56,189,248,0.22), transparent 55%)",
              filter:       "blur(14px)",
              opacity:      0.5,
              pointerEvents:"none",
              transform:    "translateY(1px)",
            }}
          />
          <span
            className={textSizeClass}
            style={{
              position:              "relative",
              display:               "inline-block",
              background:            "linear-gradient(92deg, #38BDF8 0%, #22D3EE 36%, #60A5FA 72%, #0EA5E9 100%)",
              WebkitBackgroundClip:  "text",
              WebkitTextFillColor:   "transparent",
              backgroundClip:        "text",
              letterSpacing:         "-0.035em",
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
