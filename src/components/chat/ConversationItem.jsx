import { useState } from "react";
import UserAvatar from "../ui/UserAvatar";
import { HiOutlineChatBubbleLeftRight, HiOutlineTrash, HiOutlinePencilSquare } from "react-icons/hi2";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const ConversationItem = ({
  conversation,
  isActive = false,
  onClick,
  onDelete,
  onRename,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const id = conversation._id || conversation.id;
  const title = conversation.title || conversation.name || "Untitled Chat";
  const lastMessage = conversation.lastMessage || "No messages yet";
  const timestamp = conversation.updatedAt || conversation.createdAt || conversation.timestamp;
  const isAi = conversation.isAi !== false; // Default true for AI sessions unless specified

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!isAi || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete?.(id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editTitle.trim() || editTitle === title) {
      setIsEditing(false);
      return;
    }
    await onRename?.(id, editTitle);
    setIsEditing(false);
  };

  return (
    <div
      onClick={() => {
        if (!isEditing) onClick?.();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!isEditing && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
        isActive
          ? "bg-violet-500/20 border border-violet-500/40 text-violet-900 dark:text-white font-medium shadow-[0_2px_12px_rgba(139,92,246,0.15)]"
          : "hover:bg-violet-500/8 border border-transparent hover:border-violet-500/15 text-slate-700 dark:text-slate-300"
      }`}
      aria-selected={isActive}
    >
      {/* Active accent pill */}
      {isActive && (
        <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-gradient-to-b from-violet-500 to-cyan-400" />
      )}

      {/* Avatar / Icon */}
      {conversation.avatar || !isAi ? (
        <UserAvatar
          name={title}
          src={conversation.avatar}
          size="sm"
          online={conversation.status === "online"}
        />
      ) : (
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isActive
              ? "bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-500/30"
              : "bg-violet-500/10 text-violet-600 dark:text-violet-300 group-hover:bg-violet-500/15"
          }`}
        >
          <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center justify-between mb-0.5">
          {isEditing ? (
            <form onSubmit={handleRenameSubmit} className="flex-1 mr-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleRenameSubmit}
                autoFocus
                className="w-full bg-white dark:bg-black/20 border border-violet-500/30 rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-violet-500/60"
              />
            </form>
          ) : (
            <span
              className={`text-xs sm:text-sm font-semibold truncate ${
                isActive
                  ? "text-violet-900 dark:text-white"
                  : "text-slate-800 dark:text-slate-200 group-hover:text-violet-700 dark:group-hover:text-white"
              }`}
            >
              {title}
            </span>
          )}
          {!isEditing && (
            <span
              className={`text-[10px] shrink-0 ml-1.5 transition-opacity ${
                isActive
                  ? "text-violet-600 dark:text-violet-300 font-semibold"
                  : "text-slate-400 dark:text-slate-500 group-hover:opacity-60"
              }`}
            >
              {formatTime(timestamp)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-1">
          <p className="text-[11px] truncate text-slate-500 dark:text-slate-400 flex-1">
            {lastMessage}
          </p>
        </div>
      </div>

      {/* Action buttons (visible on group-hover or active for AI conversations only) */}
      {isAi && !isEditing && (
        <div className="opacity-0 group-hover:opacity-100 flex items-center shrink-0 transition-opacity">
          {onRename && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditTitle(title);
                setIsEditing(true);
              }}
              title="Rename conversation"
              className="p-1.5 rounded-lg text-slate-400 hover:text-violet-500 hover:bg-violet-500/10 transition-all cursor-pointer"
            >
              <HiOutlinePencilSquare className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete conversation"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <HiOutlineTrash className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationItem;
