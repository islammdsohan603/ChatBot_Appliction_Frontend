import React, { useEffect, useRef, useState } from "react";

/**
 * Custom Hook: useScrollReveal
 * Monitors an element's intersection with viewport and triggers visibility state.
 */
export const useScrollReveal = ({
  threshold = 0.1,
  rootMargin = "0px 0px -40px 0px",
  once = true,
  disabled = false,
} = {}) => {
  const [isVisible, setIsVisible] = useState(disabled);
  const domRef = useRef(null);

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      return;
    }

    // Reduced motion accessibility preference check
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    // Fallback if IntersectionObserver is not available
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const currentElem = domRef.current;
    if (!currentElem) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentElem);

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [threshold, rootMargin, once, disabled]);

  return [domRef, isVisible];
};

/**
 * ScrollReveal Component
 * Smoothly animates elements upwards from the bottom upon scrolling into view.
 *
 * @param {React.ReactNode} children - Elements to animate
 * @param {string} animation - Animation direction ('fade-up' by default)
 * @param {number} delay - Transition delay in milliseconds (default: 0)
 * @param {number} duration - Transition duration in milliseconds (default: 700)
 * @param {number|string} distance - Initial offset distance in px (default: 36)
 * @param {number} threshold - Viewport intersection threshold (default: 0.1)
 * @param {string} rootMargin - Viewport margin for trigger (default: "0px 0px -40px 0px")
 * @param {boolean} once - If true, triggers only once upon first scroll (default: true)
 * @param {string} className - Additional CSS classes
 * @param {string} as - Polymorphic HTML tag to render (default: 'div')
 * @param {boolean} disabled - Disable animation if true
 * @param {boolean} blur - Add subtle de-blur effect on entrance
 * @param {object} style - Extra inline styles
 */
export const ScrollReveal = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  distance = 36,
  threshold = 0.1,
  rootMargin = "0px 0px -40px 0px",
  once = true,
  className = "",
  as: Component = "div",
  disabled = false,
  blur = false,
  style = {},
  ...restProps
}) => {
  const [domRef, isVisible] = useScrollReveal({
    threshold,
    rootMargin,
    once,
    disabled,
  });

  const getTransitionStyles = () => {
    if (disabled) return {};

    const dist = typeof distance === "number" ? `${distance}px` : distance;

    const baseTransition = {
      transitionProperty: "opacity, transform, filter",
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      transitionDelay: `${delay}ms`,
      willChange: "opacity, transform",
    };

    if (!isVisible) {
      let initialTransform = `translate3d(0, ${dist}, 0)`; // default upward animation

      switch (animation) {
        case "fade-up":
          initialTransform = `translate3d(0, ${dist}, 0)`;
          break;
        case "fade-down":
          initialTransform = `translate3d(0, -${dist}, 0)`;
          break;
        case "fade-left":
          initialTransform = `translate3d(-${dist}, 0, 0)`;
          break;
        case "fade-right":
          initialTransform = `translate3d(${dist}, 0, 0)`;
          break;
        case "zoom-in":
        case "scale-up":
          initialTransform = "scale3d(0.92, 0.92, 1) translate3d(0, 20px, 0)";
          break;
        case "fade-in":
          initialTransform = "none";
          break;
        default:
          initialTransform = `translate3d(0, ${dist}, 0)`;
      }

      return {
        ...baseTransition,
        opacity: 0,
        transform: initialTransform,
        ...(blur ? { filter: "blur(4px)" } : {}),
      };
    }

    return {
      ...baseTransition,
      opacity: 1,
      transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)",
      ...(blur ? { filter: "blur(0px)" } : {}),
    };
  };

  return (
    <Component
      ref={domRef}
      style={{ ...getTransitionStyles(), ...style }}
      className={`scroll-reveal-container ${isVisible ? "is-visible" : "is-hidden"} ${className}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

/**
 * ScrollRevealGroup Component
 * Wraps multiple child elements and applies a cascading/staggered upward animation.
 */
export const ScrollRevealGroup = ({
  children,
  stagger = 100,
  baseDelay = 0,
  animation = "fade-up",
  duration = 700,
  distance = 36,
  threshold = 0.1,
  className = "",
  as: Component = "div",
  ...restProps
}) => {
  const childArray = React.Children.toArray(children);

  return (
    <Component className={className} {...restProps}>
      {childArray.map((child, index) => {
        if (!React.isValidElement(child)) return child;

        return (
          <ScrollReveal
            key={child.key || index}
            animation={animation}
            delay={baseDelay + index * stagger}
            duration={duration}
            distance={distance}
            threshold={threshold}
            className={child.props.className ? "" : undefined}
          >
            {child}
          </ScrollReveal>
        );
      })}
    </Component>
  );
};

export default ScrollReveal;
