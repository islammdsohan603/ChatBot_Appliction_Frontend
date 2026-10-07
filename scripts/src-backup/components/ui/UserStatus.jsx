/**
 * UserStatus — Displays online/offline/away status text badge.
 *
 * Props:
 *  - status: 'online' | 'offline' | 'away' | 'busy'
 *  - showDot: boolean (default true)
 *  - className: string
 */
const statusConfig = {
  online: {
    dot: "bg-green-500",
    text: "text-green-400",
    label: "Online",
  },
  offline: {
    dot: "bg-slate-500",
    text: "text-slate-400",
    label: "Offline",
  },
  away: {
    dot: "bg-amber-500",
    text: "text-amber-400",
    label: "Away",
  },
  busy: {
    dot: "bg-red-500",
    text: "text-red-400",
    label: "Busy",
  },
};

const UserStatus = ({ status = "offline", showDot = true, className = "" }) => {
  const config = statusConfig[status] || statusConfig.offline;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {showDot && (
        <span
          className={`inline-block w-2 h-2 rounded-full ${config.dot} ${status === "online" ? "animate-pulse" : ""}`}
          role="status"
          aria-label={config.label}
        />
      )}
      <span className={`text-xs font-medium ${config.text}`}>
        {config.label}
      </span>
    </span>
  );
};

export default UserStatus;
