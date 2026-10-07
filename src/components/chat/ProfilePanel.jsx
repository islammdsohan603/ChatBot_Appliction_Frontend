/**
 * ProfilePanel — Right panel showing contact information.
 * On mobile/tablet becomes a slide-in drawer.
 *
 * Props:
 *  - contact: { name, userName, status, avatar, about }
 *  - isOpen: boolean
 *  - onClose: () => void
 */
import UserAvatar from "../ui/UserAvatar";
import UserStatus from "../ui/UserStatus";
import {
  HiOutlineXMark,
  HiOutlineBellSlash,
  HiOutlineMagnifyingGlass,
  HiOutlineNoSymbol,
  HiOutlineFlag,
  HiOutlinePhoto,
  HiOutlineDocument,
  HiOutlineLink,
} from "react-icons/hi2";

const MOCK_MEDIA = [
  { id: 1, bg: "from-brand-violet/30 to-brand-violet/30" },
  { id: 2, bg: "from-brand-cyan/30 to-info/30" },
  { id: 3, bg: "from-brand-violet/30 to-error/30" },
  { id: 4, bg: "from-warning/30 to-warning/30" },
  { id: 5, bg: "from-success/30 to-brand-cyan/30" },
  { id: 6, bg: "from-brand-indigo/30 to-brand-violet/30" },
];

const ProfilePanel = ({ contact = {}, isOpen, onClose }) => {
  const { name = "Unknown", userName = "", status = "offline", avatar = null, about = "" } = contact;

  return (
    <>
      {/* Backdrop (mobile/tablet) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-scrim/40 backdrop-blur-sm z-20 xl:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        className={`
          flex flex-col h-full bg-surface/95 border-l border-line
          transition-all duration-300 ease-in-out overflow-y-auto no-scrollbar
          xl:w-72 xl:relative xl:translate-x-0
          fixed right-0 top-0 bottom-0 w-80 z-30
          ${isOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}
          ${!isOpen ? "xl:hidden" : ""}
        `}
        aria-label="Contact information panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-line shrink-0">
          <h2 className="text-sm font-semibold text-fg">Contact Info</h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-2 rounded-xl text-fg-muted hover:text-fg hover:bg-primary/10 transition-all"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3 px-4 py-6 border-b border-line">
          <UserAvatar name={name} src={avatar} size="2xl" online={status === "online"} />
          <div className="text-center">
            <h3 className="text-base font-bold text-fg">{name}</h3>
            {userName && (
              <p className="text-xs text-primary-text mt-0.5">@{userName}</p>
            )}
            <div className="mt-2">
              <UserStatus status={status} />
            </div>
          </div>
        </div>

        {/* About */}
        {about && (
          <div className="px-4 py-4 border-b border-line">
            <h4 className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider mb-2">About</h4>
            <p className="text-sm text-fg-secondary leading-relaxed">{about}</p>
          </div>
        )}

        {/* Shared Media */}
        <div className="px-4 py-4 border-b border-line">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider flex items-center gap-1.5">
              <HiOutlinePhoto className="w-3.5 h-3.5" />
              Shared Media
            </h4>
            <button className="text-[11px] text-primary-text hover:text-primary-text transition-colors">
              See all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MOCK_MEDIA.map((item) => (
              <div
                key={item.id}
                className={`aspect-square rounded-lg bg-gradient-to-br ${item.bg} border border-line hover:scale-[1.03] transition-transform cursor-pointer`}
              />
            ))}
          </div>
        </div>

        {/* Files / Links */}
        <div className="px-4 py-4 border-b border-line">
          <div className="flex gap-2">
            <button className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/5 border border-line text-xs text-fg-secondary hover:bg-primary/15 transition-all">
              <HiOutlineDocument className="w-4 h-4 text-primary-text" />
              Files
            </button>
            <button className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-accent/5 border border-accent/15 text-xs text-fg-secondary hover:bg-accent/15 transition-all">
              <HiOutlineLink className="w-4 h-4 text-accent-text" />
              Links
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-4 flex flex-col gap-2">
          <h4 className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider mb-1">Actions</h4>
          {[
            { icon: <HiOutlineBellSlash className="w-4 h-4" />, label: "Mute notifications", color: "text-fg-secondary" },
            { icon: <HiOutlineMagnifyingGlass className="w-4 h-4" />, label: "Search in conversation", color: "text-fg-secondary" },
            { icon: <HiOutlineNoSymbol className="w-4 h-4" />, label: "Block user", color: "text-error-text" },
            { icon: <HiOutlineFlag className="w-4 h-4" />, label: "Report", color: "text-error-text" },
          ].map((action) => (
            <button
              key={action.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/8 border border-transparent hover:border-line-strong transition-all text-sm ${action.color}`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default ProfilePanel;
