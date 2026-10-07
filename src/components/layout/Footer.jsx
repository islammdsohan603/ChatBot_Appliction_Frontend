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
import { motion, useReducedMotion } from "framer-motion";
import { fadeIn, MOTION_CONFIG } from "../../lib/motion";

/**
 * Global application footer
 * Enhanced with Framer Motion: simple fadeIn upon scrolling into view + micro-interactions
 */
export const Footer = () => {
  const [email, setEmail] = useState("");
  const shouldReduceMotion = useReducedMotion();

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
    <motion.footer
      initial={shouldReduceMotion ? { opacity: 0 } : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeIn}
      className="border-t border-line bg-surface-hover/80 backdrop-blur-md transition-colors text-fg-secondary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-line">
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center text-primary-contrast font-bold shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
                <FiMessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-gradient text-transparent">
                NEXORA AI
              </span>
            </Link>

            <p className="text-sm text-fg-secondary max-w-sm leading-relaxed">
              Empowering individuals and teams with high-speed multimodal AI
              conversations, persistent workspace sessions, and end-to-end
              encryption.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success-text text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              All Systems Operational — Gemini 3.8 Flash Online
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center max-w-md lg:ml-auto">
            <h4 className="text-sm font-bold text-fg mb-1">
              Stay ahead with AI updates
            </h4>
            <p className="text-xs text-fg-muted mb-3">
              Get the latest release notes, model benchmarks, and developer
              guides.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-surface border border-line-strong focus:border-primary outline-none transition-all placeholder:text-fg-muted text-fg"
              />
              <motion.button
                type="submit"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Subscribe</span>
                <FiSend className="w-3.5 h-3.5" />
              </motion.button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {sections.map((sec) => (
            <div key={sec.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-fg mb-3.5">
                {sec.title}
              </h4>
              <ul className="space-y-2.5">
                {sec.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-xs sm:text-sm text-fg-secondary hover:text-primary-text transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs sm:text-sm text-fg-secondary hover:text-primary-text transition-colors"
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

        <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fg-muted">
          <p className="flex items-center gap-1 text-center sm:text-left">
            © {currentYear} Nexora AI Inc. Built with
            <FiHeart className="w-3.5 h-3.5 text-error-text fill-error-text inline mx-0.5" />
            for intelligent collaboration.
          </p>

          <div className="flex items-center gap-3">
            {[
              { icon: FiGithub, href: "https://github.com", label: "GitHub" },
              { icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
              { icon: FiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
            ].map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  className="p-2 rounded-lg text-fg-secondary hover:text-primary-text hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
