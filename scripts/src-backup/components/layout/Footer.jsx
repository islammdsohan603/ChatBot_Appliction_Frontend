import { Link } from "react-router-dom";
import {
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiMessageSquare,
  FiHeart,
  FiSend,
} from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-toastify";

/**
 * Global application footer
 */
export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to Nexora AI updates!");
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Product",
      links: [
        { label: "AI Chatbot", to: "/chat" },
        { label: "Pricing & Plans", to: "/pricing" },
        { label: "User Dashboard", to: "/dashboard" },
        { label: "Model Playground", to: "/chat" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", to: "/docs" },
        { label: "Community Hub", to: "/community" },
        { label: "About Us", to: "/about" },
        { label: "Team & Story", to: "/about#team" },
      ],
    },
    {
      title: "Developers",
      links: [
        { label: "API Reference", to: "/docs" },
        { label: "WebSocket Realtime", to: "/docs" },
        { label: "SSE Streaming", to: "/docs" },
        { label: "GitHub", href: "https://github.com" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", to: "/about" },
        { label: "Terms of Service", to: "/about" },
        { label: "Security & Encryption", to: "/about" },
      ],
    },
  ];

  return (
    <footer className="border-t border-violet-500/10 bg-slate-100/80 dark:bg-[#040612]/95 backdrop-blur-md transition-colors text-slate-700 dark:text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-violet-500/10">
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-violet-500/30">
                <FiMessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-br from-indigo-200 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                NEXORA AI
              </span>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering individuals and teams with high-speed multimodal AI
              conversations, persistent workspace sessions, and end-to-end
              encryption.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational — Gemini 3.8 Flash Online
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center max-w-md lg:ml-auto">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Stay ahead with AI updates
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Get the latest release notes, model benchmarks, and developer
              guides.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#0d1230] border border-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Subscribe</span>
                <FiSend className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {sections.map((sec) => (
            <div key={sec.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3.5">
                {sec.title}
              </h4>
              <ul className="space-y-2.5">
                {sec.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-xs sm:text-sm text-slate-600 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs sm:text-sm text-slate-600 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300 transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-violet-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-1 text-center sm:text-left">
            © {currentYear} Nexora AI Inc. Built with
            <FiHeart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />{" "}
            for intelligent collaboration.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg hover:text-violet-600 dark:hover:text-white hover:bg-violet-500/10 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg hover:text-violet-600 dark:hover:text-white hover:bg-violet-500/10 transition-colors"
              aria-label="Twitter"
            >
              <FiTwitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg hover:text-violet-600 dark:hover:text-white hover:bg-violet-500/10 transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
