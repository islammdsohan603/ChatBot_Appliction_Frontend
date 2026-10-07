/**
 * MessageBubble — Individual message bubble component.
 *
 * Props:
 *  - message: { id, text, timestamp, isOwn, senderName, senderAvatar, status, reactions }
 *  - showAvatar: boolean
 */
import UserAvatar from "../ui/UserAvatar";
import {
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlineFaceSmile,
} from "react-icons/hi2";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { chatUserBubbleMotion, chatBotBubbleMotion } from "../../lib/motion";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MessageBubble = ({ message, showAvatar = true }) => {
  const { text, timestamp, isOwn, senderName, status, reactions = [] } = message;
  const [showReactions, setShowReactions] = useState(false);
  const [localReactions, setLocalReactions] = useState(reactions);

  const handleReaction = (emoji) => {
    setLocalReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r
        );
      }
      return [...prev, { emoji, count: 1 }];
    });
    setShowReactions(false);
  };

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : (isOwn ? chatUserBubbleMotion.hidden : chatBotBubbleMotion.hidden)}
      animate={shouldReduceMotion ? { opacity: 1 } : (isOwn ? chatUserBubbleMotion.visible : chatBotBubbleMotion.visible)}
      className={`group flex gap-2.5 px-4 py-1 ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      {!isOwn && showAvatar && (
        <div className="self-end mb-1">
          <UserAvatar name={senderName} size="sm" />
        </div>
      )}
      {!isOwn && !showAvatar && <div className="w-9 shrink-0" />}

      <div className={`flex flex-col max-w-[70%] md:max-w-[60%] ${isOwn ? "items-end" : "items-start"}`}>
        {/* Sender name (for incoming only) */}
        {!isOwn && showAvatar && (
          <span className="text-[11px] font-medium text-primary-text mb-1 ml-1">
            {senderName}
          </span>
        )}

        {/* Bubble + reaction toggle */}
        <div className={`relative flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          {/* Bubble */}
          <div
            className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed select-text ${
              isOwn
                ? "bg-gradient-to-br from-brand-violet to-brand-violet text-primary-contrast rounded-br-sm shadow-md shadow-primary/30"
                : "bg-surface border border-line-strong text-fg rounded-bl-sm shadow-[0_2px_8px_rgb(var(--scrim-rgb)/0.04)] dark:shadow-sm"
            }`}
          >
            {/* AI badge if web search or deep think used */}
            {(message.webSearch || message.deepThink) && (
              <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-medium opacity-80">
                {message.webSearch && (
                  <span className="px-1.5 py-0.5 rounded-full bg-accent/20 text-accent-text border border-accent/30">
                    🌐 Web Search
                  </span>
                )}
                {message.deepThink && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary-text border border-primary/30">
                    🧠 Deep Think
                  </span>
                )}
              </div>
            )}

            {/* Attachments preview */}
            {message.attachments?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.attachments.map((att) => (
                  <div key={att.id} className="rounded-xl overflow-hidden max-w-[220px]">
                    {att.isImage && att.previewUrl ? (
                      <img
                        src={att.previewUrl}
                        alt={att.name}
                        className="max-h-48 w-full object-cover rounded-lg border border-line-strong"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-surface-hover rounded-lg text-xs border border-line-strong text-fg">
                        <span className="text-primary-text">📎</span>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate font-medium">{att.name}</span>
                          <span className="text-[10px] opacity-70">{att.size}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {text}
          </div>

          {/* Reaction trigger */}
          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setShowReactions((v) => !v)}
              className="p-1 rounded-lg text-fg-muted hover:text-primary-text hover:bg-primary/10 transition-all"
              aria-label="Add reaction"
            >
              <HiOutlineFaceSmile className="w-4 h-4" />
            </button>

            {/* Reaction picker */}
            {showReactions && (
              <div
                className={`absolute bottom-full mb-1 flex gap-1 p-1.5 rounded-xl bg-surface border border-line-strong shadow-xl z-10 ${
                  isOwn ? "right-0" : "left-0"
                }`}
              >
                {REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="text-lg hover:scale-125 transition-transform p-0.5"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reactions display */}
        {localReactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
            {localReactions.map((r) => (
              <span
                key={r.emoji}
                className="flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-full bg-surface-hover border border-line-strong"
              >
                {r.emoji} <span className="text-fg-secondary">{r.count}</span>
              </span>
            ))}
          </div>
        )}

        {/* Timestamp + read status */}
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-fg-muted">{formatTime(timestamp)}</span>
          {isOwn && (
            <span className="text-[10px]">
              {status === "read" ? (
                <HiOutlineCheckCircle className="w-3.5 h-3.5 text-accent-text" />
              ) : (
                <HiOutlineCheck className="w-3.5 h-3.5 text-fg-muted" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
