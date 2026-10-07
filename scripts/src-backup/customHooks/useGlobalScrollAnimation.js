import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * useGlobalScrollAnimation
 * Ensures all elements across all routes marked with '.scroll-reveal',
 * '[data-scroll-reveal]', or '[data-scroll-up]' smoothly animate upwards
 * from the bottom upon scrolling into view.
 */
export const useGlobalScrollAnimation = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: immediately reveal all elements if observer unavailable
      document.querySelectorAll(".scroll-reveal, [data-scroll-reveal], [data-scroll-up]").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    // Check reduced motion preference
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".scroll-reveal, [data-scroll-reveal], [data-scroll-up]").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(
        ".scroll-reveal:not(.is-revealed), [data-scroll-reveal]:not(.is-revealed), [data-scroll-up]:not(.is-revealed)"
      );

      elements.forEach((el) => {
        // Read custom data-delay or data-distance if present
        const delay = el.getAttribute("data-delay");
        if (delay) {
          el.style.transitionDelay = `${delay}ms`;
        }
        const distance = el.getAttribute("data-distance");
        if (distance) {
          el.style.setProperty("--reveal-distance", `${distance}px`);
        }
        observer.observe(el);
      });
    };

    // Multi-stage timers to sync with skeleton transitions (0ms, 350ms, 600ms)
    const timers = [
      setTimeout(observeElements, 100),
      setTimeout(observeElements, 350),
      setTimeout(observeElements, 650),
    ];

    // Debounced mutation observer for dynamic DOM changes
    let mutationObserver = null;
    let debounceTimer = null;
    if (typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(observeElements, 50);
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      timers.forEach(clearTimeout);
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, [location.pathname]);
};

export default useGlobalScrollAnimation;
