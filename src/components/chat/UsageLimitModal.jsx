import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiZap,
  FiLock,
  FiCheck,
  FiX,
  FiArrowRight,
  FiAward,
  FiClock,
  FiCpu,
  FiImage,
  FiDownload,
} from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";

export const UsageLimitModal = ({
  isOpen = false,
  onClose,
  limitData = null,
  onInstantUpgrade,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const reason = limitData?.reason || "MESSAGE_LIMIT_REACHED";
  const used = limitData?.used ?? 20;
  const limit = limitData?.limit ?? 20;

  let title = "Daily Free Message Limit Reached";
  let subtitle =
    "You have used your 20 free messages for today. Upgrade to Nexora Pro to unlock unlimited conversations.";
  let icon = <FiZap className="w-7 h-7 text-amber-400" />;

  if (reason === "MODEL_RESTRICTED") {
    title = "Pro Reasoning Model Locked";
    subtitle =
      limitData?.error ||
      "Advanced reasoning models such as Gemini 3.5 Pro and Gemini 3.7 Flash are exclusive to Pro subscribers.";
    icon = <FiCpu className="w-7 h-7 text-brand-cyan" />;
  } else if (reason === "IMAGE_LIMIT_REACHED") {
    title = "Vision Attachment Quota Reached";
    subtitle =
      "You have reached your daily limit of 5 image attachments on the Free Starter plan. Upgrade to Pro for unlimited vision attachments.";
    icon = <FiImage className="w-7 h-7 text-brand-violet" />;
  } else if (reason === "EXPORT_RESTRICTED") {
    title = "Chat History Export is a Pro Feature";
    subtitle =
      "Download complete transcripts in Markdown and JSON formats with full code and attachment archives on Nexora Pro.";
    icon = <FiDownload className="w-7 h-7 text-emerald-400" />;
  }

  const PRO_BENEFITS = [
    {
      icon: <IoSparkles className="w-4 h-4 text-amber-400 shrink-0" />,
      text: "Unlimited AI conversations & daily messages (no caps)",
    },
    {
      icon: <FiCpu className="w-4 h-4 text-brand-cyan shrink-0" />,
      text: "Access to Gemini 3.5 Pro & Gemini 3.7 Flash advanced models",
    },
    {
      icon: <FiImage className="w-4 h-4 text-brand-violet shrink-0" />,
      text: "Unlimited optical vision attachments up to 20MB",
    },
    {
      icon: <FiDownload className="w-4 h-4 text-emerald-400 shrink-0" />,
      text: "Export chat transcripts (Markdown & JSON)",
    },
    {
      icon: <FiZap className="w-4 h-4 text-primary-text shrink-0" />,
      text: "Dedicated high-priority streaming response queue",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-scrim/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-surface border border-line-strong shadow-2xl overflow-hidden z-10"
        >
          {/* Top Decorative Gradient Ribbon */}
          <div className="h-2.5 w-full bg-gradient-to-r from-brand-violet via-primary to-brand-cyan" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header / Icon */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                {icon}
              </div>
              <div className="min-w-0 pr-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-bold text-amber-500 dark:text-amber-400 mb-1.5">
                  <FiLock className="w-3 h-3" />
                  <span>Free Starter Plan Limit</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-fg tracking-tight leading-tight">
                  {title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed">
              {subtitle}
            </p>

            {/* Quota Gauge Pill */}
            {reason === "MESSAGE_LIMIT_REACHED" && (
              <div className="p-4 rounded-2xl bg-surface-hover border border-line flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-fg">Daily Message Quota</p>
                  <p className="text-[11px] text-fg-muted mt-0.5">
                    {used} of {limit} messages used today
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-error-text bg-error/10 px-3 py-1.5 rounded-xl border border-error/20">
                  <FiClock className="w-3.5 h-3.5" />
                  <span>Resets at 00:00 UTC</span>
                </div>
              </div>
            )}

            {/* Unlocked Benefits List */}
            <div className="space-y-2.5 pt-1">
              <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Upgrade to Pro to instantly unlock:
              </p>
              <div className="space-y-2">
                {PRO_BENEFITS.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-xs text-fg-secondary font-medium"
                  >
                    <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {b.icon}
                    </div>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/pricing");
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-violet via-primary to-brand-cyan hover:opacity-95 text-primary-contrast font-bold text-sm transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <FiAward className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Upgrade to Pro Developer ($19/mo)</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Dev / Test mode instant upgrade button */}
              {onInstantUpgrade && (
                <button
                  type="button"
                  onClick={onInstantUpgrade}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-hover hover:bg-surface border border-line-strong text-xs font-semibold text-primary-text hover:text-fg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <IoSparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Activate Pro Privileges (Instant Demo / Test Upgrade)</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs text-fg-muted hover:text-fg transition-colors text-center cursor-pointer"
              >
                Maybe later, continue on Free plan
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UsageLimitModal;
