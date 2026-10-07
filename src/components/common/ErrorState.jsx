import { FiAlertCircle, FiRefreshCw, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";

/**
 * Reusable ErrorState display
 */
export const ErrorState = ({
  title = "Something went wrong",
  message = "We encountered an issue loading this section. Please try again.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-error/20 bg-error/5 p-8 text-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-error/15 text-error-text mx-auto flex items-center justify-center mb-4">
        <FiAlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-fg mb-2">
        {title}
      </h3>
      <p className="text-sm text-fg-secondary mb-6 leading-relaxed">
        {message}
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        )}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-line-strong text-fg-secondary hover:bg-surface-hover text-xs font-medium transition-all"
        >
          <FiHome className="w-3.5 h-3.5" />
          Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;
