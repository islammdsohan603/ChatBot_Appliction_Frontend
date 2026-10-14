import { useEffect, useState } from "react";
import { gsap, ScrollTrigger, smoothScrollTo } from "../../lib/gsap";
import { HiArrowUp } from "react-icons/hi2";

/**
 * ScrollProgress — Floating circular progress indicator & smooth back-to-top button.
 * The horizontal scrub progress line is now cleanly embedded directly under the sticky Navbar.
 */
export const ScrollProgress = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        onUpdate: (self) => {
          const p = Math.round(self.progress * 100);
          setScrollPercent(p);
          setShowTopBtn(self.progress > 0.08);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const handleScrollToTop = () => {
    smoothScrollTo(0, { duration: 1.2 });
  };

  return (
    <button
      onClick={handleScrollToTop}
      aria-label="Scroll back to top"
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-surface/90 backdrop-blur-md border border-line-strong text-fg shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group flex items-center justify-center ${
        showTopBtn
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* SVG Circular Progress Track */}
      <svg className="w-10 h-10 absolute -inset-0 m-auto -rotate-90 pointer-events-none" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-line-strong"
          strokeWidth="2"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-primary"
          strokeWidth="2.5"
          strokeDasharray="100"
          strokeDashoffset={100 - scrollPercent}
          strokeLinecap="round"
        />
      </svg>

      <HiArrowUp className="w-4 h-4 text-primary-text group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};

export default ScrollProgress;
