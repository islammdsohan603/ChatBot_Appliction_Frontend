import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins globally once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Global reference to active Lenis instance for smooth scrolling between sections
let globalLenis = null;
let tickerCallback = null;

export const setGlobalLenis = (lenis) => {
  globalLenis = lenis;
};

export const getGlobalLenis = () => {
  return globalLenis;
};

/**
 * Binds Lenis momentum scroll to GSAP ScrollTrigger ticker and scroll updates.
 * Follows the official GSAP & Lenis recommended synchronization pattern.
 */
export const initLenisScrollTriggerSync = (lenis) => {
  if (!lenis) return () => {};

  setGlobalLenis(lenis);

  // Synchronize Lenis scroll events with GSAP's ScrollTrigger
  const onScroll = () => {
    ScrollTrigger.update();
  };
  lenis.on("scroll", onScroll);

  // Drive Lenis RAF inside GSAP's central ticker for unified timing
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
  }

  tickerCallback = (time) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);

  // Disable GSAP lag smoothing to eliminate micro-stuttering during momentum scrolling
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.off("scroll", onScroll);
    if (tickerCallback) {
      gsap.ticker.remove(tickerCallback);
      tickerCallback = null;
    }
  };
};

/**
 * Smoothly scrolls to any element, CSS selector, or position offset.
 * Automatically accounts for sticky navbar header offsets (-80px).
 */
export const smoothScrollTo = (target, options = {}) => {
  if (typeof window === "undefined") return;

  const defaults = {
    offset: -84,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  };

  const config = { ...defaults, ...options };

  if (globalLenis) {
    globalLenis.scrollTo(target, config);
  } else {
    // Fallback if Lenis is not yet mounted
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset + config.offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }
};

/**
 * Safely refreshes all ScrollTrigger instances.
 * Essential on route changes and async content loaded.
 */
export const refreshScrollTrigger = () => {
  if (typeof window !== "undefined") {
    // Small timeout ensures DOM layout has completely stabilized
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
};

export { gsap, ScrollTrigger };
export default gsap;
