import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

/**
 * Reusable hero / header component for subpages
 */
export const PageHeader = ({
  badge = "Nexora AI",
  title,
  highlight,
  description,
  breadcrumbs = [],
  action,
  className = "",
}) => {
  return (
    <div
      className={`relative pt-28 pb-12 sm:pt-32 sm:pb-16 text-center overflow-hidden ${className}`}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] blur-[120px] pointer-events-none opacity-25 dark:opacity-35"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.6) 0%, rgba(6,182,212,0.4) 50%, transparent 75%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 z-10">
        {breadcrumbs.length > 0 && (
          <nav
            className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-5"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
            >
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <FiChevronRight className="w-3 h-3 text-slate-400 opacity-60" />
                {crumb.to ? (
                  <Link
                    to={crumb.to}
                    className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-violet-600 dark:text-violet-400 font-medium">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-600 dark:text-violet-300 text-xs font-semibold mb-4 shadow-xs">
            <HiOutlineSparkles className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15] mb-4">
          {title}{" "}
          {highlight && (
            <span className="bg-gradient-to-r from-violet-500 via-violet-600 to-cyan-400 bg-clip-text text-transparent">
              {highlight}
            </span>
          )}
        </h1>

        {description && (
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
            {description}
          </p>
        )}

        {action && <div className="mt-4 flex justify-center">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
