import { useMemo } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

/**
 * Interactive Concentric Solar System with Antigravity Mouse Spring Physics
 *
 * @param {Object} props
 * @param {number} props.mouseX - Normalized mouse X (-1 to 1)
 * @param {number} props.mouseY - Normalized mouse Y (-1 to 1)
 */
export const SolarSystem = ({ mouseX = 0, mouseY = 0 }) => {
  // Smooth Framer Motion spring physics for mouse follow / antigravity push
  const springConfig = { stiffness: 60, damping: 20 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  // Update spring targets when mouse moves
  useMemo(() => {
    springX.set(mouseX * 40);
    springY.set(mouseY * 40);
  }, [mouseX, mouseY, springX, springY]);

  // Planet specifications with orbital radii, orbital speeds, colors, and ring parameters
  const PLANETS = [
    {
      name: "Mercury",
      radius: 75,
      size: 8,
      color: "bg-warning border-warning/30",
      speed: "12s",
      glow: "rgb(var(--warning-rgb)/0.5)",
    },
    {
      name: "Venus",
      radius: 110,
      size: 11,
      color: "bg-warning border-warning/30",
      speed: "18s",
      glow: "rgba(253,186,116,0.5)",
    },
    {
      name: "Earth",
      radius: 155,
      size: 14,
      color: "bg-accent border-info/30",
      speed: "25s",
      glow: "rgb(var(--accent-rgb)/0.6)",
      hasMoon: true,
    },
    {
      name: "Mars",
      radius: 200,
      size: 12,
      color: "bg-error border-error",
      speed: "34s",
      glow: "rgb(var(--error-rgb)/0.5)",
    },
    {
      name: "Jupiter",
      radius: 260,
      size: 22,
      color: "bg-gradient-to-br from-warning to-warning border-warning/30",
      speed: "48s",
      glow: "rgba(217,119,6,0.5)",
    },
    {
      name: "Saturn",
      radius: 330,
      size: 20,
      color: "bg-gradient-to-br from-warning to-warning border-warning/30",
      speed: "62s",
      glow: "rgba(234,179,8,0.5)",
      hasRings: true,
    },
  ];

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none z-0"
      style={{
        x: springX,
        y: springY,
      }}
    >
      {/* ── Central Sun with pulsing solar flares ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-warning via-warning to-warning shadow-[0_0_50px_rgb(var(--warning-rgb)/0.8)] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-warning animate-ping opacity-30" />
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-warning/20 to-warning/20 blur-md animate-pulse" />
      </div>

      {/* ── Planet Orbits ── */}
      {PLANETS.map((planet) => {
        const orbitDiameter = planet.radius * 2;

        return (
          <div
            key={planet.name}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line pointer-events-none"
            style={{
              width: `${orbitDiameter}px`,
              height: `${orbitDiameter}px`,
            }}
          >
            {/* Revolving planet container */}
            <div
              className="w-full h-full relative"
              style={{
                animation: `spinOrbit ${planet.speed} linear infinite`,
              }}
            >
              {/* Planet sphere placed on orbit edge */}
              <div
                className={`absolute -top-[${planet.size / 2}px] left-1/2 -translate-x-1/2 rounded-full ${planet.color} border shadow-md flex items-center justify-center`}
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  boxShadow: `0 0 12px ${planet.glow}`,
                }}
              >
                {/* Saturn 3D Ring */}
                {planet.hasRings && (
                  <div className="absolute -inset-x-3 -inset-y-1 rounded-full border-2 border-warning/60 rotate-[25deg] shadow-[0_0_8px_rgba(234,179,8,0.4)] pointer-events-none" />
                )}

                {/* Earth's Orbiting Moon */}
                {planet.hasMoon && (
                  <div
                    className="absolute -inset-3 rounded-full pointer-events-none"
                    style={{
                      animation: "spinOrbit 4s linear infinite",
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-surface-hover border border-line-strong shadow-[0_0_4px_rgb(var(--primary-contrast-rgb)/0.8)] absolute -top-1 left-1/2 -translate-x-1/2" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Orbit rotation CSS animation */}
      <style>{`
        @keyframes spinOrbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default SolarSystem;
