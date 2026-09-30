import { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Multi-layered dynamic StarField with parallax scroll & mouse interaction
 *
 * @param {Object} props
 * @param {number} props.scrollY - Scroll position
 * @param {number} props.mouseX - Normalized mouse X (-1 to 1)
 * @param {number} props.mouseY - Normalized mouse Y (-1 to 1)
 */
export const StarField = ({ scrollY = 0, mouseX = 0, mouseY = 0 }) => {
  // Generate deterministic star positions for 3 depth layers
  const stars = useMemo(() => {
    const layer1 = []; // Deep background (small, slow parallax, high count)
    const layer2 = []; // Midground (medium, medium parallax)
    const layer3 = []; // Foreground (larger, fast parallax, twinkling)

    for (let i = 0; i < 45; i++) {
      layer1.push({
        id: `bg-${i}`,
        left: `${(i * 17 + 7) % 100}%`,
        top: `${(i * 23 + 11) % 100}%`,
        size: (i % 2) + 1,
        opacity: (i % 4) * 0.15 + 0.35,
      });
    }

    for (let i = 0; i < 25; i++) {
      layer2.push({
        id: `mid-${i}`,
        left: `${(i * 29 + 13) % 100}%`,
        top: `${(i * 37 + 19) % 100}%`,
        size: (i % 2) + 2,
        color: i % 3 === 0 ? "rgba(139,92,246,0.8)" : i % 3 === 1 ? "rgba(6,182,212,0.8)" : "rgba(255,255,255,0.9)",
        opacity: (i % 3) * 0.2 + 0.4,
      });
    }

    for (let i = 0; i < 12; i++) {
      layer3.push({
        id: `fore-${i}`,
        left: `${(i * 41 + 23) % 100}%`,
        top: `${(i * 47 + 31) % 100}%`,
        size: (i % 2) + 3,
        color: i % 2 === 0 ? "#ec4899" : "#a855f7",
        duration: (i % 3) + 2.5,
      });
    }

    return { layer1, layer2, layer3 };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 1: Background stars (deep field, slow movement) */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: scrollY * 0.05,
          x: mouseX * -15,
        }}
      >
        {stars.layer1.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white dark:bg-slate-200"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: "0 0 4px rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </motion.div>

      {/* Layer 2: Midground stars (colored glow, medium parallax) */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: scrollY * 0.12,
          x: mouseX * -30,
        }}
      >
        {stars.layer2.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              opacity: star.opacity,
              boxShadow: `0 0 8px ${star.color}`,
              animationDuration: "3s",
            }}
          />
        ))}
      </motion.div>

      {/* Layer 3: Foreground twinkling stars (fast parallax & antigravity drift) */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: scrollY * 0.22,
          x: mouseX * -50,
        }}
      >
        {stars.layer3.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 0.95, 0.4],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: `0 0 12px ${star.color}`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default StarField;
