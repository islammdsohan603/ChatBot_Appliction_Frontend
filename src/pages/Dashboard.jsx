import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiMessageSquare,
  FiCpu,
  FiDatabase,
  FiZap,
  FiTrendingUp,
  FiTrash2,
  FiArrowUpRight,
  FiPlus,
  FiClock,
  FiShield,
  FiSettings,
  FiRefreshCw,
} from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorState } from "../components/common/ErrorState";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000";

const QUICK_PROMPTS = [
  {
    title: "Debug Async Code",
    desc: "Find race conditions and memory leaks in Node.js streams",
    prompt: "Here is my asynchronous Node.js function. Please review for potential race conditions and suggest optimizations:",
  },
  {
    title: "Architecture Review",
    desc: "Evaluate database schema and indexing strategy",
    prompt: "Review the following MongoDB schema and recommend compound indexes for query efficiency:",
  },
  {
    title: "Tailwind UI Polish",
    desc: "Generate clean responsive layout classes",
    prompt: "Create a modern responsive dashboard layout using Tailwind CSS with dark mode support:",
  },
  {
    title: "API Endpoint Doc",
    desc: "Auto-generate OpenAPI and curl specification",
    prompt: "Generate an OpenAPI 3.0 specification and sample curl command for this Express route:",
  },
];

/**
 * User Dashboard Page Component
 */
