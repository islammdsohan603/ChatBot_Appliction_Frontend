/**
 * TypingIndicator — Shows animated "... is typing" indicator with smooth bouncing dots loop.
 *
 * Props:
 *  - name: string (e.g. "Alex")
 */
import { motion, useReducedMotion } from "framer-motion";

export const TypingIndicator = ({ name = "Someone" }) => {
  const shouldReduceMotion = useReducedMotion();

  const dotVariants = {
    bounce: (index) => ({
      y: shouldReduceMotion ? 0 : [-3, 3, -3],
      opacity: shouldReduceMotion ? [0.4, 1, 0.4] : [0.5, 1, 0.5],
      transition: {
        duration: 0.7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.16,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 px-4 py-2"
    >
      {/* Dots bubble */}
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-surface border border-line-strong shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            animate="bounce"
            variants={dotVariants}
            className="w-1.5 h-1.5 rounded-full bg-primary inline-block"
          />
        ))}
      </div>
      {/* Label */}
      <span className="text-xs text-fg-muted italic">{name} is typing…</span>
    </motion.div>
  );
};

export default TypingIndicator;
