/**
 * ChatHeader — Top bar of the chat area.
 *
 * Props:
 *  - contact: { name, userName, status, avatar }
 *  - onProfileToggle: () => void
 *  - onBack: () => void (mobile back button)
 *  - showBack: boolean
 */
import UserAvatar from "../ui/UserAvatar";
import UserStatus from "../ui/UserStatus";
import ThemeToggle from "../ui/ThemeToggle";
import {
  HiOutlinePhone,
  HiOutlineVideoCamera,
  HiOutlineMagnifyingGlass,
  HiOutlineEllipsisVertical,
  HiOutlineArrowLeft,
  HiOutlineInformationCircle,
} from "react-icons/hi2";

const ChatHeader = ({
  contact = {},
  onProfileToggle,
  onBack,
  showBack = false,
}) => {
  const { name = "Select a chat", status = "offline", avatar = null } = contact;

  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-violet-500/10 bg-white/80 dark:bg-[#0d1230]/80 backdrop-blur-sm shrink-0 transition-colors">
      {/* Back button (mobile) */}
      {showBack && (
        <button
          onClick={onBack}
          aria-label="Back to conversations"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-white hover:bg-violet-500/10 transition-all md:hidden shrink-0"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* User info — clickable to open profile panel */}
      <button
        onClick={onProfileToggle}
        className="flex items-center gap-3 flex-1 min-w-0 text-left rounded-xl p-1 -m-1 hover:bg-violet-500/5 transition-colors"
      >
        <UserAvatar name={name} src={avatar} size="md" online={status === "online"} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{name}</p>
          <UserStatus status={status} />
        </div>
      </button>

      {/* Action icons */}
      <div className="flex items-center gap-1 shrink-0">
        <ThemeToggle className="!p-1.5 !rounded-xl" />
        <button
          aria-label="Voice call"
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400/70 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-violet-500/10 transition-all hidden sm:flex"
        >
          <HiOutlinePhone className="w-5 h-5" />
        </button>
        <button
          aria-label="Video call"
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400/70 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/10 transition-all hidden sm:flex"
        >
          <HiOutlineVideoCamera className="w-5 h-5" />
        </button>
        <button
          aria-label="Search messages"
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400/70 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-violet-500/10 transition-all"
        >
          <HiOutlineMagnifyingGlass className="w-5 h-5" />
        </button>
        <button
          onClick={onProfileToggle}
          aria-label="Contact info"
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400/70 hover:text-violet-600 dark:hover:text-violet-300 hover:bg-violet-500/10 transition-all"
        >
          <HiOutlineInformationCircle className="w-5 h-5" />
        </button>
        <button
          aria-label="More options"
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400/70 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-violet-500/10 transition-all"
        >
          <HiOutlineEllipsisVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
