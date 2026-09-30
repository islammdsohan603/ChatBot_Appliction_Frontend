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

  return (
    <div
      className={`group flex gap-2.5 px-4 py-1 animate-messageIn ${
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
          <span className="text-[11px] font-medium text-violet-600 dark:text-violet-400/80 mb-1 ml-1">
            {senderName}
          </span>
        )}

        {/* Bubble + reaction toggle */}
        <div className={`relative flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          {/* Bubble */}
          <div
            className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed select-text ${
              isOwn
                ? "bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-br-sm shadow-md shadow-violet-900/30"
                : "bg-white dark:bg-[#111840] border border-violet-200/80 dark:border-violet-500/10 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-sm"
            }`}
          >
            {/* AI badge if web search or deep think used */}
            {(message.webSearch || message.deepThink) && (
              <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-medium opacity-80">
                {message.webSearch && (
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                    🌐 Web Search
                  </span>
                )}
                {message.deepThink && (
                  <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/30">
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
                        className="max-h-48 w-full object-cover rounded-lg border border-violet-500/20"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-black/25 rounded-lg text-xs border border-violet-300/30 dark:border-white/10 text-slate-800 dark:text-slate-200">
                        <span className="text-violet-500 dark:text-violet-400">📎</span>
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
              className="p-1 rounded-lg text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 transition-all"
              aria-label="Add reaction"
            >
              <HiOutlineFaceSmile className="w-4 h-4" />
            </button>

            {/* Reaction picker */}
            {showReactions && (
              <div
                className={`absolute bottom-full mb-1 flex gap-1 p-1.5 rounded-xl bg-white dark:bg-[#111840] border border-violet-300/50 dark:border-violet-500/20 shadow-xl z-10 ${
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
                className="flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#111840] border border-violet-300/30 dark:border-violet-500/10"
              >
                {r.emoji} <span className="text-slate-600 dark:text-slate-400">{r.count}</span>
              </span>
            ))}
          </div>
        )}

        {/* Timestamp + read status */}
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-slate-500 dark:text-slate-500">{formatTime(timestamp)}</span>
          {isOwn && (
            <span className="text-[10px]">
              {status === "read" ? (
                <HiOutlineCheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <HiOutlineCheck className="w-3.5 h-3.5 text-slate-500" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
