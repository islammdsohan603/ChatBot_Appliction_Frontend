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
  FiAward,
  FiCheck,
  FiSearch,
  FiEye,
  FiChevronRight,
  FiList,
} from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorState } from "../components/common/ErrorState";
import { Reveal, RevealGroup, RevealItem, CountUp } from "../components/motion";
import { motion } from "framer-motion";
import { buttonMotion, cardHoverMotion } from "../lib/motion";
import PreviousChatViewer from "../components/chat/PreviousChatViewer";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000";

const PLAN_CONFIG = {
  free: {
    title: "Free Starter Plan",
    slug: "free",
    badge: "Free Starter",
    badgeColor: "bg-fg-muted/10 text-fg-muted border-line-strong",
    price: "$0",
    billingCycle: "Forever Free",
    description: "Essential AI chat capabilities for casual users and beginners.",
    features: [
      "Access to Gemini 3.8 Flash model",
      "Up to 50 conversations per day",
      "Standard response streaming speeds",
      "Multimodal image analysis (up to 5MB)",
    ],
    limits: {
      messages: "50 / day",
      models: "Gemini 3.8 Flash",
      vision: "Up to 5MB",
      support: "Community Forum",
      export: "Disabled",
    },
    gradient: "from-fg-muted/5 via-brand-violet/5 to-transparent border-line",
    glowColor: "shadow-scrim/10",
  },
  pro: {
    title: "Pro Developer Plan",
    slug: "pro",
    badge: "Active Pro Plan",
    badgeColor: "bg-success/15 text-success-text border-success/30",
    price: "$19",
    billingCycle: "Monthly Billing",
    description: "Enhanced power, higher limits, and priority model availability for developers.",
    features: [
      "Unlimited AI conversations & messages",
      "Access to Gemini 3.8 Flash & Gemini 3.5 Pro",
      "Priority response queue during peak hours",
      "Unlimited image vision attachments",
      "Full conversation history export (JSON & Markdown)",
      "Direct Priority Support via Discord",
    ],
    limits: {
      messages: "Unlimited",
      models: "Gemini 3.8 Flash & 3.5 Pro",
      vision: "Unlimited Attachments",
      support: "Discord Priority Support",
      export: "JSON & Markdown",
    },
    gradient: "from-brand-violet/15 via-brand-indigo/10 to-success/15 border-primary/30",
    glowColor: "shadow-primary/20",
  },
  enterprise: {
    title: "Enterprise Studio Plan",
    slug: "enterprise",
    badge: "Enterprise VIP",
    badgeColor: "bg-accent/15 text-accent-text border-accent/30",
    price: "$79",
    billingCycle: "Monthly Billing",
    description: "Dedicated infrastructure, custom SLAs, and custom LLM tuning for organizations.",
    features: [
      "Everything in Pro included",
      "Dedicated high-throughput Gemini quota",
      "Custom system instructions & domain knowledge base",
      "Team collaboration & shared workspace channels",
      "Enterprise audit logs & SOC2 compliance docs",
      "24/7 dedicated support engineer",
    ],
    limits: {
      messages: "Unlimited VIP",
      models: "All Gemini Models + Dedicated Quota",
      vision: "Unlimited Attachments",
      support: "24/7 Dedicated Engineer",
      export: "Enterprise Audit Logs & History",
    },
    gradient: "from-brand-cyan/15 via-brand-violet/10 to-brand-indigo/15 border-accent/30",
    glowColor: "shadow-accent/20",
  },
};

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
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [sidebarCollapsedMobile, setSidebarCollapsedMobile] = useState(true);
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

  const fetchConversations = async () => {
    setConversationsLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/conversations`, {
        withCredentials: true,
      });
      if (Array.isArray(res.data)) {
        setConversations(res.data);
      }
    } catch (err) {
      console.warn("Dashboard conversations fetch error:", err);
    } finally {
      setConversationsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
    fetchConversations();
  }, [isAuthenticated, navigate]);

  const handleDeleteConversation = async (convId, e) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this session?")) return;
    setIsDeleting(convId);
    try {
      await axios.delete(`${SERVER_URL}/api/conversations/${convId}`, {
        withCredentials: true,
      });
      setConversations((prev) => prev.filter((c) => (c._id || c.id) !== convId));
      setStats((prev) => ({
        ...prev,
        recentConversations: (prev?.recentConversations || []).filter((c) => (c._id || c.id) !== convId),
        totalConversations: Math.max(0, (prev?.totalConversations || 1) - 1),
      }));
      if (selectedChatId === convId) {
        setIsViewerOpen(false);
        setSelectedChatId(null);
      }
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleViewChat = (convId) => {
    setSelectedChatId(convId);
    setIsViewerOpen(true);
  };

  const handleOpenFullChat = (convId) => {
    navigate(`/chat/${convId}`);
  };

  const handleLaunchPrompt = (promptText) => {
    navigate("/chat", { state: { prefilledPrompt: promptText } });
  };

  const filteredConversations = conversations.filter((c) => {
    const title = (c.title || "").toLowerCase();
    const lastMsg = (c.lastMessage || "").toLowerCase();
    const query = chatSearch.toLowerCase();
    return title.includes(query) || lastMsg.includes(query);
  });

  const currentUser = stats?.user || userData?.user || userData || {};
  const tier = stats?.subscriptionTier || currentUser?.subscriptionTier || "free";

  return (
    <PageLayout
      title="User Dashboard & Analytics"
      description="Monitor chat metrics, model tokens, recent sessions, and storage in your Nexora AI dashboard."
    >
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Mobile Toggle Button for Chat History Sidebar */}
        <div className="lg:hidden mb-6 flex items-center justify-between p-4 rounded-2xl bg-surface border border-line shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary-text flex items-center justify-center">
              <FiMessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-fg">
                Chat History
              </p>
              <p className="text-[10px] text-fg-muted">
                {conversations.length} saved session{conversations.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsedMobile(!sidebarCollapsedMobile)}
            className="px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-text text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FiList className="w-3.5 h-3.5" />
            <span>{sidebarCollapsedMobile ? "View History" : "Hide History"}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ══════════════════════════════════════════════
              DASHBOARD SIDEBAR: CHAT HISTORY
              ══════════════════════════════════════════════ */}
          <aside
            className={`w-full lg:w-80 xl:w-88 shrink-0 lg:sticky lg:top-28 z-20 flex flex-col gap-4 ${
              sidebarCollapsedMobile ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="p-5 rounded-3xl bg-surface border border-line shadow-xl flex flex-col h-[740px]">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-line">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan text-primary-contrast flex items-center justify-center shadow-md">
                    <FiMessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-fg flex items-center gap-1.5">
                      <span>Chat History</span>
                    </h2>
                    <p className="text-[11px] text-fg-muted">
                      {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/chat"
                  className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  title="Start New Chat"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>New</span>
                </Link>
              </div>

              {/* Search Bar */}
              <div className="pt-3 pb-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fg-muted" />
                  <input
                    type="text"
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    placeholder="Search previous chats..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-canvas border border-line text-xs text-fg placeholder-fg-muted outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Conversation List Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 py-1">
                {conversationsLoading ? (
                  <div className="h-48 flex items-center justify-center">
                    <LoadingSpinner label="Loading history..." />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                    <FiMessageSquare className="w-8 h-8 opacity-30 text-fg-muted mb-2" />
                    <p className="text-xs text-fg-muted font-medium">
                      {chatSearch ? "No matching chats found." : "No previous chats yet."}
                    </p>
                    <Link
                      to="/chat"
                      className="mt-3 px-3 py-1.5 rounded-xl bg-primary text-primary-contrast text-[11px] font-semibold"
                    >
                      Start First Chat
                    </Link>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const id = conv._id || conv.id;
                    const isSelected = selectedChatId === id && isViewerOpen;
                    const dateStr = conv.updatedAt || conv.createdAt;
                    const formattedDate = dateStr
                      ? new Date(dateStr).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })
                      : "";

                    return (
                      <div
                        key={id}
                        onClick={() => handleViewChat(id)}
                        className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? "bg-primary/15 border-primary/40 shadow-sm"
                            : "bg-canvas/70 border-line hover:border-primary/30 hover:bg-primary/5"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-fg truncate group-hover:text-primary-text transition-colors flex-1">
                            {conv.title || "Untitled Chat"}
                          </span>
                          <span className="text-[10px] text-fg-muted font-medium shrink-0">
                            {formattedDate}
                          </span>
                        </div>

                        <p className="text-[11px] text-fg-muted line-clamp-1 break-words">
                          {conv.lastMessage || "No messages recorded"}
                        </p>

                        {/* Action buttons on hover */}
                        <div className="flex items-center justify-between pt-1 border-t border-line mt-0.5">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary-text/80">
                            {conv.model?.includes("flash") ? "Gemini Flash" : "AI"}
                          </span>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewChat(id);
                              }}
                              className="px-2 py-0.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary-text text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="View chat in preview"
                            >
                              <FiEye className="w-3 h-3" />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenFullChat(id);
                              }}
                              className="p-1 rounded-lg hover:bg-primary/15 text-fg-muted hover:text-primary-text transition-colors cursor-pointer"
                              title="Open in Full Chat"
                            >
                              <FiArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={isDeleting === id}
                              onClick={(e) => handleDeleteConversation(id, e)}
                              className="p-1 rounded-lg hover:bg-error/15 text-fg-muted hover:text-error-text transition-colors cursor-pointer"
                              title="Delete Chat"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Sidebar Footer Hint */}
              <div className="pt-3 border-t border-line text-center">
                <p className="text-[11px] text-fg-muted">
                  Click any chat to view previous messages
                </p>
              </div>
            </div>
          </aside>

          {/* ══════════════════════════════════════════════
              MAIN DASHBOARD CONTENT
              ══════════════════════════════════════════════ */}
          <div className="flex-1 min-w-0 w-full space-y-8">
            {/* ══════════════════════════════════════════════
                TOP WELCOME & TIER BANNER
                ══════════════════════════════════════════════ */}
            <Reveal animation="fade-up" delay={0.06}>
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-violet to-brand-cyan text-primary-contrast font-extrabold text-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-bold text-fg">
                        Welcome back, {currentUser.name || currentUser.userName || "Developer"}
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary-text border border-line-strong">
                        {tier.toUpperCase()} TIER
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-fg-muted mt-0.5">
                      {currentUser.email} • Connected to Gemini Cluster
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link
                    to="/chat"
                    className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    New Conversation
                  </Link>
                  <Link
                    to="/settings"
                    className="p-2.5 rounded-xl border border-line-strong text-fg-secondary hover:text-primary-contrast hover:bg-primary/10 transition-colors"
                    title="Account Settings"
                  >
                    <FiSettings className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      fetchDashboardData();
                      fetchConversations();
                    }}
                    className="p-2.5 rounded-xl border border-line-strong text-fg-secondary hover:text-primary-contrast hover:bg-primary/10 transition-colors cursor-pointer"
                    title="Refresh Stats"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Reveal>

        {isLoading ? (
          <LoadingSpinner label="Loading dashboard metrics & recent history..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchDashboardData} />
        ) : (
          <>
            {/* ══════════════════════════════════════════════
                ACTIVE PURCHASED PLAN & SUBSCRIPTION DISPLAY
                ══════════════════════════════════════════════ */}
            {(() => {
              const activePlanKey = (tier || "free").toLowerCase();
              const activePlan = PLAN_CONFIG[activePlanKey] || PLAN_CONFIG.free;

              return (
                <Reveal animation="fade-up" delay={0.1} distance={35}>
                  <div
                    className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${activePlan.gradient} bg-surface border shadow-xl ${activePlan.glowColor} mb-10 transition-all duration-300`}
                  >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-line">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-fg flex items-center gap-2">
                          <FiAward className="w-6 h-6 text-primary-text shrink-0" />
                          <span>{activePlan.title}</span>
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${activePlan.badgeColor}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                          {activePlan.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-fg-secondary">
                        {activePlan.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-primary/10 px-5 py-3.5 rounded-2xl border border-line-strong shrink-0 w-full lg:w-auto justify-between lg:justify-start">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-fg">
                            {activePlan.price}
                          </span>
                          <span className="text-xs text-fg-muted font-medium">
                            / month
                          </span>
                        </div>
                        <p className="text-[10px] text-primary-text font-semibold">
                          {activePlan.billingCycle}
                        </p>
                      </div>
                      <Link
                        to="/pricing"
                        className="ml-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <span>{activePlanKey === "free" ? "Upgrade Plan" : "Manage Plan"}</span>
                        <FiArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Plan Limits & Capabilities Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-line">
                    <div className="p-3.5 rounded-xl bg-fg-muted/5 border border-line">
                      <p className="text-[11px] font-semibold text-fg-muted">
                        Daily Message Quota
                      </p>
                      <p className="text-sm font-bold text-fg mt-1">
                        {activePlan.limits.messages}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-fg-muted/5 border border-line">
                      <p className="text-[11px] font-semibold text-fg-muted">
                        Model Availability
                      </p>
                      <p className="text-sm font-bold text-fg mt-1 truncate">
                        {activePlan.limits.models}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-fg-muted/5 border border-line">
                      <p className="text-[11px] font-semibold text-fg-muted">
                        Vision Attachments
                      </p>
                      <p className="text-sm font-bold text-fg mt-1">
                        {activePlan.limits.vision}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-fg-muted/5 border border-line">
                      <p className="text-[11px] font-semibold text-fg-muted">
                        Support Channel
                      </p>
                      <p className="text-sm font-bold text-fg mt-1 truncate">
                        {activePlan.limits.support}
                      </p>
                    </div>
                  </div>

                  {/* Unlocked Plan Features */}
                  <div className="pt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-fg-muted mb-3">
                      Features Unlocked with Your {activePlan.title}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {activePlan.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 text-xs text-fg-secondary"
                        >
                          <div className="w-4 h-4 rounded-full bg-success/20 text-success-text flex items-center justify-center shrink-0">
                            <FiCheck className="w-3 h-3" />
                          </div>
                          <span className="font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })()}

            {/* ══════════════════════════════════════════════
                4-CARD KPI METRICS GRID
                ══════════════════════════════════════════════ */}
            <Reveal animation="fade-up" delay={0.12} distance={30}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <div className="p-6 rounded-2xl bg-surface border border-line shadow-sm hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-fg-muted">
                      Total Conversations
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary-text flex items-center justify-center">
                      <FiMessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-fg">
                    <CountUp end={stats?.totalConversations || 0} />
                  </p>
                  <p className="text-[11px] text-success-text font-medium mt-1 flex items-center gap-1">
                    <FiTrendingUp className="w-3 h-3" />
                    Active thread sessions
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-line shadow-sm hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-fg-muted">
                      Total Messages
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent-text flex items-center justify-center">
                      <FiZap className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-fg">
                    <CountUp end={stats?.totalMessages || 0} />
                  </p>
                  <p className="text-[11px] text-fg-muted mt-1">
                    Prompts + Streamed replies
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-line shadow-sm hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-fg-muted">
                      Estimated Tokens
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary-text flex items-center justify-center">
                      <FiCpu className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-fg">
                    <CountUp end={Number(stats?.estimatedTokens || 0)} />
                  </p>
                  <p className="text-[11px] text-primary-text font-medium mt-1">
                    Gemini 3.8 Flash quota
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-line shadow-sm hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-fg-muted">
                      Storage Allocated
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-success/10 text-success-text flex items-center justify-center">
                      <FiDatabase className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-fg">
                    {stats?.estimatedStorageMb || "0 MB"}
                  </p>
                  <p className="text-[11px] text-fg-muted mt-1">
                    MongoDB Atlas encrypted
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ══════════════════════════════════════════════
                7-DAY ACTIVITY CHART & QUICK LAUNCHERS
                ══════════════════════════════════════════════ */}
            <Reveal animation="fade-up" delay={0.18} distance={30}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Activity Bar Visualization */}
                <div className="lg:col-span-2 p-7 rounded-3xl bg-surface border border-line shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-fg">
                        7-Day Message Activity
                      </h3>
                      <p className="text-xs text-fg-muted mt-0.5">
                        Daily conversational message volume
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary-text">
                      Last 7 Days
                    </span>
                  </div>

                  <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2">
                    {activity.length === 0 ? (
                      <div className="w-full text-center text-xs text-fg-muted self-center">
                        No activity recorded for this period yet.
                      </div>
                    ) : (
                      activity.map((item, idx) => {
                        const maxMsgs = Math.max(...activity.map((a) => a.messages), 10);
                        const heightPercent = Math.min(100, Math.max(12, (item.messages / maxMsgs) * 100));

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                            <span className="text-[10px] font-bold text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.messages}
                            </span>
                            <div className="w-full max-w-[42px] bg-primary/15 group-hover:bg-primary/30 rounded-t-xl h-36 flex items-end p-1 transition-all">
                              <div
                                className="w-full rounded-lg bg-gradient-to-t from-brand-violet to-brand-cyan transition-all duration-500"
                                style={{ height: `${heightPercent}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-fg-muted">
                              {item.day}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Quick Prompt Launchers */}
                <div className="p-7 rounded-3xl bg-surface border border-line shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-fg mb-1">
                      Quick AI Launchers
                    </h3>
                    <p className="text-xs text-fg-muted mb-4">
                      Pre-configured starter prompts
                    </p>

                    <div className="space-y-2.5">
                      {QUICK_PROMPTS.map((qp, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleLaunchPrompt(qp.prompt)}
                          className="w-full p-3 rounded-xl text-left bg-canvas border border-line hover:border-primary/40 hover:shadow-xs transition-all text-xs cursor-pointer group"
                        >
                          <p className="font-bold text-fg group-hover:text-primary-text flex items-center justify-between">
                            <span>{qp.title}</span>
                            <FiArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </p>
                          <p className="text-[11px] text-fg-muted truncate mt-0.5">
                            {qp.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/docs"
                    className="mt-4 pt-3 border-t border-line text-xs text-center text-primary-text font-semibold hover:underline block"
                  >
                    View Developer Guides & Examples →
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* ══════════════════════════════════════════════
                RECENT CHAT SESSIONS TABLE
                ══════════════════════════════════════════════ */}
            <Reveal animation="fade-up" delay={0.24} distance={30}>
              <div className="p-7 rounded-3xl bg-surface border border-line shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-fg">
                      Recent Chat Sessions
                    </h3>
                    <p className="text-xs text-fg-muted mt-0.5">
                      Jump right back into active conversations
                    </p>
                  </div>
                  <Link
                    to="/chat"
                    className="text-xs font-semibold text-primary-text hover:underline"
                  >
                    Open Chatbox →
                  </Link>
                </div>


              {!stats?.recentConversations || stats.recentConversations.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-line-strong rounded-2xl">
                  <p className="text-xs text-fg-muted">No conversations created yet.</p>
                  <Link
                    to="/chat"
                    className="mt-3 inline-block px-4 py-2 rounded-xl bg-primary text-primary-contrast text-xs font-semibold"
                  >
                    Start First Chat
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {stats.recentConversations.map((conv) => {
                    const id = conv._id || conv.id;
                    const dateFormatted = new Date(conv.updatedAt || conv.createdAt).toLocaleString(
                      "en-US",
                      { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                    );

                    return (
                      <div
                        key={id}
                        onClick={() => handleViewChat(id)}
                        className="py-3.5 px-3 rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary-text flex items-center justify-center shrink-0">
                            <FiMessageSquare className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-fg truncate group-hover:text-primary-text transition-colors">
                              {conv.title || "Untitled Session"}
                            </p>
                            <p className="text-xs text-fg-muted truncate max-w-md mt-0.5">
                              {conv.lastMessage || "No messages"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
                          <span className="text-fg-muted hidden sm:inline flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {dateFormatted}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewChat(id);
                            }}
                            className="p-1.5 rounded-lg text-fg-muted hover:text-primary-text hover:bg-primary/10 transition-colors cursor-pointer"
                            title="View Chat Messages"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenFullChat(id);
                            }}
                            className="p-1.5 rounded-lg text-fg-muted hover:text-primary-text hover:bg-primary/10 transition-colors cursor-pointer"
                            title="Open in Full Chat Room"
                          >
                            <FiArrowUpRight className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            disabled={isDeleting === id}
                            onClick={(e) => handleDeleteConversation(id, e)}
                            className="p-1.5 rounded-lg text-fg-muted hover:text-error-text hover:bg-error/10 transition-colors cursor-pointer"
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
          </Reveal>
          </>
        )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            PREVIOUS CHAT VIEWER MODAL / DRAWER
            ══════════════════════════════════════════════ */}
        <PreviousChatViewer
          conversationId={selectedChatId}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedChatId(null);
          }}
          onDelete={handleDeleteConversation}
          onOpenFullChat={handleOpenFullChat}
          serverUrl={SERVER_URL}
        />
      </div>
    </PageLayout>
  );
};

export default Dashboard;
