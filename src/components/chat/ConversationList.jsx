import ConversationItem from "./ConversationItem";
import SkeletonLoader from "../ui/SkeletonLoader";
import { motion, useReducedMotion } from "framer-motion";

const sidebarStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const sidebarItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Categorize conversations into temporal buckets: Today, Yesterday, Previous 7 Days, Older
 */
const groupConversationsByDate = (conversations) => {
  const groups = {
    today: [],
    yesterday: [],
    last7Days: [],
    older: [],
  };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const startOf7Days = startOfToday - 6 * 24 * 60 * 60 * 1000;

  conversations.forEach((conv) => {
    const time = new Date(conv.updatedAt || conv.createdAt || conv.timestamp || Date.now()).getTime();
    if (time >= startOfToday) {
      groups.today.push(conv);
    } else if (time >= startOfYesterday) {
      groups.yesterday.push(conv);
    } else if (time >= startOf7Days) {
      groups.last7Days.push(conv);
    } else {
      groups.older.push(conv);
    }
  });

  return [
    { label: "Today", items: groups.today },
    { label: "Yesterday", items: groups.yesterday },
    { label: "Previous 7 Days", items: groups.last7Days },
    { label: "Older", items: groups.older },
  ].filter((group) => group.items.length > 0);
};

const ConversationList = ({
  conversations = [],
  activeId = null,
  onSelect,
  onDelete,
  onRename,
  isLoading = false,
  filter = "all",
}) => {
  if (isLoading) {
    return <SkeletonLoader type="conversation" count={6} />;
  }

  const filtered = conversations.filter((c) => {
    if (filter === "unread") return (c.unread || 0) > 0;
    if (filter === "groups") return c.isGroup || !c.isAi;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-line-strong flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-primary-text/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-fg-secondary">
          {filter === "unread"
            ? "No unread messages"
            : filter === "groups"
            ? "No group or direct chats"
            : "No previous conversations"}
        </p>
        <p className="text-xs text-fg-muted mt-1">
          {filter === "all" ? "Type a message to start a new chat" : ""}
        </p>
      </div>
    );
  }

  const shouldReduceMotion = useReducedMotion();

  // If in "all" tab, group conversations by date (ChatGPT style)
  if (filter === "all") {
    const grouped = groupConversationsByDate(filtered);

    return (
      <motion.div
        variants={shouldReduceMotion ? undefined : sidebarStagger}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        className="flex flex-col gap-4 px-2 pb-4"
        role="listbox"
        aria-label="Conversations"
      >
        {grouped.map((group) => (
          <div key={group.label} className="space-y-1">
            <div className="px-2 pt-1 pb-0.5">
              <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider">
                {group.label}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((conversation) => {
                const id = conversation._id || conversation.id;
                return (
                  <motion.div
                    key={id}
                    variants={shouldReduceMotion ? undefined : sidebarItem}
                  >
                    <ConversationItem
                      conversation={conversation}
                      isActive={id === activeId}
                      onClick={() => onSelect?.(id)}
                      onDelete={onDelete}
                      onRename={onRename}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  // Linear list for other filter tabs
  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : sidebarStagger}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      className="flex flex-col gap-0.5 px-2"
      role="listbox"
      aria-label="Conversations"
    >
      {filtered.map((conversation) => {
        const id = conversation._id || conversation.id;
        return (
          <motion.div
            key={id}
            variants={shouldReduceMotion ? undefined : sidebarItem}
          >
            <ConversationItem
              conversation={conversation}
              isActive={id === activeId}
              onClick={() => onSelect?.(id)}
              onDelete={onDelete}
              onRename={onRename}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ConversationList;
