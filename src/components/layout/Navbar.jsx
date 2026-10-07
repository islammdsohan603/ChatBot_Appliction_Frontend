import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useReducedMotion } from "framer-motion";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineChatBubbleLeftRight,
  HiOutlineSparkles,
} from "react-icons/hi2";
import ThemeToggle from "../ui/ThemeToggle";
import { MOTION_CONFIG } from "../../lib/motion";

/**
 * Global responsive navigation bar
 * Enhanced with Framer Motion:
 * - Slide down from top (y: -20 → 0, fade) on first load (0.5s)
 * - Nav links appear with a stagger after navbar slides down
 * - Active link pill uses layoutId="activeNavPill" so it glides smoothly between links
 * - Button micro-interactions: whileHover scale 1.03 with lift, whileTap scale 0.97
 */
export const Navbar = () => {
  const { isAuthenticated } = useSelector((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Pricing", to: "/pricing" },
    { label: "Community", to: "/community" },
    { label: "Docs", to: "/docs" },
    ...(isAuthenticated ? [{ label: "Dashboard", to: "/dashboard" }] : []),
  ];

  return (
    <motion.nav
      initial={shouldReduceMotion ? { opacity: 0 } : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: MOTION_CONFIG.ease }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/90 backdrop-blur-xl border-b border-line shadow-sm dark:shadow-[0_4px_24px_rgb(var(--scrim-rgb)/0.3)] py-2"
          : "bg-transparent py-4"
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo Mark */}
          <Link
            to="/"
            className="flex items-center gap-3 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl"
            aria-label="Nexora AI Home"
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center shadow-[0_4px_16px_rgb(var(--primary-rgb)/0.35)] transition-shadow duration-300 group-hover:shadow-[0_0_24px_rgb(var(--primary-rgb)/0.6)]"
            >
              <div className="absolute -inset-0.5 rounded-[14px] bg-gradient-to-br from-brand-violet/40 to-brand-cyan/40 -z-[1] blur-[6px] group-hover:blur-[8px] transition-all" />
              <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-primary-contrast group-hover:rotate-6 transition-transform duration-300" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-gradient text-transparent tracking-tight transition-all">
                NEXORA
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-primary-text -mt-1">
                AI Platform
              </span>
            </div>
          </Link>

          {/* Desktop nav links with staggered entrance & gliding active pill */}
          <motion.div
            className="hidden md:flex items-center gap-1 lg:gap-2"
            initial={shouldReduceMotion ? false : "hidden"}
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { delayChildren: 0.15, staggerChildren: 0.05 },
              },
            }}
          >
            {navLinks.map((link) => (
              <motion.div
                key={link.to}
                variants={{
                  hidden: { opacity: 0, y: -6 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: MOTION_CONFIG.ease },
                  },
                }}
              >
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary-text font-semibold"
                        : "text-fg-secondary hover:text-fg hover:bg-surface-hover/60"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPill"
                          className="absolute inset-0 bg-primary/12 rounded-lg -z-10 shadow-xs"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                >
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-primary/25 text-fg-secondary hover:bg-primary/10 transition-all inline-block"
                  >
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                >
                  <Link
                    to="/chat"
                    className="px-4 py-2 rounded-xl bg-gradient-to-br from-brand-violet to-brand-indigo hover:from-brand-violet hover:to-brand-indigo text-primary-contrast text-xs sm:text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center gap-1.5"
                  >
                    <HiOutlineSparkles className="w-4 h-4" />
                    Open Chat
                  </Link>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                >
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-sm font-medium text-fg-secondary hover:text-primary-text hover:bg-primary/10 rounded-xl transition-all inline-block"
                  >
                    Log In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                >
                  <Link
                    to="/signup"
                    className="relative px-4 py-2 rounded-xl bg-gradient-to-br from-brand-violet via-brand-violet to-brand-cyan text-primary-contrast text-sm font-semibold hover:shadow-[0_4px_25px_rgb(var(--primary-rgb)/0.45)] transition-all overflow-hidden group shadow-md shadow-primary/20 inline-block"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary-contrast/20 to-transparent" />
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle mobile menu"
              className="p-2 rounded-xl text-fg-secondary hover:text-primary-text hover:bg-primary/10 transition-all cursor-pointer"
            >
              {isOpen ? (
                <HiOutlineXMark className="w-6 h-6" />
              ) : (
                <HiOutlineBars3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer with smooth collapse/expand */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border border-line-strong rounded-2xl mt-2 p-3 pb-4 shadow-2xl"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "text-primary-text bg-primary/15 font-semibold"
                        : "text-fg-secondary hover:text-primary-text hover:bg-primary/10"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="flex gap-2 mt-3 pt-2 border-t border-line">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex-1 py-2 text-center text-xs font-semibold rounded-xl border border-primary/25 text-fg-secondary hover:bg-primary/10"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/chat"
                      className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-primary text-primary-contrast shadow-md"
                    >
                      Open Chat
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex-1 py-2 text-center text-xs font-medium text-fg-secondary border border-line-strong rounded-xl hover:bg-primary/10"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      className="flex-1 py-2 text-center text-xs text-primary-contrast bg-gradient-to-br from-brand-violet to-brand-indigo rounded-xl font-semibold shadow-md"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
