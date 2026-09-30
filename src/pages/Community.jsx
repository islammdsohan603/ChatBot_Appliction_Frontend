import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiUsers,
  FiMessageSquare,
  FiHeart,
  FiGithub,
  FiTwitter,
  FiExternalLink,
  FiSearch,
  FiPlus,
  FiX,
  FiCheckCircle,
  FiStar,
  FiShare2,
} from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { PageHeader } from "../components/layout/PageHeader";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorState } from "../components/common/ErrorState";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000";

const CATEGORIES = ["All", "Showcase", "Tutorials", "Discussions", "Support", "Feature Requests"];

const TOP_CONTRIBUTORS = [
  {
    name: "Taras Shevchenko",
    role: "Core Contributor",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    contributions: 64,
    badge: "Top Reviewer",
    githubUrl: "https://github.com",
  },
  {
    name: "Jessica Lin",
    role: "Frontend Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    contributions: 48,
    badge: "UI Specialist",
    githubUrl: "https://github.com",
  },
  {
    name: "Liam O'Connor",
    role: "DevOps & Cloud",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    contributions: 39,
    badge: "Docker Wizard",
    githubUrl: "https://github.com",
  },
  {
    name: "Priya Sharma",
    role: "Documentation Lead",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    contributions: 31,
    badge: "Tech Writer",
    githubUrl: "https://github.com",
  },
];

const SOCIAL_CHANNELS = [
  {
    name: "Discord Community",
    members: "8,920 members online",
    desc: "Chat directly with maintainers, join weekly office hours, and troubleshoot code in real-time.",
    icon: <FiMessageSquare className="w-6 h-6 text-indigo-400" />,
    url: "https://discord.com",
    btnText: "Join Discord",
  },
  {
    name: "GitHub Organization",
    members: "4.8k stars • 320 forks",
    desc: "Fork the codebase, submit feature pull requests, and audit our open-source dependencies.",
    icon: <FiGithub className="w-6 h-6 text-slate-300" />,
    url: "https://github.com",
    btnText: "Star on GitHub",
  },
  {
    name: "Twitter / X Updates",
    members: "@NexoraAI • 14k followers",
    desc: "Product announcements, model benchmarks, prompt engineering tips, and engineering deep-dives.",
    icon: <FiTwitter className="w-6 h-6 text-cyan-400" />,
    url: "https://twitter.com",
    btnText: "Follow @NexoraAI",
  },
];

/**
 * Community Page Component
 */
