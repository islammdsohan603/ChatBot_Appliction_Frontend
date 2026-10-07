/**
 * Profile — Full user profile page for authenticated users.
 * Uses Redux userData from state.user.
 */
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api";
import { clearUser } from "../../redux/userSlice";
import UserAvatar from "../components/ui/UserAvatar";
import ThemeToggle from "../components/ui/ThemeToggle";
import {
  HiOutlineArrowLeft,
  HiOutlinePencilSquare,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineGlobeAlt,
  HiOutlineUser,
} from "react-icons/hi2";
import { useState } from "react";
import { EditProfile } from "../components/models/EditProfile";
import { Reveal, CountUp } from "../components/motion";
import { motion } from "framer-motion";
import { buttonMotion } from "../lib/motion";

/* ── Stats row ── */
const StatItem = ({ value, label }) => {
  const num = parseInt(value, 10);
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4">
      <span className="text-2xl font-extrabold text-gradient text-transparent">
        {isNaN(num) ? value : <CountUp end={num} />}
      </span>
      <span className="text-xs text-fg-muted font-medium">{label}</span>
    </div>
  );
};

/* ── Info row ── */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-primary/5 transition-colors">
    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-line-strong flex items-center justify-center text-primary-text shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-fg truncate mt-0.5">{value || "—"}</p>
    </div>
  </div>
);

/* ── Section card ── */
const Card = ({ title, children, className = "" }) => (
  <div
    className={`glass rounded-2xl border border-line-strong overflow-hidden ${className}`}
  >
    {title && (
      <div className="px-5 py-4 border-b border-line">
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
      </div>
    )}
    <div>{children}</div>
  </div>
);

/* ── Quick action button ── */
const ActionButton = ({ icon, label, href, onClick, variant = "default" }) => {
  const base =
    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium w-full text-left";
  const variants = {
    default: "text-fg-secondary hover:bg-primary/10 hover:text-primary-text",
    danger: "text-error-text hover:bg-error/10 hover:text-error-text",
  };

  const cls = `${base} ${variants[variant]}`;

  if (href) {
    return (
      <Link to={href} className={cls}>
        <span className="text-fg-muted">{icon}</span>
        {label}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls}>
      <span
        className={variant === "danger" ? "text-error-text" : "text-fg-muted"}
      >
        {icon}
      </span>
      {label}
    </button>
  );
};

/* ═══════════════════════════════════════════
   Profile Page
   ═══════════════════════════════════════════ */
