import { useState, useEffect } from "react";

/**
 * Custom hook to track viewport mouse position and normalized coordinates (-1 to 1)
 *
 * @returns {{ x: number, y: number, normalizedX: number, normalizedY: number }}
 */
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    let ticking = false;
    let targetX = 0;
    let targetY = 0;

    const updateMousePosition = () => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;

      // Normalized coordinates from -1 (left/top) to +1 (right/bottom)
      const normX = (targetX / width) * 2 - 1;
      const normY = (targetY / height) * 2 - 1;

      setMousePosition({
        x: targetX,
        y: targetY,
        normalizedX: normX,
        normalizedY: normY,
      });

      ticking = false;
    };

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!ticking) {
        window.requestAnimationFrame(updateMousePosition);
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
};

export default useMousePosition;
