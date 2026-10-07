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
import { ScrollReveal } from "../components/common/ScrollReveal";

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
    icon: <FiMessageSquare className="w-6 h-6 text-primary-text" />,
    url: "https://discord.com",
    btnText: "Join Discord",
  },
  {
    name: "GitHub Organization",
    members: "4.8k stars • 320 forks",
    desc: "Fork the codebase, submit feature pull requests, and audit our open-source dependencies.",
    icon: <FiGithub className="w-6 h-6 text-fg-secondary" />,
    url: "https://github.com",
    btnText: "Star on GitHub",
  },
  {
    name: "Twitter / X Updates",
    members: "@NexoraAI • 14k followers",
    desc: "Product announcements, model benchmarks, prompt engineering tips, and engineering deep-dives.",
    icon: <FiTwitter className="w-6 h-6 text-accent-text" />,
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
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <FiPlus className="w-4 h-4" />
              Start a Discussion
            </button>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl border border-primary/30 text-fg hover:bg-primary/10 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <FiMessageSquare className="w-4 h-4 text-primary-text" />
              Discord Chat
            </a>
          </div>
        }
      />

      {/* ══════════════════════════════════════════════
          COMMUNITY STATS BANNER
          ══════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════
          COMMUNITY STATS BANNER
          ══════════════════════════════════════════════ */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal animation="fade-up" delay={80}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Developers", value: stats?.activeMembers || "1,250+" },
              { label: "Community Threads", value: stats?.totalDiscussions || "480+" },
              { label: "GitHub Stars", value: stats?.githubStars || "4.8k" },
              { label: "Discord Online", value: stats?.discordMembers || "8,920" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface border border-line shadow-sm text-center"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-gradient text-transparent">
                  {item.value}
                </p>
                <p className="text-xs text-fg-muted mt-1 font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT: DISCUSSIONS FEED & SEARCH
          ══════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal animation="fade-up" delay={120}>
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
                      ? "bg-primary text-primary-contrast shadow-xs"
                      : "bg-surface border border-line text-fg-secondary hover:text-primary-text"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
              <input
                type="text"
                placeholder="Search discussions or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-surface border border-line-strong focus:border-primary outline-none transition-all placeholder:text-fg-muted"
              />
            </form>
          </div>
        </ScrollReveal>

        {/* Discussions Listing */}
        {isLoading ? (
          <LoadingSpinner label="Loading discussions..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchCommunityData} />
        ) : posts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-line bg-surface/40">
            <p className="text-fg-muted text-sm">
              No discussions found under "{selectedCategory}". Be the first to start one!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, pIdx) => {
              const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
              const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;
              const hasLiked =
                isAuthenticated &&
                Array.isArray(post.likes) &&
                post.likes.some((id) => id.toString() === (userData?.user?._id || "me"));

              return (
                <ScrollReveal
                  key={post._id}
                  animation="fade-up"
                  delay={(pIdx % 6) * 60}
                  distance={30}
                >
                  <article
                    className="p-6 rounded-2xl bg-surface border border-line hover:border-primary/35 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary-text border border-line-strong">
                            {post.category}
                          </span>
                          {post.isPinned && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning/10 text-warning-text border border-warning/20">
                              Pinned
                            </span>
                          )}
                          <span className="text-xs text-fg-muted">
                            by {post.authorName || "Member"} •{" "}
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-fg hover:text-primary-text transition-colors mb-2">
                          {post.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed mb-4 line-clamp-2">
                          {post.content}
                        </p>

                        {/* Tags */}
                        {Array.isArray(post.tags) && post.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mb-4">
                            {post.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded-md text-[10px] bg-surface-hover text-fg-secondary"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center justify-between pt-3 border-t border-line text-xs text-fg-muted">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            hasLiked
                              ? "text-error-text bg-error/10"
                              : "hover:text-error-text hover:bg-error/10"
                          }`}
                        >
                          <FiHeart className={`w-3.5 h-3.5 ${hasLiked ? "fill-error-text" : ""}`} />
                          <span>{likesCount}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <FiMessageSquare className="w-3.5 h-3.5" />
                          <span>{commentsCount} comments</span>
                        </div>

                        <div className="hidden sm:block text-fg-muted">
                          {post.views || 0} views
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Link copied to clipboard!");
                        }}
                        className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                        title="Share discussion"
                      >
                        <FiShare2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════
          TOP CONTRIBUTORS SECTION
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-line">
        <ScrollReveal animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-2">
            Hall of Fame
          </h2>
          <h3 className="text-3xl font-extrabold text-fg tracking-tight">
            Featured Community Contributors
          </h3>
          <p className="text-sm text-fg-secondary mt-2">
            Acknowledging the open-source developers helping refine prompt parsers, tools, and UI modules.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOP_CONTRIBUTORS.map((c, idx) => (
            <ScrollReveal
              key={idx}
              animation="fade-up"
              delay={(idx % 4) * 80}
              distance={35}
            >
              <div
                className="h-full p-6 rounded-2xl bg-surface border border-line shadow-sm text-center flex flex-col items-center justify-between"
              >
                <div>
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 mb-3"
                  />
                  <h4 className="text-sm font-bold text-fg">{c.name}</h4>
                  <p className="text-xs text-fg-muted mb-2">{c.role}</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary-text border border-line-strong mb-3">
                    {c.badge}
                  </span>
                  <p className="text-xs font-semibold text-fg-secondary">
                    {c.contributions} Pull Requests & Commits
                  </p>
                </div>

                <a
                  href={c.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary-text hover:underline"
                >
                  <FiGithub className="w-3.5 h-3.5" />
                  View GitHub
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SOCIAL CHANNELS
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-line">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOCIAL_CHANNELS.map((ch, idx) => (
            <ScrollReveal
              key={idx}
              animation="fade-up"
              delay={idx * 100}
              distance={35}
            >
              <div
                className="h-full p-7 rounded-2xl bg-surface border border-line flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-line-strong flex items-center justify-center mb-4">
                    {ch.icon}
                  </div>
                  <h4 className="text-lg font-bold text-fg mb-1">{ch.name}</h4>
                  <p className="text-xs font-semibold text-primary-text mb-2">
                    {ch.members}
                  </p>
                  <p className="text-xs text-fg-secondary leading-relaxed mb-6">
                    {ch.desc}
                  </p>
                </div>

                <a
                  href={ch.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl border border-primary/25 hover:bg-primary/10 text-fg text-xs font-semibold text-center transition-all flex items-center justify-center gap-2"
                >
                  <span>{ch.btnText}</span>
                  <FiExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CREATE DISCUSSION MODAL
          ══════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-surface border border-primary/25 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
              <h3 className="text-lg font-bold text-fg">
                Start a Community Discussion
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-fg-muted hover:text-primary-contrast"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-fg-secondary mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prompt engineering tips for code review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-canvas border border-line-strong focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-fg-secondary mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-canvas border border-line-strong focus:border-primary outline-none text-fg"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-fg-secondary mb-1">
                  Content (Markdown supported)
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your question, discovery, or feedback in detail..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-canvas border border-line-strong focus:border-primary outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-fg-secondary mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. gemini, streaming, react"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-canvas border border-line-strong focus:border-primary outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-line-strong text-xs font-semibold text-fg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold shadow-md disabled:opacity-50"
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
