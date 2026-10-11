import React from "react";
import { Reveal } from "../motion/Reveal";
import { RevealStack, RevealItem } from "../motion/RevealStack";
import { MOTION_CONFIG } from "../../lib/motion";

/**
 * ScrollReveal (Bridge Component)
 *
 * Bridges the legacy ScrollReveal component API directly to the unified Framer Motion system.
 * Translates props (animation -> variant, delay in ms -> seconds, distance in px -> number).
 */
export const ScrollReveal = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = MOTION_CONFIG.durationDefault,
  distance = MOTION_CONFIG.distanceDefault,
  y,
  once = MOTION_CONFIG.viewportOnce,
  amount = MOTION_CONFIG.viewportAmount,
  className = "",
  as = "div",
  whileHover,
  whileTap,
  ...rest
}) => {
  let variant = "fadeUp";
  if (animation === "fade-down") variant = "fadeDown";
  else if (animation === "fade-in") variant = "fadeIn";
  else if (animation === "scale-in" || animation === "scale") variant = "scaleIn";
  else if (animation === "slide-left") variant = "slideLeft";
  else if (animation === "slide-right") variant = "slideRight";

  const normalizedDelay = delay > 10 ? delay / 1000 : delay;
  const normalizedDuration = duration > 10 ? duration / 1000 : duration;
  const rawDist = y !== undefined ? y : distance;
  const normalizedDistance = typeof rawDist === "string" ? parseInt(rawDist, 10) || MOTION_CONFIG.distanceDefault : rawDist;

  return (
    <Reveal
      variant={variant}
      delay={normalizedDelay}
      duration={normalizedDuration}
      y={normalizedDistance}
      once={once}
      amount={amount}
      className={className}
      as={as}
      whileHover={whileHover}
      whileTap={whileTap}
      {...rest}
    >
      {children}
    </Reveal>
  );
};

export const ScrollRevealGroup = ({
  children,
  stagger = MOTION_CONFIG.staggerDefault,
  delay = 0,
  delayChildren,
  amount = MOTION_CONFIG.stackViewportAmount,
  once = MOTION_CONFIG.viewportOnce,
  className = "",
  as = "div",
  ...rest
}) => {
  const normalizedStagger = stagger > 10 ? stagger / 1000 : stagger;
  const effectiveDelay = delayChildren !== undefined ? delayChildren : delay;
  const normalizedDelay = effectiveDelay > 10 ? effectiveDelay / 1000 : effectiveDelay;

  return (
    <RevealStack
      stagger={normalizedStagger}
      delay={normalizedDelay}
      amount={amount}
      once={once}
      className={className}
      as={as}
      {...rest}
    >
      {children}
    </RevealStack>
  );
};

export const ScrollRevealItem = ({
  children,
  animation = "fade-up",
  distance = MOTION_CONFIG.distanceDefault,
  y,
  duration = MOTION_CONFIG.durationDefault,
  className = "",
  as = "div",
  whileHover,
  whileTap,
  ...rest
}) => {
  let variant = "fadeUp";
  if (animation === "fade-down") variant = "fadeDown";
  else if (animation === "fade-in") variant = "fadeIn";
  else if (animation === "scale-in") variant = "scaleIn";
  else if (animation === "slide-left") variant = "slideLeft";
  else if (animation === "slide-right") variant = "slideRight";

  const normalizedDuration = duration > 10 ? duration / 1000 : duration;
  const rawDist = y !== undefined ? y : distance;
  const normalizedDistance = typeof rawDist === "string" ? parseInt(rawDist, 10) || MOTION_CONFIG.distanceDefault : rawDist;

  return (
    <RevealItem
      variant={variant}
      duration={normalizedDuration}
      y={normalizedDistance}
      className={className}
      as={as}
      whileHover={whileHover}
      whileTap={whileTap}
      {...rest}
    >
      {children}
    </RevealItem>
  );
};

export const useScrollReveal = () => {
  return [{ current: null }, true];
};

export default ScrollReveal;
