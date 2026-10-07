import React from "react";
import { Reveal } from "../motion/Reveal";
import { RevealGroup, RevealItem } from "../motion/RevealGroup";

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
  duration = 600,
  distance = 24,
  once = true,
  className = "",
  as = "div",
  whileHover,
  whileTap,
  ...rest
}) => {
  // Normalize animation variant name
  let variant = "fadeUp";
  if (animation === "fade-down") variant = "fadeDown";
  else if (animation === "fade-in") variant = "fadeIn";
  else if (animation === "scale-in" || animation === "scale") variant = "scaleIn";
  else if (animation === "slide-left") variant = "slideLeft";
  else if (animation === "slide-right") variant = "slideRight";

  // Normalize delay: if > 10, assume milliseconds and convert to seconds
  const normalizedDelay = delay > 10 ? delay / 1000 : delay;
  const normalizedDuration = duration > 10 ? duration / 1000 : duration;
  const normalizedDistance = typeof distance === "string" ? parseInt(distance, 10) || 24 : distance;

  return (
    <Reveal
      variant={variant}
      delay={normalizedDelay}
      duration={normalizedDuration}
      distance={normalizedDistance}
      viewport={{ once, amount: 0.2 }}
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
  stagger = 90,
  delayChildren = 0.1,
  className = "",
  as = "div",
  ...rest
}) => {
  const normalizedStagger = stagger > 10 ? stagger / 1000 : stagger;

  return (
    <RevealGroup
      stagger={normalizedStagger}
      delayChildren={delayChildren}
      className={className}
      as={as}
      {...rest}
    >
      {children}
    </RevealGroup>
  );
};

export const ScrollRevealItem = ({
  children,
  animation = "fade-up",
  distance = 24,
  duration = 600,
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
  const normalizedDistance = typeof distance === "string" ? parseInt(distance, 10) || 24 : distance;

  return (
    <RevealItem
      variant={variant}
      duration={normalizedDuration}
      distance={normalizedDistance}
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
  // Retained for backward-compatibility if any hook uses it
  return [{ current: null }, true];
};

export default ScrollReveal;
