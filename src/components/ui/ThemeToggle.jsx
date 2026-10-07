/**
 * ThemeToggle — Accessible, animated theme switch button.
 * Toggles between Dark Mode ('dark' class / data-theme on <html>) and Light Mode.
 * Persists the choice in localStorage and keeps every toggle on the page in sync.
 * Sun and moon cross-rotate smoothly 180° using Framer Motion.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { applyTheme, getInitialTheme } from "../../lib/theme";
import { MOTION_CONFIG } from "../../lib/motion";

export const ThemeToggle = ({ className = "", showLabel = false }) => {
  const [isDark, setIsDark] = useState(() => getInitialTheme() === "dark");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Sync the DOM with the resolved theme (no transition flicker on mount)
    applyTheme(isDark ? "dark" : "light", { animate: false, persist: false });

    const handleStorage = (e) => {
      if (e.key === "theme") setIsDark(e.newValue === "dark");
    };
    const handleCustom = (e) => setIsDark(e.detail?.theme === "dark");

    window.addEventListener("storage", handleStorage);
    window.addEventListener("nexoraThemeChange", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("nexoraThemeChange", handleCustom);
    };
  }, []);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    applyTheme(next);
    window.dispatchEvent(
      new CustomEvent("nexoraThemeChange", { detail: { theme: next } })
    );
  };

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -1 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      aria-pressed={isDark}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      className={`group relative flex items-center gap-2 p-2.5 rounded-xl border border-line-strong bg-surface/80 text-fg-secondary hover:text-fg hover:bg-surface-hover hover:border-primary/40 shadow-card transition-colors duration-250 cursor-pointer ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun-icon"
              initial={shouldReduceMotion ? { opacity: 0 } : { rotate: -180, scale: 0.5, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { rotate: 0, scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { rotate: 180, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.35, ease: MOTION_CONFIG.ease }}
              className="absolute inset-0 flex items-center justify-center text-warning-text"
            >
              <HiOutlineSun className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon-icon"
              initial={shouldReduceMotion ? { opacity: 0 } : { rotate: 180, scale: 0.5, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { rotate: 0, scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { rotate: -180, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.35, ease: MOTION_CONFIG.ease }}
              className="absolute inset-0 flex items-center justify-center text-primary-text"
            >
              <HiOutlineMoon className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
