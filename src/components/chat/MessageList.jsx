/**
 * MessageList — Scrollable container of messages with date separators.
 *
 * Props:
 *  - messages: array of message objects
 *  - isTyping: boolean
 *  - typingUser: string
 *  - currentUserId: string
 */
import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import SkeletonLoader from "../ui/SkeletonLoader";
import { ScrollReveal } from "../common/ScrollReveal";

const formatDateLabel = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
};

const DateSeparator = ({ label }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-violet/20 to-transparent" />
    <span className="text-[11px] font-medium text-fg-secondary px-3 py-1 rounded-full bg-surface border border-line-strong shadow-xs">
      {label}
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-violet/20 to-transparent" />
  </div>
);

const groupMessagesByDate = (messages) => {
  const groups = {};
  messages.forEach((msg) => {
    const dateKey = new Date(msg.timestamp).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
  });
  return groups;
};

const MessageList = ({
  messages = [],
  isTyping = false,
  typingUser = "",
  currentUserId = "",
  isLoading = false,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <SkeletonLoader type="message" count={6} />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <ScrollReveal
        animation="fade-up"
        distance="20px"
        className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-line-strong flex items-center justify-center">
          <svg className="w-8 h-8 text-primary-text/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-fg-secondary">No messages yet</p>
          <p className="text-xs text-fg-muted mt-1">Start the conversation below</p>
        </div>
      </ScrollReveal>
    );
  }

  const groups = groupMessagesByDate(messages);

  return (
    <div
      className="flex-1 overflow-y-auto py-2"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {Object.entries(groups).map(([dateKey, msgs]) => {
        return (
          <div key={dateKey}>
            <DateSeparator label={formatDateLabel(dateKey)} />
            {msgs.map((msg, idx) => {
              const prevMsg = idx > 0 ? msgs[idx - 1] : null;
              const showAvatar =
                !msg.isOwn &&
                (!prevMsg || prevMsg.senderId !== msg.senderId);
              return (
                <MessageBubble
                  key={msg.id || idx}
                  message={{
                    ...msg,
                    isOwn: msg.senderId === currentUserId,
                  }}
                  showAvatar={showAvatar}
                />
              );
            })}
          </div>
        );
      })}

      {isTyping && <TypingIndicator name={typingUser} />}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
