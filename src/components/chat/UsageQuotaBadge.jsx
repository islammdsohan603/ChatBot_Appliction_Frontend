import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiZap, FiAward, FiClock, FiChevronRight } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";

export const UsageQuotaBadge = ({
  usageData = null,
  userTier = "free",
  onOpenUpgradeModal,
  className = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const tier = (userTier || usageData?.tier || "free").toLowerCase();
  const isPro = tier === "pro" || tier === "enterprise";

  const messageCount = usageData?.usage?.messageCount ?? 0;
  const maxMessages = usageData?.limits?.maxDailyMessages ?? 20;
  const remaining = usageData?.remainingMessages ?? Math.max(0, maxMessages - messageCount);
  const imageCount = usageData?.usage?.imageCount ?? 0;
  const maxImages = usageData?.limits?.maxDailyImages ?? 5;

  const percentUsed = Math.min(100, Math.round((messageCount / maxMessages) * 100));

  if (isPro) {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <Link
          to="/dashboard"
          title="Pro Plan: Unlimited conversations and advanced models unlocked"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/15 via-brand-violet/15 to-brand-cyan/15 border border-amber-500/30 text-[11px] font-bold text-amber-500 dark:text-amber-300 shadow-xs hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <IoSparkles className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>PRO</span>
          <span className="text-[10px] opacity-80 font-medium hidden sm:inline">
            · Unlimited
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => onOpenUpgradeModal?.({ reason: "MESSAGE_LIMIT_REACHED", used: messageCount, limit: maxMessages })}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-hover/80 hover:bg-surface-hover border border-line-strong hover:border-primary/40 text-[11px] font-medium text-fg-secondary hover:text-fg transition-all cursor-pointer shadow-2xs group"
        aria-label="View daily usage quota"
      >
        <FiZap
          className={`w-3 h-3 transition-colors ${
            percentUsed >= 80 ? "text-error-text" : "text-amber-500"
          }`}
        />
        <span className="font-semibold text-fg">
          {remaining}/{maxMessages}
        </span>
        <span className="text-[10px] text-fg-muted hidden sm:inline">
          messages left
        </span>

        {/* Mini progress dot / bar */}
        <div className="w-8 h-1.5 rounded-full bg-line overflow-hidden ml-0.5 hidden xs:block">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              percentUsed >= 90
                ? "bg-error"
                : percentUsed >= 70
                ? "bg-amber-500"
                : "bg-primary"
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </button>

      {/* Floating Quota Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-64 p-3.5 rounded-2xl bg-surface border border-line-strong shadow-xl z-30 text-left animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-line mb-2">
            <span className="text-xs font-bold text-fg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Daily Free Quota
            </span>
            <span className="text-[10px] font-semibold text-fg-muted">
              {percentUsed}% used
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-fg-secondary">
            <div className="flex justify-between">
              <span className="text-fg-muted">Messages today:</span>
              <span className="font-semibold text-fg">{messageCount} / {maxMessages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Vision attachments:</span>
              <span className="font-semibold text-fg">{imageCount} / {maxImages}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-fg-muted pt-1">
              <FiClock className="w-3 h-3" />
              <span>Resets nightly at 00:00 UTC</span>
            </div>
          </div>

          <Link
            to="/pricing"
            className="mt-3 w-full py-1.5 px-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-text text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Upgrade to Pro for Unlimited</span>
            <FiChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default UsageQuotaBadge;
