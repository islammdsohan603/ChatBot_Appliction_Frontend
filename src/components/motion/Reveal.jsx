 
import { motion, useReducedMotion } from "framer-motion";
import { VARIANTS_MAP, MOTION_CONFIG, reducedMotionVariants } from "../../lib/motion";

/**
 * <Reveal>
 * Standard single-container scroll reveal.
 *
 * Starts at opacity 0, translateY 40px and rises smoothly to opacity 1, translateY 0.
 * Triggers once when 20% of the container enters the viewport.
 * Automatically respects prefers-reduced-motion.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.as="div"] - HTML tag (polymorphic: "div", "section", "article", etc.)
 * @param {number} [props.delay=0] - Initial delay in seconds
 * @param {number} [props.y=MOTION_CONFIG.distanceDefault] - Vertical translate distance in px (default 40)
 * @param {number} [props.duration=MOTION_CONFIG.durationDefault] - Duration in seconds (default 0.7)
 * @param {boolean} [props.once=MOTION_CONFIG.viewportOnce] - Only trigger once (default true)
 * @param {number} [props.amount=MOTION_CONFIG.viewportAmount] - Viewport entry threshold (default 0.2)
 * @param {string} [props.className=""] - CSS classes
 * @param {boolean} [props.playOnMount=false] - For above-the-fold hero containers
 * @param {string|Object} [props.variant="fadeUp"] - Named variant
 * @param {Object} [props.whileHover]
 * @param {Object} [props.whileTap]
 */
export const Reveal = ({
  children,
  as = "div",
  delay = 0,
  y = MOTION_CONFIG.distanceDefault,
  duration = MOTION_CONFIG.durationDefault,
  once = MOTION_CONFIG.viewportOnce,
  amount = MOTION_CONFIG.viewportAmount,
  className = "",
  playOnMount = false,
  variant = "fadeUp",
  whileHover,
  whileTap,
  style,
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Selected base variant
  const selectedVariant =
    typeof variant === "string"
      ? VARIANTS_MAP[variant] || VARIANTS_MAP.fadeUp
      : variant;

  const customProps = {
    delay,
    duration,
    y: typeof y === "string" ? parseInt(y, 10) || MOTION_CONFIG.distanceDefault : y,
    distance: typeof y === "string" ? parseInt(y, 10) || MOTION_CONFIG.distanceDefault : y,
  };

  const viewportConfig = {
    once,
    amount,
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

export default Reveal;
