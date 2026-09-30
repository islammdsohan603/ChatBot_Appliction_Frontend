/**
 * Reusable Loading Spinner & Skeleton with Violet/Slate theme
 */
export const LoadingSpinner = ({
  size = "md",
  label = "Loading...",
  className = "",
}) => {
  const sizeMap = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 gap-3 ${className}`}
    >
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-violet-500/20 border-t-violet-600 dark:border-violet-500/30 dark:border-t-violet-400 animate-spin`}
      />
      {label && (
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
