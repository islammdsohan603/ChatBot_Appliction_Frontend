import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { pageTransitionVariants, MOTION_CONFIG } from "../../lib/motion";

/**
 * PageTransition Component
 *
 * Wraps individual page content for smooth entrance/exit.
 */
export const PageTransition = ({ children, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={`w-full ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariants}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * PageTransitionWrapper Component
 *
 * Listens for route changes and wraps the active route with AnimatePresence.
 * Replaces artificial setTimeout skeleton delay with instant, buttery smooth route entrances.
 */
export const PageTransitionWrapper = ({ children }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className="min-h-full w-full">{children}</div>;
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
        className="min-h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
