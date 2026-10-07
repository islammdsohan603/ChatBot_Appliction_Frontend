/**
 * ChatSidebar — Left sidebar with NEXORA logo, search, "+ New Chat" button, and conversation list.
 *
 * Props:
 *  - user: { userName, email } from Redux
 *  - conversations: array
 *  - activeId: string
 *  - onSelect: (id) => void
 *  - onNewChat: () => void
 *  - onDelete: (id) => void
 *  - onLogout: () => void
 *  - isLoading: boolean
 *  - isOpen: boolean (mobile drawer state)
 *  - onClose: () => void
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../ui/UserAvatar";
import UserStatus from "../ui/UserStatus";
import ThemeToggle from "../ui/ThemeToggle";
import ConversationList from "./ConversationList";
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineXMark,
  HiOutlineBell,
  HiOutlinePlus,
} from "react-icons/hi2";

const TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "groups", label: "Direct" },
];

/* ── NEXORA Logo Mark ── */
const NexoraLogo = () => (
  <Link
    to="/"
    aria-label="Go to home page"
    className="flex items-center gap-3 group cursor-pointer"
  >
    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_4px_16px_rgba(139,92,246,0.35)] group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300">
      <div className="absolute -inset-0.5 rounded-[14px] bg-gradient-to-br from-violet-500/50 to-cyan-500/50 -z-[1] blur-[6px] group-hover:blur-[8px] transition-all" />
      <svg
        className="w-5 h-5 text-white group-hover:rotate-6 transition-transform duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
    <span className="text-xl font-extrabold bg-gradient-to-br from-indigo-200 via-violet-300 to-cyan-300 bg-clip-text text-transparent tracking-tight group-hover:from-white group-hover:to-cyan-200 transition-all">
      NEXORA
    </span>
  </Link>
);

const ChatSidebar = ({
  user = {},
  conversations = [],
  activeId = null,
  onSelect,
  onNewChat,
  onDelete,
  onRename,
  onLogout,
  isLoading = false,
  isOpen = true,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredConversations = conversations.filter((c) => {
    const title = c.title || c.name || "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          flex flex-col h-full max-h-screen min-h-0 bg-white/95 dark:bg-[#0a0f2a] border-r border-violet-500/10
          transition-all duration-300 ease-in-out overflow-hidden
          md:relative md:translate-x-0 md:w-72 lg:w-80
          fixed left-0 top-0 bottom-0 w-[300px] z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Chat sidebar"
      >
        {/* Top: Logo + close (mobile) */}
        <div className="flex items-center justify-between px-4 py-4 shrink-0">
          <NexoraLogo />
          <div className="flex items-center gap-1">
            <button
              onClick={onNewChat}
              aria-label="New Chat"
              title="Start a new chat"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400/70 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-violet-500/10 transition-all cursor-pointer"
            >
              <HiOutlinePencilSquare className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400/70 hover:text-slate-900 dark:hover:text-white hover:bg-violet-500/10 transition-all md:hidden cursor-pointer"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current user card */}
        <div className="mx-3 mb-2.5 px-3 py-3 rounded-xl bg-violet-500/5 dark:bg-violet-500/8 border border-violet-500/15 flex items-center gap-3 shrink-0">
          <UserAvatar
            name={user.name || user.userName || user.email || "?"}
            src={user.image}
            size="sm"
            online
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {user.name || user.userName || "You"}
            </p>
            <UserStatus status="online" />
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle className="!p-1.5 !rounded-lg" />
            <button
              aria-label="Notifications"
              className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-violet-500/10 transition-all cursor-pointer"
            >
              <HiOutlineBell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prominent "+ New Chat" Button */}
        <div className="px-3 mb-3 shrink-0">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600/15 via-violet-500/20 to-cyan-500/15 hover:from-violet-600/25 hover:to-cyan-500/25 border border-violet-500/30 text-violet-700 dark:text-violet-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] active:scale-98"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 mb-3 shrink-0">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              aria-label="Search conversations"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-[#111840] border border-violet-300/40 dark:border-violet-500/15 text-xs sm:text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500/60 outline-none focus:border-violet-500/40 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 px-3 mb-2 shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-violet-500/15 dark:bg-violet-500/20 border border-violet-500/30 text-violet-700 dark:text-violet-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400/70 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-violet-500/8"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Section label */}
        <div className="px-5 mb-1 shrink-0 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {activeTab === "groups" ? "Direct Users" : "Conversations"}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {filteredConversations.length}
          </span>
        </div>

        {/* Conversation list — scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <ConversationList
            conversations={filteredConversations}
            activeId={activeId}
            onSelect={onSelect}
            onDelete={onDelete}
            onRename={onRename}
            isLoading={isLoading}
            filter={activeTab}
          />
        </div>

        {/* Bottom nav */}
        <div className="shrink-0 border-t border-violet-500/10 px-3 py-2.5 flex items-center justify-between bg-white/40 dark:bg-[#0a0f2a]/60">
          <Link
            to="/profile"
            aria-label="Profile"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400/70 hover:text-violet-700 dark:hover:text-white hover:bg-violet-500/10 transition-all text-xs font-medium"
          >
            <HiOutlineUser className="w-5 h-5" />
            <span className="hidden lg:block">Profile</span>
          </Link>
          <Link
            to="/settings"
            aria-label="Settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400/70 hover:text-violet-700 dark:hover:text-white hover:bg-violet-500/10 transition-all text-xs font-medium"
          >
            <HiOutlineCog6Tooth className="w-5 h-5" />
            <span className="hidden lg:block">Settings</span>
          </Link>
          <button
            onClick={onLogout}
            aria-label="Log out"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400/70 hover:text-red-500 hover:bg-red-500/10 transition-all text-xs font-medium cursor-pointer"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
