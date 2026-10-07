import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { VARIANTS_MAP, MOTION_CONFIG, reducedMotionVariants } from "../../lib/motion";

/**
 * Reusable Reveal component
 *
 * Smoothly animates a single element into view when scrolled into viewport.
 * Uses whileInView with viewport={{ once: true, amount: 0.2 }} by default.
 * Respects prefers-reduced-motion automatically.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {"fadeUp"|"fadeIn"|"fadeDown"|"slideLeft"|"slideRight"|"scaleIn"|Object} [props.variant="fadeUp"] - Named variant or custom variant object
 * @param {number} [props.delay=0] - Delay in seconds
 * @param {number} [props.duration] - Duration in seconds (defaults to MOTION_CONFIG.durationDefault: 0.6s)
 * @param {number} [props.distance] - Translation distance in pixels
 * @param {Object} [props.viewport] - Custom viewport settings
 * @param {boolean} [props.playOnMount=false] - If true, animates immediately on mount (for hero elements)
 * @param {string} [props.className=""] - Additional CSS classes
 * @param {string|React.Component} [props.as="div"] - HTML element tag (polymorphic)
 * @param {Object} [props.whileHover] - Optional hover animation (e.g. lift)
 * @param {Object} [props.whileTap] - Optional tap animation
 */
export const Reveal = ({
  children,
  variant = "fadeUp",
  delay = 0,
  duration,
  distance,
  viewport,
  playOnMount = false,
  className = "",
  as = "div",
  whileHover,
  whileTap,
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Resolve base variant
  const selectedVariant = typeof variant === "string" ? VARIANTS_MAP[variant] || VARIANTS_MAP.fadeUp : variant;

  const customProps = {
    delay,
    duration: duration ?? MOTION_CONFIG.durationDefault,
    distance: distance ?? MOTION_CONFIG.distanceDefault,
  };

  const finalViewport = viewport ?? {
    once: MOTION_CONFIG.viewportOnce,
    amount: MOTION_CONFIG.viewportAmount,
  };

  // Polymorphic motion element (motion.div, motion.section, etc.)
  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <MotionComponent
        initial="hidden"
        {...(playOnMount ? { animate: "visible" } : { whileInView: "visible", viewport: finalViewport })}
        variants={reducedMotionVariants}
        className={className}
        {...rest}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      initial="hidden"
      {...(playOnMount ? { animate: "visible" } : { whileInView: "visible", viewport: finalViewport })}
      variants={selectedVariant}
      custom={customProps}
      whileHover={whileHover}
      whileTap={whileTap}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
};

export default Reveal;