const Profile = () => {
  const { userData, isLoading } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [models,setIsModels]=useState(false)

  const user = userData?.user || userData || {};
  const { userName, email, name } = user;
  const displayName = name || userName || "User";

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
    } catch {
      // Ignore and logout anyway
    }
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {
      // ignore
    }
    dispatch(clearUser());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas font-inter text-fg transition-colors duration-200">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgb(var(--primary-rgb)/0.8) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 dark:opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgb(var(--accent-rgb)/0.8) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Top nav */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-xl border-b border-line">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/chat"
            className="flex items-center gap-2 text-sm text-fg-secondary hover:text-primary-text transition-colors"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to Chat</span>
          </Link>
          <h1 className="text-sm font-bold text-fg">My Profile</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle className="!p-1.5 !rounded-xl" />
            <button
              onClick={() => setIsModels(true)}
              aria-label="Edit profile"
              className="p-2 cursor-pointer rounded-xl text-fg-secondary hover:text-primary-text hover:bg-primary/10 transition-all"
            >
              <HiOutlinePencilSquare className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-4xl mx-auto px-4 py-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column: avatar + basic info ── */}
          <Reveal
            animation="fade-up"
            delay={0.06}
            distance="28px"
            className="lg:col-span-1 flex flex-col gap-5"
          >
            {/* Profile card */}
            <Card>
              <div className="flex flex-col items-center gap-4 px-6 py-8">
                {/* Avatar with edit overlay */}
                <div className="relative group cursor-pointer" onClick={() => setIsModels(true)}>
                  <UserAvatar name={displayName} src={user.image} size="2xl" online />
                  <div className="absolute inset-0 rounded-full bg-scrim/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <HiOutlinePencilSquare className="w-6 h-6 text-primary-contrast" />
                  </div>
                </div>

                {/* Name & username */}
                <div className="text-center">
                  <h2 className="text-xl font-extrabold text-fg">
                    {displayName}
                  </h2>
                  {userName && (
                    <p className="text-sm text-primary-text mt-0.5">
                      @{userName}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <p className="text-xs text-fg-secondary text-center leading-relaxed">
                  {user.bio || "Building the future of real-time communication 💜"}
                </p>

                {/* Online indicator */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/25">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-medium text-success-text">
                    Online now
                  </span>
                </div>

                {/* Edit profile button */}
                <button 
                  onClick={() => setIsModels(true)}
                  className="w-full py-2.5 rounded-xl border border-line-strong text-sm font-semibold text-primary-text hover:bg-primary/10 hover:border-primary transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                  <HiOutlinePencilSquare className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              {/* Stats */}
              <div className="border-t border-line grid grid-cols-3 divide-x divide-line">
                <StatItem value="248" label="Messages" />
                <StatItem value="12" label="Contacts" />
                <StatItem value="3" label="Groups" />
              </div>
            </Card>

            {/* Quick actions */}
            <Card title="Quick Actions">
              <div className="px-2 py-2 flex flex-col gap-0.5">
                <ActionButton
                  icon={<HiOutlineChatBubbleLeftRight className="w-4 h-4" />}
                  label="Open Chat"
                  href="/chat"
                />
                <ActionButton
                  icon={<HiOutlineBell className="w-4 h-4" />}
                  label="Notification Settings"
                  href="/settings"
                />
                <ActionButton
                  icon={<HiOutlineCog6Tooth className="w-4 h-4" />}
                  label="Account Settings"
                  href="/settings"
                />
                <ActionButton
                  icon={<HiOutlineArrowRightOnRectangle className="w-4 h-4" />}
                  label="Log Out"
                  onClick={handleLogout}
                  variant="danger"
                />
              </div>
            </Card>
          </Reveal>

          {/* ── Right column: account info + activity ── */}
          <Reveal
            animation="fade-up"
            delay={0.14}
            distance="32px"
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Account information */}
            <Card title="Account Information">
              <div className="px-2 py-2">
                <InfoRow
                  icon={<HiOutlineUser className="w-4 h-4" />}
                  label="Display Name"
                  value={displayName}
                />
                <InfoRow
                  icon={<HiOutlineUser className="w-4 h-4" />}
                  label="Username"
                  value={userName ? `@${userName}` : undefined}
                />
                <InfoRow
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  }
                  label="Email Address"
                  value={email}
                />
                <InfoRow
                  icon={<HiOutlineGlobeAlt className="w-4 h-4" />}
                  label="Member Since"
                  value="September 2026"
                />
              </div>
            </Card>

            {/* Security */}
            <Card title="Security">
              <div className="px-2 py-2">
                <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success-text shrink-0">
                    <HiOutlineShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-fg">
                      Account is Secure
                    </p>
                    <p className="text-xs text-fg-muted mt-0.5">
                      JWT authentication active · Password encrypted
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-success/10 border border-success/25 text-[10px] font-semibold text-success-text">
                    Active
                  </div>
                </div>
                <div className="px-4 py-3 mx-2 mb-2 rounded-xl bg-primary/5 border border-line">
                  <p className="text-xs text-fg-secondary">
                    Your password is encrypted using bcryptjs. Sessions are
                    managed with secure httpOnly cookies that expire in 7 days.
                  </p>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card title="Recent Activity">
              <div className="px-4 py-3">
                {[
                  {
                    action: "Sent a message",
                    target: "Alex Morgan",
                    time: "2 minutes ago",
                    icon: "💬",
                  },
                  {
                    action: "Joined group",
                    target: "Design Team",
                    time: "1 hour ago",
                    icon: "👥",
                  },
                  {
                    action: "Logged in",
                    target: "from Chrome · Windows",
                    time: "3 hours ago",
                    icon: "🔐",
                  },
                  {
                    action: "Account created",
                    target: "Welcome to NEXORA!",
                    time: "September 2026",
                    icon: "🎉",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 py-3 ${i < 3 ? "border-b border-line" : ""}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-sm shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-fg">
                        <span className="font-medium">{item.action}</span>{" "}
                        <span className="text-primary-text">
                          {item.target}
                        </span>
                      </p>
                      <p className="text-xs text-fg-muted mt-0.5">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <EditProfile isOpen={models} onClose={() => setIsModels(false)} />
    </div>
  );
};

export default Profile;
