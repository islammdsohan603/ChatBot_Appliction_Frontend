import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";

/**
 * GsapSection — Smooth entrance for whole sections with header split-fade and accent line expansion.
 */
export const GsapSection = ({
  children,
  className = "",
  id,
  delay = 0,
  scrub = false,
  once = true,
  start = "top 85%",
  ...rest
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start,
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [delay, once, start]);

  return (
    <section ref={sectionRef} id={id} className={className} {...rest}>
      {children}
    </section>
  );
};

/**
 * GsapStagger — Staggers direct children cards/elements into view using GSAP ScrollTrigger.
 */
export const GsapStagger = ({
  children,
  className = "",
  childSelector = "> *",
  stagger = 0.12,
  y = 45,
  scale = 0.96,
  start = "top 85%",
  duration = 0.8,
  once = true,
  ...rest
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = containerRef.current.querySelectorAll(childSelector);
      if (!items || items.length === 0) return;

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y,
          scale,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [childSelector, stagger, y, scale, start, duration, once, children]);

  return (
    <div ref={containerRef} className={className} {...rest}>
      {children}
    </div>
  );
};

/**
 * GsapParallax — Scrubbed parallax element that moves smoothly in response to scroll.
 * speed: positive moves slower/opposite, negative moves faster.
 */
export const GsapParallax = ({
  children,
  speed = 0.25, // -1 to 1 range
  yPercent = 20,
  className = "",
  start = "top bottom",
  end = "bottom top",
  ...rest
}) => {
  const targetRef = useRef(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const ctx = gsap.context(() => {
      const delta = yPercent * (speed * 2);
      gsap.fromTo(
        targetRef.current,
        { yPercent: -delta },
        {
          yPercent: delta,
          ease: "none",
          scrollTrigger: {
            trigger: targetRef.current,
            start,
            end,
            scrub: 1.2,
          },
        }
      );
    }, targetRef);

    return () => ctx.revert();
  }, [speed, yPercent, start, end]);

  return (
    <div ref={targetRef} className={className} {...rest}>
      {children}
    </div>
  );
};

/**
 * GsapScrubScale — Zooms / expands an element as user scrolls it into the center of the viewport.
 * Perfect for interactive previews, UI mockups, and showcase cards.
 */
export const GsapScrubScale = ({
  children,
  className = "",
  initialScale = 0.92,
  targetScale = 1.0,
  initialRotateX = 8,
  start = "top 95%",
  end = "top 35%",
  ...rest
}) => {
  const elRef = useRef(null);

  useEffect(() => {
    if (!elRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elRef.current,
        {
          scale: initialScale,
          rotateX: initialRotateX,
          opacity: 0.85,
          transformPerspective: 1000,
        },
        {
          scale: targetScale,
          rotateX: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: elRef.current,
            start,
            end,
            scrub: 0.8,
          },
        }
      );
    }, elRef);

    return () => ctx.revert();
  }, [initialScale, targetScale, initialRotateX, start, end]);

  return (
    <div ref={elRef} className={className} {...rest}>
      {children}
    </div>
  );
};

/**
 * GsapRevealText — Smooth character/word or line reveal with ScrollTrigger.
 */
export const GsapRevealText = ({
  children,
  className = "",
  delay = 0,
  start = "top 90%",
  ...rest
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        {
          opacity: 0,
          y: 30,
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start,
            toggleActions: "play none none none",
          },
        }
      );
    }, textRef);

    return () => ctx.revert();
  }, [delay, start]);

  return (
    <div ref={textRef} className={className} {...rest}>
      {children}
    </div>
  );
};

export default {
  GsapSection,
  GsapStagger,
  GsapParallax,
  GsapScrubScale,
  GsapRevealText,
};
