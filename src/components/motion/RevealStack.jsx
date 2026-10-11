 
import { motion, useReducedMotion } from "framer-motion";
import {
  staggerContainer,
  VARIANTS_MAP,
  MOTION_CONFIG,
  reducedMotionVariants,
} from "../../lib/motion";

/**
 * <RevealStack>
 * Orchestrates staggered reveals for grids and lists so children appear sequentially.
 *
 * Triggered once when 15% of the container enters the viewport.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.as="div"] - Container tag ("div", "section", "ul", etc.)
 * @param {number} [props.stagger=MOTION_CONFIG.staggerDefault] - Stagger interval between items (default 0.1s)
 * @param {number} [props.delay=MOTION_CONFIG.delayChildrenDefault] - Delay before first item begins (default 0s)
 * @param {number} [props.amount=MOTION_CONFIG.stackViewportAmount] - Viewport entry threshold (default 0.15)
 * @param {boolean} [props.once=MOTION_CONFIG.viewportOnce] - Only trigger once (default true)
 * @param {string} [props.className=""] - CSS classes
 * @param {boolean} [props.playOnMount=false] - If true, animates on mount (e.g. hero stats)
 */
export const RevealStack = ({
  children,
  as = "div",
  stagger = MOTION_CONFIG.staggerDefault,
  delay = MOTION_CONFIG.delayChildrenDefault,
  amount = MOTION_CONFIG.stackViewportAmount,
  once = MOTION_CONFIG.viewportOnce,
  className = "",
  playOnMount = false,
  style,
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  const viewportConfig = {
    once,
    amount,
  };

  const customProps = {
    stagger,
    delay,
    delayChildren: delay,
  };

  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <MotionComponent
        initial="hidden"
        {...(playOnMount ? { animate: "visible" } : { whileInView: "visible", viewport: viewportConfig })}
        variants={reducedMotionVariants}
        className={className}
        style={style}
        {...rest}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      initial="hidden"
      {...(playOnMount ? { animate: "visible" } : { whileInView: "visible", viewport: viewportConfig })}
      variants={staggerContainer}
      custom={customProps}
      className={className}
      style={{
        ...style,
        willChange: "transform, opacity",
      }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * <RevealItem>
 * Individual child item inside a <RevealStack>.
 *
 * Inherits stagger orchestration and uses the standard fade-and-rise variant:
 * Start state: opacity 0, translateY 40px -> End state: opacity 1, translateY 0.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.as="div"]
 * @param {number} [props.y=MOTION_CONFIG.distanceDefault]
 * @param {number} [props.duration=MOTION_CONFIG.durationDefault]
 * @param {string|Object} [props.variant="fadeUp"]
 * @param {string} [props.className=""]
 * @param {Object} [props.whileHover]
 * @param {Object} [props.whileTap]
 */
export const RevealItem = ({
  children,
  as = "div",
  y = MOTION_CONFIG.distanceDefault,
  duration = MOTION_CONFIG.durationDefault,
  variant = "fadeUp",
  className = "",
  whileHover,
  whileTap,
  style,
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  const selectedVariant =
    typeof variant === "string"
      ? VARIANTS_MAP[variant] || VARIANTS_MAP.fadeUp
      : variant;

  const customProps = {
    duration,
    y: typeof y === "string" ? parseInt(y, 10) || MOTION_CONFIG.distanceDefault : y,
    distance: typeof y === "string" ? parseInt(y, 10) || MOTION_CONFIG.distanceDefault : y,
  };

  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return (
      <MotionComponent
        variants={reducedMotionVariants}
        className={className}
        style={style}
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
      style={{
        ...style,
        willChange: "transform, opacity",
      }}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
};

// Backwards compatibility alias
export const RevealGroup = RevealStack;

export default { RevealStack, RevealItem, RevealGroup };
