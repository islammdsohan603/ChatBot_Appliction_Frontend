/**
 * UserAvatar — Shows user avatar (initials fallback) with optional online indicator.
 *
 * Props:
 *  - name: string — used to generate initials
 *  - src: string | null — image URL
 *  - size: 'xs'|'sm'|'md'|'lg'|'xl' (default 'md')
 *  - online: boolean (default false)
 *  - className: string — extra Tailwind classes
 */
const sizeClasses = {
  xs: "w-7 h-7 text-[10px]",
  sm: "w-9 h-9 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
  "2xl": "w-28 h-28 text-3xl",
};

const indicatorSize = {
  xs: "w-2 h-2 border",
  sm: "w-2.5 h-2.5 border",
  md: "w-3 h-3 border-2",
  lg: "w-3.5 h-3.5 border-2",
  xl: "w-4 h-4 border-2",
  "2xl": "w-5 h-5 border-[3px]",
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const GRADIENT_COLORS = [
  "from-brand-violet to-brand-violet",
  "from-brand-cyan to-info",
  "from-brand-violet to-error",
  "from-warning to-warning",
  "from-success to-brand-cyan",
  "from-brand-indigo to-brand-violet",
];

const getGradient = (name = "") => {
  const code = name.charCodeAt(0) || 0;
  return GRADIENT_COLORS[code % GRADIENT_COLORS.length];
};

const UserAvatar = ({
  name = "",
  src = null,
  size = "md",
  online = false,
  className = "",
}) => {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const indicatorClass = indicatorSize[size] || indicatorSize.md;
  const gradient = getGradient(name);
  const initials = getInitials(name);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-primary/20`}
        />
      ) : (
        <div
          className={`${sizeClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-semibold text-primary-contrast ring-2 ring-primary/20 select-none`}
          aria-label={`Avatar for ${name}`}
        >
          {initials}
        </div>
      )}
      {online && (
        <span
          className={`absolute bottom-0 right-0 ${indicatorClass} rounded-full bg-success border-line-strong`}
          role="status"
          aria-label="Online"
        />
      )}
    </div>
  );
};

export default UserAvatar;
