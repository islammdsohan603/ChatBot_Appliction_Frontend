import { useScrollPosition } from "../../customHooks/useScrollPosition";
import { useMousePosition } from "../../customHooks/useMousePosition";
import { StarField } from "./StarField";
import { MoonParallax } from "./MoonParallax";
import { SolarSystem } from "./SolarSystem";

/**
 * Premium Interactive Antigravity Space Background Animation Component
 *
 * Features:
 * - 3D Parallax Rotating Moon
 * - Concentric Solar System Orbits with Planets & Saturn Rings
 * - Multi-layered Dynamic Starfield with twinkle
 * - Smooth Antigravity Mouse Spring Physics
 * - Light / Dark Mode adaptive opacity & glows
 * - 60fps performance (No Canvas API, pure CSS + JS + Framer Motion)
 *
 * @param {Object} props
 * @param {boolean} [props.showSolarSystem=true] - Toggle Solar System orbits
 * @param {boolean} [props.showMoon=true] - Toggle Rotating Moon
 * @param {boolean} [props.showStars=true] - Toggle Starfield
 * @param {string} [props.className=""] - Optional wrapper styling
 */
export const BackgroundAnimation = ({
  showSolarSystem = true,
  showMoon = true,
  showStars = true,
  className = "",
}) => {
  const { scrollY } = useScrollPosition();
  const { normalizedX, normalizedY } = useMousePosition();

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-700 ${className}`}
      aria-hidden="true"
    >
      {/* Ambient Deep Space Nebula Glows */}
      <div
        className="absolute w-[800px] h-[800px] -top-40 -left-40 rounded-full blur-[140px] opacity-25 dark:opacity-40 transition-opacity pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(6,182,212,0.25) 50%, transparent 75%)",
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] -bottom-32 -right-32 rounded-full blur-[130px] opacity-20 dark:opacity-35 transition-opacity pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.35) 0%, rgba(139,92,246,0.2) 60%, transparent 80%)",
        }}
      />

      {/* 1. Multi-layered Starfield */}
      {showStars && (
        <StarField
          scrollY={scrollY}
          mouseX={normalizedX}
          mouseY={normalizedY}
        />
      )}

      {/* 2. Solar System Orbits */}
      {showSolarSystem && (
        <SolarSystem
          mouseX={normalizedX}
          mouseY={normalizedY}
        />
      )}

      {/* 3. 3D Rotating Moon with Parallax */}
      {showMoon && (
        <MoonParallax
          scrollY={scrollY}
          mouseX={normalizedX}
          mouseY={normalizedY}
        />
      )}
    </div>
  );
};

export default BackgroundAnimation;
