import { useEffect } from "react";
import Lenis from "lenis";

/**
 * useSmoothScroll — Ultra-fluid momentum smooth scrolling with Lenis.
 * Applies physics-based momentum on wheel and touch, giving users a luxurious scroll experience.
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    // Respect user's prefers-reduced-motion setting
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
};

export default useSmoothScroll;
