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
    dot: "bg-success",
    text: "text-success-text",
    label: "Online",
  },
  offline: {
    dot: "bg-fg-muted",
    text: "text-fg-muted",
    label: "Offline",
  },
  away: {
    dot: "bg-warning",
    text: "text-warning-text",
    label: "Away",
  },
  busy: {
    dot: "bg-error",
    text: "text-error-text",
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
