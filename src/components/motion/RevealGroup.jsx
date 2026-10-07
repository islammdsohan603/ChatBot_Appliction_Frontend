import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  staggerContainer,
  VARIANTS_MAP,
  MOTION_CONFIG,
  reducedMotionVariants,
} from "../../lib/motion";

/**
 * RevealGroup Component
 *
 * Orchestrates staggered reveals for groups of elements (grids, lists, cards).
 * Uses whileInView with viewport={{ once: true, amount: 0.2 }} by default.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.stagger] - Delay between children in seconds (defaults to MOTION_CONFIG.staggerDefault: 0.09s)
 * @param {number} [props.delayChildren] - Delay before first child in seconds (defaults to 0.1s)
 * @param {Object} [props.viewport] - Custom viewport settings
 * @param {boolean} [props.playOnMount=false] - If true, animates on mount (ideal for hero stats)
 * @param {string} [props.className=""] - Additional CSS classes
 * @param {string|React.Component} [props.as="div"] - Polymorphic container element
 */
export const RevealGroup = ({
  children,
  stagger,
  delayChildren,
  viewport,
  playOnMount = false,
  className = "",
  as = "div",
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  const finalViewport = viewport ?? {
    once: MOTION_CONFIG.viewportOnce,
    amount: MOTION_CONFIG.viewportAmount,
  };

  const customProps = {
    stagger: stagger ?? MOTION_CONFIG.staggerDefault,
    delayChildren: delayChildren ?? MOTION_CONFIG.delayChildrenDefault,
  };

  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <MotionComponent
        initial="hidden"
        {...(playOnMount
          ? { animate: "visible" }
          : { whileInView: "visible", viewport: finalViewport })}
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
      {...(playOnMount
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: finalViewport })}
      variants={staggerContainer}
      custom={customProps}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * RevealItem Component
 *
 * Child item inside a RevealGroup that inherits stagger orchestration.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {"fadeUp"|"fadeIn"|"fadeDown"|"slideLeft"|"slideRight"|"scaleIn"|Object} [props.variant="fadeUp"]
 * @param {number} [props.duration]
 * @param {number} [props.distance]
 * @param {string} [props.className=""]
 * @param {string|React.Component} [props.as="div"]
 * @param {Object} [props.whileHover]
 * @param {Object} [props.whileTap]
 */
export const RevealItem = ({
  children,
  variant = "fadeUp",
  duration,
  distance,
  className = "",
  as = "div",
  whileHover,
  whileTap,
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  const selectedVariant =
    typeof variant === "string"
      ? VARIANTS_MAP[variant] || VARIANTS_MAP.fadeUp
      : variant;

  const customProps = {
    duration: duration ?? MOTION_CONFIG.durationDefault,
    distance: distance ?? MOTION_CONFIG.distanceDefault,
  };

  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <MotionComponent
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

export default { RevealGroup, RevealItem };
