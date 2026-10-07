import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MOTION_CONFIG } from "../../lib/motion";

/**
 * RouteTransitionWrapper
 *
 * Smooth page-entrance and route crossfade using Framer Motion AnimatePresence.
 * Completely eliminates artificial setTimeout skeleton delay.
 * Real data loading skeletons remain managed directly by auth and data queries.
 */
const RouteTransitionWrapper = ({ children }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Scroll to top on route change smoothly
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  if (shouldReduceMotion) {
    return <div className="h-full w-full">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: MOTION_CONFIG.durationPage,
            ease: MOTION_CONFIG.ease,
          },
        }}
        exit={{
          opacity: 0,
          y: -6,
          transition: {
            duration: 0.18,
            ease: "easeIn",
          },
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default RouteTransitionWrapper;
