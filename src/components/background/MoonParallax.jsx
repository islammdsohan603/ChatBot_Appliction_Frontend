import { motion, useReducedMotion } from "framer-motion";

/**
 * 3D Animated Moon Component with scroll parallax rotation & mouse antigravity float
 *
 * @param {Object} props
 * @param {number} props.scrollY - Scroll position
 * @param {number} props.mouseX - Normalized mouse X (-1 to 1)
 * @param {number} props.mouseY - Normalized mouse Y (-1 to 1)
 */
export const MoonParallax = ({ scrollY = 0, mouseX = 0, mouseY = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  // Rotate Moon smoothly as user scrolls (1 degree per 15px scrolled)
  const rotationAngle = shouldReduceMotion ? 0 : (scrollY / 15) % 360;

  return (
    <motion.div
      className="absolute top-12 sm:top-16 right-4 sm:right-16 w-36 sm:w-52 h-36 sm:h-52 pointer-events-none z-0"
      style={{
        y: shouldReduceMotion ? 0 : scrollY * 0.18,
        x: shouldReduceMotion ? 0 : mouseX * -25,
      }}
      animate={
        shouldReduceMotion
          ? { y: 0 }
          : {
              y: [0, -12, 0],
            }
      }
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Outer Glow Corona */}
      <div
        className="absolute -inset-4 sm:-inset-6 rounded-full blur-2xl opacity-40 dark:opacity-60 transition-opacity"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--primary-rgb)/0.4) 0%, rgb(var(--accent-rgb)/0.2) 60%, transparent 80%)",
        }}
      />

      {/* 3D Moon Surface SVG */}
      <motion.div
        className="w-full h-full rounded-full shadow-[inset_-12px_-12px_24px_rgb(var(--scrim-rgb)/0.6)] relative overflow-hidden"
        style={{
          rotate: rotationAngle,
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <defs>
            {/* Moon sphere gradient */}
            <radialGradient id="moonBody" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="40%" stopColor="#cbd5e1" />
              <stop offset="85%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>

            {/* Crater inner shadow gradient */}
            <radialGradient id="craterShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
              <stop offset="80%" stopColor="#1e293b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* Main Moon sphere */}
          <circle cx="100" cy="100" r="95" fill="url(#moonBody)" />

          {/* Craters */}
          <g fill="url(#craterShadow)" opacity="0.65">
            {/* Large Mare Serenitatis */}
            <ellipse cx="65" cy="60" rx="22" ry="18" transform="rotate(-15 65 60)" />
            {/* Mare Tranquillitatis */}
            <ellipse cx="125" cy="80" rx="28" ry="22" transform="rotate(10 125 80)" />
            {/* Tycho Crater with rays */}
            <circle cx="110" cy="150" r="12" />
            <circle cx="110" cy="150" r="5" fill="#e2e8f0" opacity="0.8" />
            {/* Copernicus */}
            <circle cx="55" cy="115" r="14" />
            {/* Kepler */}
            <circle cx="35" cy="90" r="9" />
            {/* Small craters */}
            <circle cx="145" cy="125" r="7" />
            <circle cx="85" cy="130" r="8" />
            <circle cx="140" cy="45" r="6" />
            <circle cx="90" cy="35" r="7" />
          </g>

          {/* Outer edge crescent shadow for 3D realism */}
          <path
            d="M 100 5 A 95 95 0 0 1 100 195 A 75 75 0 0 0 100 5 Z"
            fill="#0f172a"
            opacity="0.35"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default MoonParallax;
