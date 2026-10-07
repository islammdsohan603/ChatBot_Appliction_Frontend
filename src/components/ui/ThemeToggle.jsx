/**
 * ThemeToggle — Accessible, animated theme switch button.
 * Toggles between Dark Mode ('dark' class / data-theme on <html>) and Light Mode.
 * Persists the choice in localStorage and keeps every toggle on the page in sync.
 * Sun and moon cross-rotate smoothly when the theme changes.
 */
import { useState, useEffect } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { applyTheme, getInitialTheme } from "../../lib/theme";

const ThemeToggle = ({ className = "", showLabel = false }) => {
  const [isDark, setIsDark] = useState(() => getInitialTheme() === "dark");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    applyTheme(next);
    window.dispatchEvent(new CustomEvent("nexoraThemeChange", { detail: { theme: next } }));
  };

  const iconBase =
    "absolute inset-0 w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      aria-pressed={isDark}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      className={`group relative flex items-center gap-2 p-2.5 rounded-xl border border-line-strong bg-surface/80 text-fg-secondary hover:text-fg hover:bg-surface-hover hover:border-primary/40 shadow-card transition-all duration-300 cursor-pointer active:scale-95 ${className}`}
    >
      <div className="relative w-5 h-5" aria-hidden="true">
        <HiOutlineSun
          className={`${iconBase} text-warning-text ${
            isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
          }`}
        />
        <HiOutlineMoon
          className={`${iconBase} text-primary-text ${
            isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
