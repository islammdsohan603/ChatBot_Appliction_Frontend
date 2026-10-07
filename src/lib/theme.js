/**
 * Theme helpers — single place that knows how a theme is applied to <html>.
 * Mirrors the inline bootstrap script in index.html (which runs before first paint).
 *
 *  - first load : saved choice → otherwise `prefers-color-scheme`
 *  - persistence: localStorage["theme"]
 *  - switching  : `.theme-transitioning` enables the 250ms colour transition
 */

export const THEME_META_COLORS = {
  dark: "#07080F",
  light: "#F7F8FC",
};

const TRANSITION_MS = 300;

export const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const applyTheme = (theme, { animate = true, persist = true } = {}) => {
  const root = document.documentElement;
  const isDark = theme === "dark";

  if (animate) root.classList.add("theme-transitioning");

  root.classList.toggle("dark", isDark);
  root.classList.toggle("light", !isDark);
  root.setAttribute("data-theme", isDark ? "dark" : "light");

  if (persist) {
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_META_COLORS[isDark ? "dark" : "light"]);

  if (animate) {
    window.setTimeout(() => root.classList.remove("theme-transitioning"), TRANSITION_MS);
  }
};
