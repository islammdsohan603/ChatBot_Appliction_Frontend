/**
 * ═══════════════════════════════════════════════════════════════════
 * NEXORA AI — Central Motion & Animation System
 * Powered by Framer Motion.
 * 
 * Contains all central variants, easing curves, timing presets,
 * and micro-interaction variants in ONE tweakable location.
 * ═══════════════════════════════════════════════════════════════════
 */

// ── 1. Global Motion Settings (Tweakable in one place) ──
export const MOTION_CONFIG = {
  // Durations (in seconds)
  durationDefault: 0.6,
  durationFast: 0.3,
  durationSlow: 0.8,
  durationPage: 0.35,

  // Distances (in pixels)
  distanceDefault: 24,
  distanceLarge: 36,
  distanceSmall: 12,

  // Staggers (in seconds)
  staggerDefault: 0.09,
  staggerFast: 0.06,
  staggerSlow: 0.12,
  delayChildrenDefault: 0.1,

  // Viewport scroll-trigger settings
  viewportOnce: true,
  viewportAmount: 0.2, // Triggers when 20% of element is in view

  // Premium cubic-bezier curve (smooth deceleration, Linear/Vercel/Stripe style)
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

// ── 3. Central Core Variants ──

/**
 * Fade Up: Opacity 0 → 1, y 24 → 0
 */
export const fadeUp = {
  hidden: (custom = {}) => ({
    opacity: 0,
    y: custom.distance ?? MOTION_CONFIG.distanceDefault,
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
 * Fade Down: Opacity 0 → 1, y -24 → 0
 */
export const fadeDown = {
  hidden: (custom = {}) => ({
    opacity: 0,
    y: -(custom.distance ?? MOTION_CONFIG.distanceDefault),
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
 * Fade In: Opacity 0 → 1
 */
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

/**
 * Slide Left: Opacity 0 → 1, x 28 → 0 (enters from right toward left)
 */
export const slideLeft = {
  hidden: (custom = {}) => ({
    opacity: 0,
    x: custom.distance ?? 28,
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

/**
 * Slide Right: Opacity 0 → 1, x -28 → 0 (enters from left toward right)
 */
export const slideRight = {
  hidden: (custom = {}) => ({
    opacity: 0,
    x: -(custom.distance ?? 28),
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

/**
 * Scale In: Opacity 0 → 1, scale 0.95 → 1
 */
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
 * Stagger Container: Orchestrates children reveals
 */
export const staggerContainer = {
  hidden: {
    opacity: 0,
  },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger ?? MOTION_CONFIG.staggerDefault,
      delayChildren: custom.delayChildren ?? MOTION_CONFIG.delayChildrenDefault,
    },
  }),
};

// ── 4. Reduced Motion Fallback Variants ──
export const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

// ── 5. Micro-Interaction Variants ──

/**
 * Button Hover & Tap Micro-interactions
 * Scale 1.03 with lift on hover, scale 0.97 on tap
 */
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

/**
 * Card Hover Micro-interactions
 * Y -4 lift with smooth ease
 */
export const cardHoverMotion = {
  hover: {
    y: -4,
    transition: { duration: 0.25, ease: MOTION_CONFIG.ease },
  },
};

/**
 * Chat Message Entrance Variants
 * User bubble slides from right (x: 20 → 0, y: 12 → 0)
 * Bot bubble slides from left (x: -20 → 0, y: 12 → 0)
 */
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

/**
 * Page Route Transition Variant (0.35s fade + slight y shift)
 */
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

// ── 6. Map of named variants for easy lookup ──
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
