/**
 * ═══════════════════════════════════════════════════════════════════
 * NEXORA AI — Central Motion & Animation System
 * Powered by Framer Motion.
 *
 * All animation presets, easing curves, timing, and viewport settings
 * live in this file. Adjust settings here to tweak the motion system globally.
 * ═══════════════════════════════════════════════════════════════════
 */

// ── 1. Global Motion Settings (Tweakable in one place) ──
export const MOTION_CONFIG = {
  // Durations (in seconds: 0.6s to 0.8s)
  durationDefault: 0.7,
  durationFast: 0.35,
  durationSlow: 0.8,
  durationPage: 0.35,

  // Distances (start state: translateY 40px)
  distanceDefault: 40,
  distanceLarge: 48,
  distanceSmall: 20,

  // Staggers (in seconds: 0.08s to 0.12s)
  staggerDefault: 0.1,
  staggerFast: 0.08,
  staggerSlow: 0.12,
  delayChildrenDefault: 0,

  // Viewport scroll-trigger settings
  viewportOnce: true,
  viewportAmount: 0.2, // Triggers when 20% of the container enters viewport
  stackViewportAmount: 0.15, // Triggers staggered groups when 15% is in view

  // Premium ease-out cubic-bezier curve (smooth deceleration)
  ease: [0.22, 1, 0.36, 1],
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.42, 0, 0.58, 1],
};

// ── 2. Standard Transition Factory ──
export const createTransition = ({
  duration = MOTION_CONFIG.durationDefault,
  delay = 0,
  ease = MOTION_CONFIG.ease,
} = {}) => ({
  duration,
  delay,
  ease,
});

// ── 3. Core Scroll Reveal Variants (Transform and Opacity only) ──

/**
 * Standard Fade-and-Rise Variant
 * Start state: opacity 0, translateY 40px. End state: opacity 1, translateY 0.
 */
export const fadeUp = {
  hidden: (custom = {}) => ({
    opacity: 0,
    y: custom.y ?? custom.distance ?? MOTION_CONFIG.distanceDefault,
  }),
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration ?? MOTION_CONFIG.durationDefault,
      delay: custom.delay ?? 0,
      ease: custom.ease ?? MOTION_CONFIG.ease,
    },
  }),
};

/**
 * Directional Fallbacks for Specific Hero/UI Entrances
 */
export const fadeDown = {
  hidden: (custom = {}) => ({
    opacity: 0,
    y: -(custom.y ?? custom.distance ?? MOTION_CONFIG.distanceDefault),
  }),
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration ?? MOTION_CONFIG.durationDefault,
      delay: custom.delay ?? 0,
      ease: custom.ease ?? MOTION_CONFIG.ease,
    },
  }),
};

export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      duration: custom.duration ?? MOTION_CONFIG.durationDefault,
      delay: custom.delay ?? 0,
      ease: custom.ease ?? MOTION_CONFIG.ease,
    },
  }),
};

export const slideLeft = {
  hidden: (custom = {}) => ({
    opacity: 0,
    x: custom.distance ?? MOTION_CONFIG.distanceDefault,
  }),
  visible: (custom = {}) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom.duration ?? MOTION_CONFIG.durationDefault,
      delay: custom.delay ?? 0,
      ease: custom.ease ?? MOTION_CONFIG.ease,
    },
  }),
};

export const slideRight = {
  hidden: (custom = {}) => ({
    opacity: 0,
    x: -(custom.distance ?? MOTION_CONFIG.distanceDefault),
  }),
  visible: (custom = {}) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom.duration ?? MOTION_CONFIG.durationDefault,
      delay: custom.delay ?? 0,
      ease: custom.ease ?? MOTION_CONFIG.ease,
    },
  }),
};

export const scaleIn = {
  hidden: (custom = {}) => ({
    opacity: 0,
    scale: custom.initialScale ?? 0.95,
  }),
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: custom.duration ?? MOTION_CONFIG.durationDefault,
      delay: custom.delay ?? 0,
      ease: custom.ease ?? MOTION_CONFIG.ease,
    },
  }),
};

/**
 * Stagger Container Variant for Grids & Lists
 * Orchestrates children item reveals sequentially
 */
export const staggerContainer = {
  hidden: {
    opacity: 0,
  },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger ?? MOTION_CONFIG.staggerDefault,
      delayChildren: custom.delay ?? custom.delayChildren ?? MOTION_CONFIG.delayChildrenDefault,
    },
  }),
};

// ── 4. Reduced Motion Fallback Variants (Instant / subtle opacity fade) ──
export const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
};

// ── 5. Micro-Interaction Variants ──
export const buttonMotion = {
  hover: {
    scale: 1.03,
    y: -1.5,
    transition: { duration: 0.2, ease: MOTION_CONFIG.ease },
  },
  tap: {
    scale: 0.97,
    y: 0,
    transition: { duration: 0.1 },
  },
};

export const cardHoverMotion = {
  hover: {
    y: -4,
    transition: { duration: 0.25, ease: MOTION_CONFIG.ease },
  },
};

export const chatUserBubbleMotion = {
  hidden: {
    opacity: 0,
    x: 20,
    y: 12,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: MOTION_CONFIG.ease,
    },
  },
};

export const chatBotBubbleMotion = {
  hidden: {
    opacity: 0,
    x: -20,
    y: 12,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: MOTION_CONFIG.ease,
    },
  },
};

export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_CONFIG.durationPage,
      ease: MOTION_CONFIG.ease,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const VARIANTS_MAP = {
  fadeUp,
  fadeIn,
  fadeDown,
  slideLeft,
  slideRight,
  scaleIn,
};

export default {
  MOTION_CONFIG,
  createTransition,
  fadeUp,
  fadeDown,
  fadeIn,
  slideLeft,
  slideRight,
  scaleIn,
  staggerContainer,
  buttonMotion,
  cardHoverMotion,
  chatUserBubbleMotion,
  chatBotBubbleMotion,
  pageTransitionVariants,
  VARIANTS_MAP,
};
