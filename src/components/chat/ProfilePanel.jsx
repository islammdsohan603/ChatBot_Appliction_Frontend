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
  { id: 1, bg: "from-violet-500/30 to-violet-600/30" },
  { id: 2, bg: "from-cyan-500/30 to-blue-600/30" },
  { id: 3, bg: "from-pink-500/30 to-rose-600/30" },
  { id: 4, bg: "from-amber-500/30 to-orange-600/30" },
  { id: 5, bg: "from-emerald-500/30 to-teal-600/30" },
  { id: 6, bg: "from-indigo-500/30 to-violet-600/30" },
];

const ProfilePanel = ({ contact = {}, isOpen, onClose }) => {
  const { name = "Unknown", userName = "", status = "offline", avatar = null, about = "" } = contact;

  return (
    <>
      {/* Backdrop (mobile/tablet) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 xl:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        className={`
          flex flex-col h-full bg-white/95 dark:bg-[#0d1230] border-l border-violet-500/10
          transition-all duration-300 ease-in-out overflow-y-auto no-scrollbar
          xl:w-72 xl:relative xl:translate-x-0
          fixed right-0 top-0 bottom-0 w-80 z-30
          ${isOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}
          ${!isOpen ? "xl:hidden" : ""}
        `}
        aria-label="Contact information panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-violet-500/10 shrink-0">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Contact Info</h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-violet-500/10 transition-all"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3 px-4 py-6 border-b border-violet-500/10">
          <UserAvatar name={name} src={avatar} size="2xl" online={status === "online"} />
          <div className="text-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{name}</h3>
            {userName && (
              <p className="text-xs text-violet-600 dark:text-violet-400/80 mt-0.5">@{userName}</p>
            )}
            <div className="mt-2">
              <UserStatus status={status} />
            </div>
          </div>
        </div>

        {/* About */}
        {about && (
          <div className="px-4 py-4 border-b border-violet-500/10">
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">About</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{about}</p>
          </div>
        )}

        {/* Shared Media */}
        <div className="px-4 py-4 border-b border-violet-500/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <HiOutlinePhoto className="w-3.5 h-3.5" />
              Shared Media
            </h4>
            <button className="text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
              See all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MOCK_MEDIA.map((item) => (
              <div
                key={item.id}
                className={`aspect-square rounded-lg bg-gradient-to-br ${item.bg} border border-violet-500/10 hover:scale-[1.03] transition-transform cursor-pointer`}
              />
            ))}
          </div>
        </div>

        {/* Files / Links */}
        <div className="px-4 py-4 border-b border-violet-500/10">
          <div className="flex gap-2">
            <button className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-violet-500/5 dark:bg-violet-500/8 border border-violet-500/15 text-xs text-slate-700 dark:text-slate-300 hover:bg-violet-500/15 transition-all">
              <HiOutlineDocument className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              Files
            </button>
            <button className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/8 border border-cyan-500/15 text-xs text-slate-700 dark:text-slate-300 hover:bg-cyan-500/15 transition-all">
              <HiOutlineLink className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Links
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-4 flex flex-col gap-2">
          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Actions</h4>
          {[
            { icon: <HiOutlineBellSlash className="w-4 h-4" />, label: "Mute notifications", color: "text-slate-700 dark:text-slate-300" },
            { icon: <HiOutlineMagnifyingGlass className="w-4 h-4" />, label: "Search in conversation", color: "text-slate-700 dark:text-slate-300" },
            { icon: <HiOutlineNoSymbol className="w-4 h-4" />, label: "Block user", color: "text-red-500 dark:text-red-400" },
            { icon: <HiOutlineFlag className="w-4 h-4" />, label: "Report", color: "text-red-500 dark:text-red-400" },
          ].map((action) => (
            <button
              key={action.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-500/8 border border-transparent hover:border-violet-500/10 transition-all text-sm ${action.color}`}
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
