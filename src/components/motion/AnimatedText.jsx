import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_CONFIG } from "../../lib/motion";

/**
 * AnimatedText Component
 *
 * Reveals headlines word-by-word with smooth upward fades and stagger.
 * Supports highlighting with brand gradients and an optional soft shine sweep.
 *
 * @param {Object} props
 * @param {string} props.text - Main text to animate
 * @param {string} [props.highlight=""] - Trailing or embedded phrase to highlight with gradient
 * @param {string} [props.highlightClassName=""] - Styling for highlighted words
 * @param {number} [props.delay=0.15] - Initial delay before starting word reveals
 * @param {number} [props.stagger=0.05] - Delay between consecutive words
 * @param {boolean} [props.shine=true] - Soft shine sweep across highlighted text
 * @param {string} [props.className=""] - Base wrapper class
 * @param {string} [props.as="h1"] - HTML heading tag
 * @param {boolean} [props.playOnMount=true] - Animate on mount rather than waiting for scroll
 */
export const AnimatedText = ({
  text = "",
  highlight = "",
  highlightClassName = "text-gradient text-transparent inline-block",
  delay = 0.15,
  stagger = 0.05,
  shine = true,
  className = "",
  as = "h1",
  playOnMount = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const HeadingTag = as || "h1";

  if (shouldReduceMotion) {
    return (
      <HeadingTag className={className}>
        {text}
        {highlight && (
          <>
            {" "}
            <span className={highlightClassName}>{highlight}</span>
          </>
        )}
      </HeadingTag>
    );
  }

  // Split standard text into words
  const baseWords = text ? text.split(" ") : [];
  const highlightWords = highlight ? highlight.split(" ") : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 18,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: MOTION_CONFIG.ease,
      },
    },
  };

  const highlightContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay + baseWords.length * stagger + 0.05,
        staggerChildren: stagger * 1.2,
      },
    },
  };

  return (
    <HeadingTag className={className}>
      <motion.span
        className="inline"
        variants={containerVariants}
        initial="hidden"
        {...(playOnMount ? { animate: "visible" } : { whileInView: "visible", viewport: { once: true } })}
      >
        {baseWords.map((word, idx) => (
          <span key={`base-${idx}`} className="inline-block overflow-hidden mr-[0.28em] last:mr-0">
            <motion.span className="inline-block will-change-transform" variants={wordVariants}>
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>

      {highlightWords.length > 0 && (
        <>
          {" "}
          <motion.span
            className={`relative inline-block ${highlightClassName}`}
            variants={highlightContainerVariants}
            initial="hidden"
            {...(playOnMount ? { animate: "visible" } : { whileInView: "visible", viewport: { once: true } })}
          >
            {highlightWords.map((word, idx) => (
              <span key={`hl-${idx}`} className="inline-block overflow-hidden mr-[0.28em] last:mr-0">
                <motion.span className="inline-block will-change-transform" variants={wordVariants}>
                  {word}
                </motion.span>
              </span>
            ))}

            {/* Soft shine sweep effect across the highlight phrase */}
            {shine && (
              <motion.span
                className="absolute inset-0 pointer-events-none -z-10 opacity-30"
                initial={{ x: "-100%" }}
                animate={{ x: "120%" }}
                transition={{
                  delay: delay + (baseWords.length + highlightWords.length) * stagger + 0.25,
                  duration: 1.1,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
                }}
              />
            )}
          </motion.span>
        </>
      )}
    </HeadingTag>
  );
};

export default AnimatedText;