export const Community = () => {
  const { isAuthenticated, userData } = useSelector((s) => s.user);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New post modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Discussions");
  const [newTags, setNewTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch posts & stats
  const fetchCommunityData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [postsRes, statsRes] = await Promise.all([
        axios.get(`${SERVER_URL}/api/community/posts`, {
          params: {
            category: selectedCategory !== "All" ? selectedCategory : undefined,
            search: searchQuery.trim() || undefined,
          },
          withCredentials: true,
        }),
        axios.get(`${SERVER_URL}/api/community/stats`, { withCredentials: true }),
      ]);

      if (postsRes.data?.posts) {
        setPosts(postsRes.data.posts);
      }
      if (statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.warn("Community fetch error:", err);
      setError("Unable to sync latest community discussions. Showing offline view.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCommunityData();
  };

  // Toggle Like on post
  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      toast.info("Please log in to like community discussions.");
      return;
    }
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/community/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      if (res.data?.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  likes: res.data.hasLiked
                    ? [...p.likes, userData?.user?._id || "me"]
                    : p.likes.filter((id) => id !== (userData?.user?._id || "me")),
                }
              : p
          )
        );
      }
    } catch {
      toast.error("Failed to update like status.");
    }
  };

  // Create new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please enter a title and content.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/community/posts`,
        {
          title: newTitle,
          content: newContent,
          category: newCategory,
          tags: newTags ? newTags.split(",").map((t) => t.trim()) : [],
        },
        { withCredentials: true }
      );

      if (res.data?.post) {
        setPosts([res.data.post, ...posts]);
        toast.success("Discussion posted successfully!");
        setIsModalOpen(false);
        setNewTitle("");
        setNewContent("");
        setNewTags("");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Community & Contributors"
      description="Connect with fellow developers, discuss AI architectures, share showcases, and contribute to the Nexora AI ecosystem."
    >
      <PageHeader
        badge="Global Developer Community"
        title="Connect with innovators and"
        highlight="share intelligent creations."
        description="Ask questions, showcase custom multimodal workflows, suggest features, and collaborate directly with the core engineering team."
        breadcrumbs={[{ label: "Community" }]}
        action={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.info("Please log in to create a community discussion.");
                  return;
                }
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <FiPlus className="w-4 h-4" />
              Start a Discussion
            </button>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl border border-violet-500/30 text-slate-800 dark:text-slate-200 hover:bg-violet-500/10 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <FiMessageSquare className="w-4 h-4 text-indigo-500" />
              Discord Chat
            </a>
          </div>
        }
      />

      {/* ══════════════════════════════════════════════
          COMMUNITY STATS BANNER
          ══════════════════════════════════════════════ */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Developers", value: stats?.activeMembers || "1,250+" },
            { label: "Community Threads", value: stats?.totalDiscussions || "480+" },
            { label: "GitHub Stars", value: stats?.githubStars || "4.8k" },
            { label: "Discord Online", value: stats?.discordMembers || "8,920" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-sm text-center"
            >
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                {item.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT: DISCUSSIONS FEED & SEARCH
          ══════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-violet-600 text-white shadow-xs"
                    : "bg-white dark:bg-[#0d1230] border border-violet-500/15 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search discussions or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-[#0d1230] border border-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400"
            />
          </form>
        </div>

        {/* Discussions Listing */}
        {isLoading ? (
          <LoadingSpinner label="Loading discussions..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchCommunityData} />
        ) : posts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-violet-500/15 bg-white/40 dark:bg-[#0a0f2a]/40">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No discussions found under "{selectedCategory}". Be the first to start one!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
              const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;
              const hasLiked =
                isAuthenticated &&
                Array.isArray(post.likes) &&
                post.likes.some((id) => id.toString() === (userData?.user?._id || "me"));

              return (
                <article
                  key={post._id}
                  className="p-6 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 hover:border-violet-500/35 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                          {post.category}
                        </span>
                        {post.isPinned && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Pinned
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          by {post.authorName || "Member"} •{" "}
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-300 transition-colors mb-2">
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {post.content}
                      </p>

                      {/* Tags */}
                      {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mb-4">
                          {post.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center justify-between pt-3 border-t border-violet-500/10 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          hasLiked
                            ? "text-rose-500 bg-rose-500/10"
                            : "hover:text-rose-500 hover:bg-rose-500/10"
                        }`}
                      >
                        <FiHeart className={`w-3.5 h-3.5 ${hasLiked ? "fill-rose-500" : ""}`} />
                        <span>{likesCount}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <FiMessageSquare className="w-3.5 h-3.5" />
                        <span>{commentsCount} comments</span>
                      </div>

                      <div className="hidden sm:block text-slate-400">
                        {post.views || 0} views
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }}
                      className="p-1.5 rounded-lg hover:bg-violet-500/10 transition-colors"
                      title="Share discussion"
                    >
                      <FiShare2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════
          TOP CONTRIBUTORS SECTION
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-violet-500/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
            Hall of Fame
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Featured Community Contributors
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Acknowledging the open-source developers helping refine prompt parsers, tools, and UI modules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOP_CONTRIBUTORS.map((c, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-sm text-center flex flex-col items-center justify-between"
            >
              <div>
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-violet-500/30 mb-3"
                />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{c.name}</h4>
                <p className="text-xs text-slate-500 mb-2">{c.role}</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20 mb-3">
                  {c.badge}
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {c.contributions} Pull Requests & Commits
                </p>
              </div>

              <a
                href={c.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:underline"
              >
                <FiGithub className="w-3.5 h-3.5" />
                View GitHub
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SOCIAL CHANNELS
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-violet-500/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOCIAL_CHANNELS.map((ch, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  {ch.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{ch.name}</h4>
                <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">
                  {ch.members}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {ch.desc}
                </p>
              </div>

              <a
                href={ch.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl border border-violet-500/25 hover:bg-violet-500/10 text-slate-800 dark:text-slate-200 text-xs font-semibold text-center transition-all flex items-center justify-center gap-2"
              >
                <span>{ch.btnText}</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CREATE DISCUSSION MODAL
          ══════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-[#0d1230] border border-violet-500/25 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-violet-500/10 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Start a Community Discussion
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prompt engineering tips for code review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#111840] border border-violet-500/20 focus:border-violet-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#111840] border border-violet-500/20 focus:border-violet-500 outline-none text-slate-800 dark:text-slate-200"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content (Markdown supported)
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your question, discovery, or feedback in detail..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#111840] border border-violet-500/20 focus:border-violet-500 outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. gemini, streaming, react"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#111840] border border-violet-500/20 focus:border-violet-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-violet-500/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Community;
