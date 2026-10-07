 

/* ── Basic Skeleton Primitive ── */
export const SkeletonBox = ({ className = "" }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

/* ─────────────────────────────────────────
   1. Auth Page Skeleton (Login & Signup)
   ───────────────────────────────────────── */
export const AuthSkeleton = ({ type = "signup" }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-canvas font-inter relative overflow-hidden px-4 py-12">
      {/* Background ambient orbs */}
      <div
        className="absolute w-[600px] h-[600px] -left-[150px] top-1/2 -translate-y-1/2 blur-[80px] pointer-events-none opacity-40 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgb(var(--primary-rgb)/0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] -right-[100px] top-1/3 blur-[80px] pointer-events-none opacity-30 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgb(var(--accent-rgb)/0.3) 0%, transparent 70%)",
        }}
      />

      {/* Auth card container */}
      <div className="relative w-full max-w-md bg-surface/85 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-line-strong shadow-xl dark:shadow-[0_20px_50px_rgb(var(--scrim-rgb)/0.5)] z-10">
        {/* Shimmer top accent line */}
        <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-brand-violet/40 via-brand-cyan/60 to-brand-violet/40 rounded-full animate-pulse" />

        {/* Logo / Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl skeleton mb-4 flex items-center justify-center shadow-lg shadow-primary/10" />
          <SkeletonBox className="h-7 w-48 mb-2.5 rounded-xl" />
          <SkeletonBox className="h-4 w-64 rounded-lg" />
        </div>

        {/* Form Inputs Skeleton */}
        <div className="space-y-4 mb-6">
          {type === "signup" && (
            <div className="space-y-1.5">
              <SkeletonBox className="h-3.5 w-20" />
              <div className="h-12 w-full skeleton rounded-xl" />
            </div>
          )}
          <div className="space-y-1.5">
            <SkeletonBox className="h-3.5 w-16" />
            <div className="h-12 w-full skeleton rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <SkeletonBox className="h-3.5 w-20" />
              {type === "login" && <SkeletonBox className="h-3 w-24" />}
            </div>
            <div className="h-12 w-full skeleton rounded-xl" />
          </div>

          {type === "signup" && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center">
                <SkeletonBox className="h-2.5 w-28" />
                <SkeletonBox className="h-2.5 w-12" />
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5 mt-1">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonBox key={i} className="h-full rounded-full" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button Skeleton */}
        <div className="h-12 w-full skeleton rounded-xl mb-6 shadow-lg shadow-primary/20" />

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-primary/10" />
          <SkeletonBox className="h-3 w-16" />
          <div className="flex-1 h-px bg-primary/10" />
        </div>

        {/* Bottom Switcher */}
        <div className="flex justify-center items-center gap-2">
          <SkeletonBox className="h-3.5 w-36" />
          <SkeletonBox className="h-3.5 w-16" />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   2. Home Page Skeleton
   ───────────────────────────────────────── */
export const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-canvas font-inter text-fg overflow-hidden">
      {/* Top Navbar Skeleton */}
      <div className="h-16 border-b border-line px-4 sm:px-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl skeleton" />
          <SkeletonBox className="h-5 w-24 rounded-lg" />
        </div>
        <div className="hidden md:flex items-center gap-8">
          <SkeletonBox className="h-4 w-16" />
          <SkeletonBox className="h-4 w-16" />
          <SkeletonBox className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-9 w-20 rounded-xl" />
          <SkeletonBox className="h-9 w-28 rounded-xl" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="flex-1 space-y-6 w-full max-w-xl">
            <SkeletonBox className="h-7 w-44 rounded-full" />
            <div className="space-y-3">
              <SkeletonBox className="h-12 sm:h-16 w-4/5 rounded-2xl" />
              <SkeletonBox className="h-12 sm:h-16 w-full rounded-2xl" />
            </div>
            <div className="space-y-2 pt-2">
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-5/6" />
              <SkeletonBox className="h-4 w-2/3" />
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <SkeletonBox className="h-14 w-44 rounded-2xl" />
              <SkeletonBox className="h-14 w-40 rounded-2xl" />
            </div>
            <div className="flex gap-8 pt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <SkeletonBox className="h-7 w-16" />
                  <SkeletonBox className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Chat Window Preview Skeleton */}
          <div className="flex-1 w-full max-w-lg">
            <div className="bg-surface/80 backdrop-blur-xl rounded-2xl p-4 border border-line-strong shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full skeleton" />
                  <div className="space-y-1">
                    <SkeletonBox className="h-3.5 w-24" />
                    <SkeletonBox className="h-2.5 w-16" />
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full skeleton" />
                  <div className="w-2.5 h-2.5 rounded-full skeleton" />
                  <div className="w-2.5 h-2.5 rounded-full skeleton" />
                </div>
              </div>
              <div className="space-y-3 py-2">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full skeleton shrink-0" />
                  <SkeletonBox className="h-12 w-48 rounded-xl" />
                </div>
                <div className="flex justify-end">
                  <SkeletonBox className="h-10 w-52 rounded-xl" />
                </div>
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full skeleton shrink-0" />
                  <SkeletonBox className="h-10 w-40 rounded-xl" />
                </div>
                <div className="flex justify-end">
                  <SkeletonBox className="h-12 w-44 rounded-xl" />
                </div>
              </div>
              <div className="pt-2 border-t border-line">
                <SkeletonBox className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid Skeleton */}
        <div className="mt-28">
          <div className="text-center space-y-3 mb-12 flex flex-col items-center">
            <SkeletonBox className="h-6 w-36 rounded-full" />
            <SkeletonBox className="h-10 w-64 rounded-xl" />
            <SkeletonBox className="h-4 w-96 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-surface/80 backdrop-blur-xl rounded-2xl p-6 border border-line-strong space-y-3">
                <div className="w-12 h-12 rounded-xl skeleton mb-4" />
                <SkeletonBox className="h-5 w-36" />
                <SkeletonBox className="h-3.5 w-full" />
                <SkeletonBox className="h-3.5 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   3. Chat Layout Skeleton
   ───────────────────────────────────────── */
