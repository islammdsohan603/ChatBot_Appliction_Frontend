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
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-line-strong border-t-primary animate-spin`}
      />
      {label && (
        <p className="text-xs sm:text-sm font-medium text-fg-muted animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
