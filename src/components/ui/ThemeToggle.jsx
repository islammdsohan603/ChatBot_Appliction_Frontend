/**
 * ThemeToggle — Accessible, animated theme switch button.
 * Toggles between Dark Mode ('dark' class on <html>) and Light Mode.
 * Persists user preference in localStorage and synchronizes across the app.
 */
import { useState, useEffect } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

const ThemeToggle = ({ className = "", showLabel = false }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return document.documentElement.classList.contains("dark");
  });

  const applyTheme = (dark, animate = true) => {
    setIsDark(dark);
    const themeStr = dark ? "dark" : "light";
    if (animate) {
      document.documentElement.classList.add("theme-transitioning");
    }
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", themeStr);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", dark ? "#060918" : "#f8fafc");

    if (animate) {
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 400);
    }
  };

  useEffect(() => {
    // Initial check from localStorage or current DOM state (without transition flicker)
    const saved = localStorage.getItem("theme");
    if (saved) {
      applyTheme(saved === "dark", false);
    } else {
      const isCurrentlyDark = document.documentElement.classList.contains("dark");
      applyTheme(isCurrentlyDark, false);
    }

    // Listen to external theme changes (e.g. from Settings or another toggle)
    const handleStorage = (e) => {
      if (e.key === "theme") {
        setIsDark(e.newValue === "dark");
      }
    };
    const handleCustom = (e) => {
      setIsDark(e.detail?.theme === "dark");
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("nexoraThemeChange", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("nexoraThemeChange", handleCustom);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    applyTheme(nextDark);
    const themeStr = nextDark ? "dark" : "light";
    window.dispatchEvent(new CustomEvent("nexoraThemeChange", { detail: { theme: themeStr } }));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      className={`group relative flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-300 cursor-pointer active:scale-95 ${
        isDark
          ? "bg-[#111840]/80 border-violet-500/25 text-violet-300 hover:text-white hover:bg-violet-500/20 hover:border-violet-500/50 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          : "bg-white/80 border-violet-300/40 text-violet-700 hover:text-violet-900 hover:bg-violet-50 hover:border-violet-400 shadow-[0_2px_8px_rgba(139,92,246,0.1)]"
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <HiOutlineSun className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-300" />
        ) : (
          <HiOutlineMoon className="w-5 h-5 transition-transform duration-300 -rotate-12 hover:rotate-0 text-indigo-600" />
        )}
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