export const ChatSkeleton = () => {
  return (
    <div className="h-screen w-screen flex bg-canvas overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-80 border-r border-line flex flex-col bg-surface/85 shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton" />
            <div className="space-y-1.5">
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-2.5 w-14" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl skeleton" />
        </div>

        {/* Search */}
        <div className="p-3">
          <SkeletonBox className="h-10 w-full rounded-xl" />
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-2xl ${
                i === 1 ? "bg-primary/15 border border-line-strong" : "bg-primary/5"
              }`}
            >
              <div className="w-12 h-12 rounded-full skeleton shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-center">
                  <SkeletonBox className="h-3.5 w-28" />
                  <SkeletonBox className="h-2.5 w-10" />
                </div>
                <SkeletonBox className="h-2.5 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Chat Area Skeleton */}
      <div className="flex-1 flex flex-col bg-canvas">
        {/* Chat Header */}
        <div className="h-16 border-b border-line px-6 flex items-center justify-between bg-surface/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton" />
            <div className="space-y-1.5">
              <SkeletonBox className="h-4 w-32" />
              <SkeletonBox className="h-2.5 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl skeleton" />
            <div className="w-8 h-8 rounded-xl skeleton" />
            <div className="w-8 h-8 rounded-xl skeleton" />
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 space-y-4 overflow-hidden">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full skeleton shrink-0 self-end" />
            <div className="space-y-1">
              <SkeletonBox className="h-12 w-64 rounded-2xl rounded-bl-sm" />
              <SkeletonBox className="h-2 w-12 ml-1" />
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3">
            <div className="space-y-1 flex flex-col items-end">
              <SkeletonBox className="h-14 w-72 rounded-2xl rounded-br-sm" />
              <SkeletonBox className="h-2 w-12 mr-1" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full skeleton shrink-0 self-end" />
            <div className="space-y-1">
              <SkeletonBox className="h-10 w-52 rounded-2xl rounded-bl-sm" />
              <SkeletonBox className="h-2 w-12 ml-1" />
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3">
            <div className="space-y-1 flex flex-col items-end">
              <SkeletonBox className="h-16 w-80 rounded-2xl rounded-br-sm" />
              <SkeletonBox className="h-2 w-12 mr-1" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full skeleton shrink-0 self-end" />
            <div className="space-y-1">
              <SkeletonBox className="h-10 w-44 rounded-2xl rounded-bl-sm" />
              <SkeletonBox className="h-2 w-12 ml-1" />
            </div>
          </div>
        </div>

        {/* Message Composer */}
        <div className="p-4 border-t border-line bg-surface/80">
          <div className="flex items-center gap-3 bg-surface-hover p-2 rounded-2xl border border-line-strong">
            <div className="w-8 h-8 rounded-xl skeleton" />
            <div className="w-8 h-8 rounded-xl skeleton" />
            <SkeletonBox className="h-8 flex-1 rounded-xl" />
            <div className="w-10 h-10 rounded-xl skeleton" />
          </div>
        </div>
      </div>

      {/* Right Profile Panel Skeleton (Desktop) */}
      <div className="hidden xl:flex w-72 border-l border-line flex-col p-6 bg-surface/85 space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full skeleton shadow-lg" />
          <SkeletonBox className="h-4 w-28" />
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-5 w-24 rounded-full" />
        </div>
        <div className="space-y-3 pt-4 border-t border-line">
          <SkeletonBox className="h-3 w-24" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonBox key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   4. Profile Page Skeleton
   ───────────────────────────────────────── */
export const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-canvas font-inter text-fg">
      {/* Top Header Skeleton */}
      <div className="h-14 border-b border-line px-6 flex items-center justify-between max-w-4xl mx-auto">
        <SkeletonBox className="h-4 w-28" />
        <SkeletonBox className="h-4 w-20" />
        <div className="w-8 h-8 rounded-xl skeleton" />
      </div>

      {/* Profile Body */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Card */}
          <div className="lg:col-span-1 glass rounded-2xl p-6 border border-line flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full skeleton shadow-xl" />
            <div className="space-y-1.5 w-full flex flex-col items-center">
              <SkeletonBox className="h-5 w-32" />
              <SkeletonBox className="h-3 w-24" />
            </div>
            <SkeletonBox className="h-6 w-20 rounded-full" />
            <div className="w-full pt-4 border-t border-line grid grid-cols-2 gap-3">
              <SkeletonBox className="h-14 rounded-xl" />
              <SkeletonBox className="h-14 rounded-xl" />
            </div>
          </div>

          {/* Details & Settings Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 border border-line space-y-4">
              <SkeletonBox className="h-4 w-36 mb-2" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2">
                  <div className="w-9 h-9 rounded-xl skeleton shrink-0" />
                  <div className="flex-1 space-y-1">
                    <SkeletonBox className="h-2.5 w-20" />
                    <SkeletonBox className="h-3.5 w-48" />
                  </div>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-6 border border-line space-y-3">
              <SkeletonBox className="h-4 w-28 mb-2" />
              {[1, 2, 3].map((i) => (
                <SkeletonBox key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
