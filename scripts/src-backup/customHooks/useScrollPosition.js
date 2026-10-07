import { useState, useEffect } from "react";

/**
 * Custom hook to track scroll position and scroll percentage at 60fps
 *
 * @returns {{ scrollY: number, scrollProgress: number, scrollDirection: "up" | "down" }}
 */
export const useScrollPosition = () => {
  const [scrollData, setScrollData] = useState({
    scrollY: 0,
    scrollProgress: 0,
    scrollDirection: "down",
  });

  useEffect(() => {
    let lastScrollY = window.scrollY || 0;
    let ticking = false;

    const updateScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = totalHeight > 0 ? (currentScrollY / totalHeight) * 100 : 0;
      const direction = currentScrollY > lastScrollY ? "down" : "up";

      setScrollData({
        scrollY: currentScrollY,
        scrollProgress: progress,
        scrollDirection: direction,
      });

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    // Initialize position
    updateScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollData;
};

export default useScrollPosition;