export const Dashboard = () => {
  const { isAuthenticated, userData } = useSelector((s) => s.user);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, activityRes] = await Promise.all([
        axios.get(`${SERVER_URL}/api/dashboard/stats`, { withCredentials: true }),
        axios.get(`${SERVER_URL}/api/dashboard/activity`, { withCredentials: true }),
      ]);

      if (statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }
      if (activityRes.data?.activity) {
        setActivity(activityRes.data.activity);
      }
    } catch (err) {
      console.warn("Dashboard fetch error:", err);
      setError("Unable to load real-time dashboard analytics. Please verify your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const handleDeleteConversation = async (convId, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this session?")) return;
    setIsDeleting(convId);
    try {
      await axios.delete(`${SERVER_URL}/api/conversations/${convId}`, {
        withCredentials: true,
      });
      setStats((prev) => ({
        ...prev,
        recentConversations: prev.recentConversations.filter((c) => (c._id || c.id) !== convId),
        totalConversations: Math.max(0, (prev?.totalConversations || 1) - 1),
      }));
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleLaunchPrompt = (promptText) => {
    navigate("/chat", { state: { prefilledPrompt: promptText } });
  };

  const currentUser = stats?.user || userData?.user || userData || {};
  const tier = stats?.subscriptionTier || currentUser?.subscriptionTier || "free";

  return (
    <PageLayout
      title="User Dashboard & Analytics"
      description="Monitor chat metrics, model tokens, recent sessions, and storage in your Nexora AI dashboard."
    >
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ══════════════════════════════════════════════
            TOP WELCOME & TIER BANNER
            ══════════════════════════════════════════════ */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Welcome back, {currentUser.name || currentUser.userName || "Developer"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  {tier.toUpperCase()} TIER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {currentUser.email} • Connected to Gemini 3.8 Flash Cluster
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              to="/chat"
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              New Conversation
            </Link>
            <Link
              to="/settings"
              className="p-2.5 rounded-xl border border-violet-500/20 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-violet-500/10 transition-colors"
              title="Account Settings"
            >
              <FiSettings className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl border border-violet-500/20 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-violet-500/10 transition-colors cursor-pointer"
              title="Refresh Stats"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner label="Loading dashboard metrics & recent history..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchDashboardData} />
        ) : (
          <>
            {/* ══════════════════════════════════════════════
                4-CARD KPI METRICS GRID
                ══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Total Conversations
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <FiMessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {stats?.totalConversations || 0}
                </p>
                <p className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3" />
                  Active thread sessions
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Total Messages
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <FiZap className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {stats?.totalMessages || 0}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Prompts + Streamed replies
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Estimated Tokens
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                    <FiCpu className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {stats?.estimatedTokens ? Number(stats.estimatedTokens).toLocaleString() : "0"}
                </p>
                <p className="text-[11px] text-violet-500 font-medium mt-1">
                  Gemini 3.8 Flash quota
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Storage Allocated
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <FiDatabase className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {stats?.estimatedStorageMb || "0 MB"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  MongoDB Atlas encrypted
                </p>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                7-DAY ACTIVITY CHART & QUICK LAUNCHERS
                ══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              {/* Activity Bar Visualization */}
              <div className="lg:col-span-2 p-7 rounded-3xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      7-Day Message Activity
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Daily conversational message volume
                    </p>
                  </div>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                    Last 7 Days
                  </span>
                </div>

                <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2">
                  {activity.length === 0 ? (
                    <div className="w-full text-center text-xs text-slate-400 self-center">
                      No activity recorded for this period yet.
                    </div>
                  ) : (
                    activity.map((item, idx) => {
                      const maxMsgs = Math.max(...activity.map((a) => a.messages), 10);
                      const heightPercent = Math.min(100, Math.max(12, (item.messages / maxMsgs) * 100));

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                          <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.messages}
                          </span>
                          <div className="w-full max-w-[42px] bg-violet-500/15 group-hover:bg-violet-500/30 rounded-t-xl h-36 flex items-end p-1 transition-all">
                            <div
                              className="w-full rounded-lg bg-gradient-to-t from-violet-600 to-cyan-500 transition-all duration-500"
                              style={{ height: `${heightPercent}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {item.day}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Quick Prompt Launchers */}
              <div className="p-7 rounded-3xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Quick AI Launchers
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Pre-configured starter prompts
                  </p>

                  <div className="space-y-2.5">
                    {QUICK_PROMPTS.map((qp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLaunchPrompt(qp.prompt)}
                        className="w-full p-3 rounded-xl text-left bg-slate-50 dark:bg-[#111840] border border-violet-500/10 hover:border-violet-500/40 hover:shadow-xs transition-all text-xs cursor-pointer group"
                      >
                        <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 flex items-center justify-between">
                          <span>{qp.title}</span>
                          <FiArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {qp.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <Link
                  to="/docs"
                  className="mt-4 pt-3 border-t border-violet-500/10 text-xs text-center text-violet-600 dark:text-violet-400 font-semibold hover:underline block"
                >
                  View Developer Guides & Examples →
                </Link>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                RECENT CHAT SESSIONS TABLE
                ══════════════════════════════════════════════ */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Recent Chat Sessions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Jump right back into active conversations
                  </p>
                </div>
                <Link
                  to="/chat"
                  className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  Open Chatbox →
                </Link>
              </div>

              {!stats?.recentConversations || stats.recentConversations.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-violet-500/20 rounded-2xl">
                  <p className="text-xs text-slate-500">No conversations created yet.</p>
                  <Link
                    to="/chat"
                    className="mt-3 inline-block px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
                  >
                    Start First Chat
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-violet-500/10">
                  {stats.recentConversations.map((conv) => {
                    const id = conv._id || conv.id;
                    const dateFormatted = new Date(conv.updatedAt || conv.createdAt).toLocaleString(
                      "en-US",
                      { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                    );

                    return (
                      <div
                        key={id}
                        onClick={() => navigate(`/chat/${id}`)}
                        className="py-3.5 px-3 rounded-xl hover:bg-violet-500/5 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                            <FiMessageSquare className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                              {conv.title || "Untitled Session"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md mt-0.5">
                              {conv.lastMessage || "No messages"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 text-xs">
                          <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {dateFormatted}
                          </span>
                          <button
                            type="button"
                            disabled={isDeleting === id}
                            onClick={(e) => handleDeleteConversation(id, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Conversation"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
