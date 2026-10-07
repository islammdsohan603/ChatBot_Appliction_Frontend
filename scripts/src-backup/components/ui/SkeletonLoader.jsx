/**
 * SkeletonLoader — Skeleton loading states for different content types.
 *
 * Usage:
 *   <SkeletonLoader type="conversation" count={5} />
 *   <SkeletonLoader type="message" count={4} />
 *   <SkeletonLoader type="profile" />
 */

const SkeletonBox = ({ className = "" }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

const ConversationSkeleton = () => (
  <div className="flex items-center gap-3 px-3 py-3 animate-pulse">
    <div className="w-11 h-11 rounded-full skeleton shrink-0" />
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-3 w-28" />
        <SkeletonBox className="h-2.5 w-10" />
      </div>
      <SkeletonBox className="h-2.5 w-40" />
    </div>
  </div>
);

const MessageSkeleton = ({ reverse = false }) => (
  <div className={`flex gap-3 px-4 py-2 ${reverse ? "flex-row-reverse" : ""}`}>
    {!reverse && <div className="w-8 h-8 rounded-full skeleton shrink-0" />}
    <div className={`flex flex-col gap-1 max-w-[60%] ${reverse ? "items-end" : ""}`}>
      <SkeletonBox className="h-10 w-48 rounded-2xl" />
      <SkeletonBox className="h-2 w-16" />
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="flex flex-col items-center gap-4 px-4 py-6 animate-pulse">
    <div className="w-20 h-20 rounded-full skeleton" />
    <div className="space-y-2 w-full flex flex-col items-center">
      <SkeletonBox className="h-4 w-32" />
      <SkeletonBox className="h-3 w-24" />
    </div>
    <div className="w-full space-y-3 mt-4">
      <SkeletonBox className="h-3 w-full" />
      <SkeletonBox className="h-3 w-4/5" />
      <SkeletonBox className="h-3 w-3/5" />
    </div>
  </div>
);

const SkeletonLoader = ({ type = "conversation", count = 4 }) => {
  if (type === "profile") return <ProfileSkeleton />;

  const items = Array.from({ length: count }, (_, i) => i);

  if (type === "message") {
    return (
      <div className="flex flex-col gap-1 py-4">
        {items.map((i) => (
          <MessageSkeleton key={i} reverse={i % 3 === 0} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {items.map((i) => (
        <ConversationSkeleton key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
