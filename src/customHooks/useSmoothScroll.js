import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import { initLenisScrollTriggerSync, setGlobalLenis, smoothScrollTo, refreshScrollTrigger } from "../lib/gsap";

/**
 * useSmoothScroll — Ultra-fluid momentum smooth scrolling with Lenis + GSAP ScrollTrigger synchronization.
 * 
 * Features:
 *  - High-performance physics-based inertial scrolling.
 *  - Fully synchronized with GSAP ScrollTrigger's ticker and update cycles.
 *  - Auto-smooth scrolls all anchor links (#features, #pricing, #faq, etc.).
 *  - Automatically recalibrates ScrollTrigger triggers on route transitions and layout shifts.
 *  - Fully respects prefers-reduced-motion.
 */
export const useSmoothScroll = (options = {}) => {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    // Respect user's prefers-reduced-motion setting
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: options.duration || 1.15,
      easing: options.easing || ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      infinite: false,
      ...options,
    });

    lenisRef.current = lenis;

    // Bind Lenis to GSAP ScrollTrigger
    const unbind = initLenisScrollTriggerSync(lenis);

    // Global anchor click listener for buttery smooth section navigation (#section-id)
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href*="#"]');
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || href === "#") return;

      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const hash = href.substring(hashIndex);
      const isSamePage = href.startsWith("#") || href.startsWith(window.location.pathname + "#");

      if (isSamePage && hash.length > 1) {
        const el = document.querySelector(hash);
        if (el) {
          e.preventDefault();
          smoothScrollTo(el, { offset: -80, duration: 1.2 });
          // Update URL hash without jumping
          window.history.pushState(null, "", hash);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    // Initial ScrollTrigger refresh after DOM layout completes
    const timer = setTimeout(() => {
      refreshScrollTrigger();
    }, 120);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      unbind();
      lenis.destroy();
      setGlobalLenis(null);
      lenisRef.current = null;
    };
  }, []);

  // Recalibrate on route changes and control chat route scroll
  useEffect(() => {
    if (!lenisRef.current) return;

    if (location.pathname.startsWith("/chat")) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    const refreshTimer = setTimeout(() => {
      refreshScrollTrigger();
    }, 150);

    return () => clearTimeout(refreshTimer);
  }, [location.pathname]);

  return lenisRef.current;
};

export default useSmoothScroll;
