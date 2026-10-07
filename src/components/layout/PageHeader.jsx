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
            "radial-gradient(ellipse at center, rgb(var(--primary-rgb)/0.6) 0%, rgb(var(--accent-rgb)/0.4) 50%, transparent 75%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 z-10">
        {breadcrumbs.length > 0 && (
          <nav
            className="flex items-center justify-center gap-1.5 text-xs text-fg-muted mb-5"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-primary-text transition-colors"
            >
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <FiChevronRight className="w-3 h-3 text-fg-muted opacity-60" />
                {crumb.to ? (
                  <Link
                    to={crumb.to}
                    className="hover:text-primary-text transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary-text font-medium">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary-text text-xs font-semibold mb-4 shadow-xs">
            <HiOutlineSparkles className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-fg tracking-tight leading-[1.15] mb-4">
          {title}{" "}
          {highlight && (
            <span className="text-gradient text-transparent">
              {highlight}
            </span>
          )}
        </h1>

        {description && (
          <p className="text-base sm:text-lg text-fg-secondary max-w-2xl mx-auto leading-relaxed mb-6">
            {description}
          </p>
        )}

        {action && <div className="mt-4 flex justify-center">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
