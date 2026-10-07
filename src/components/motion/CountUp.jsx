import React, { useState, useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * CountUp Component
 *
 * Smoothly counts up numeric statistics when scrolled into view.
 * Handles decimals (e.g. 99.98%), prefixes (e.g. "< ", "$"), and suffixes (e.g. "%", "ms", "+").
 *
 * @param {Object} props
 * @param {number|string} props.value - Numeric target value (e.g. 400, 99.98, "50+")
 * @param {string} [props.prefix=""] - String before number (e.g. "< ")
 * @param {string} [props.suffix=""] - String after number (e.g. "%", "ms")
 * @param {number} [props.duration=1.0] - Count duration in seconds
 * @param {string} [props.className=""] - Wrapper classes
 */
export const CountUp = ({
  value,
  prefix = "",
  suffix = "",
  duration = 1.0,
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  // Parse raw value string or number to isolate target numeric value and formatting
  let parsedTarget = 0;
  let detectedDecimals = 0;
  let parsedPrefix = prefix;
  let parsedSuffix = suffix;

  if (typeof value === "number") {
    parsedTarget = value;
    detectedDecimals = value.toString().split(".")[1]?.length || 0;
  } else if (typeof value === "string") {
    // Check for leading prefix e.g. "< "
    const cleanStr = value.trim();
    const match = cleanStr.match(/^([^\d.]*)(\d+(?:\.\d+)?)([^\d.]*)$/);
    if (match) {
      if (!parsedPrefix && match[1]) parsedPrefix = match[1];
      parsedTarget = parseFloat(match[2]);
      detectedDecimals = match[2].split(".")[1]?.length || 0;
      if (!parsedSuffix && match[3]) parsedSuffix = match[3];
    } else {
      parsedTarget = parseFloat(cleanStr.replace(/[^\d.]/g, "")) || 0;
    }
  }

  const [displayValue, setDisplayValue] = useState(
    shouldReduceMotion ? parsedTarget : 0
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(parsedTarget);
      return;
    }

    if (!isInView || parsedTarget === 0) return;

    let startTime = null;
    let frameId = null;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * parsedTarget;

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(parsedTarget);
      }
    };

    frameId = requestAnimationFrame(animateCount);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isInView, parsedTarget, duration, shouldReduceMotion]);

  const formattedNumber =
    detectedDecimals > 0
      ? displayValue.toFixed(detectedDecimals)
      : Math.round(displayValue).toString();

  return (
    <span ref={ref} className={className}>
      {parsedPrefix}
      {formattedNumber}
      {parsedSuffix}
    </span>
  );
};

export default CountUp;
