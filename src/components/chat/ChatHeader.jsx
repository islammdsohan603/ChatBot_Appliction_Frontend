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
    <header className="flex items-center gap-3 px-4 py-3 border-b border-line bg-surface/80 backdrop-blur-sm shrink-0 transition-colors">
      {/* Back button (mobile) */}
      {showBack && (
        <button
          onClick={onBack}
          aria-label="Back to conversations"
          className="p-2 rounded-xl text-fg-secondary hover:text-primary-text hover:bg-primary/10 transition-all md:hidden shrink-0"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* User info — clickable to open profile panel */}
      <button
        onClick={onProfileToggle}
        className="flex items-center gap-3 flex-1 min-w-0 text-left rounded-xl p-1 -m-1 hover:bg-primary/5 transition-colors"
      >
        <UserAvatar name={name} src={avatar} size="md" online={status === "online"} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-fg truncate">{name}</p>
          <UserStatus status={status} />
        </div>
      </button>

      {/* Action icons */}
      <div className="flex items-center gap-1 shrink-0">
        <ThemeToggle className="!p-1.5 !rounded-xl" />
        <button
          aria-label="Voice call"
          className="p-2.5 rounded-xl text-fg-muted hover:text-primary-text hover:bg-primary/10 transition-all hidden sm:flex"
        >
          <HiOutlinePhone className="w-5 h-5" />
        </button>
        <button
          aria-label="Video call"
          className="p-2.5 rounded-xl text-fg-muted hover:text-accent-text hover:bg-accent/10 transition-all hidden sm:flex"
        >
          <HiOutlineVideoCamera className="w-5 h-5" />
        </button>
        <button
          aria-label="Search messages"
          className="p-2.5 rounded-xl text-fg-muted hover:text-fg hover:bg-primary/10 transition-all"
        >
          <HiOutlineMagnifyingGlass className="w-5 h-5" />
        </button>
        <button
          onClick={onProfileToggle}
          aria-label="Contact info"
          className="p-2.5 rounded-xl text-fg-muted hover:text-primary-text hover:bg-primary/10 transition-all"
        >
          <HiOutlineInformationCircle className="w-5 h-5" />
        </button>
        <button
          aria-label="More options"
          className="p-2.5 rounded-xl text-fg-muted hover:text-fg hover:bg-primary/10 transition-all"
        >
          <HiOutlineEllipsisVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
