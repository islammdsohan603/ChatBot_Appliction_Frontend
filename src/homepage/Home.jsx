/**
 * Home — NEXORA Landing Page
 * Sections: Navbar → Hero → Features → Live Preview → Security → CTA → Footer
 * Enhanced with Scroll Animations & Interactive 3D Hover Animations.
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import gsap from "gsap";
import ScrollRevealLib from "scrollreveal";
import {
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlinePaperClip,
  HiOutlineFaceSmile,
  HiOutlineLockClosed,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineArrowRight,
  HiOutlineChatBubbleLeftRight,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
} from "react-icons/hi2";
import ScrollReveal from "./ScrollReveal";
import TiltCard from "./TiltCard";
import ThemeToggle from "../components/ui/ThemeToggle";

/* ─────────────────────────────────────────
   Particle config
   ───────────────────────────────────────── */
const PARTICLES = [
  { left: "8%", top: "15%", dur: "20s", delay: "0s", bg: "rgba(6,182,212,0.4)", size: "3px" },
  { left: "20%", top: "70%", dur: "25s", delay: "-4s", bg: "rgba(139,92,246,0.5)", size: "2px" },
  { left: "40%", top: "10%", dur: "18s", delay: "-8s", bg: "rgba(236,72,153,0.35)", size: "2px" },
  { left: "60%", top: "80%", dur: "22s", delay: "-2s", bg: "rgba(6,182,212,0.3)", size: "4px" },
  { left: "75%", top: "25%", dur: "19s", delay: "-6s", bg: "rgba(139,92,246,0.4)", size: "2px" },
  { left: "90%", top: "55%", dur: "24s", delay: "-1s", bg: "rgba(236,72,153,0.3)", size: "3px" },
  { left: "50%", top: "40%", dur: "21s", delay: "-3s", bg: "rgba(6,182,212,0.35)", size: "2px" },
  { left: "30%", top: "90%", dur: "17s", delay: "-5s", bg: "rgba(139,92,246,0.3)", size: "3px" },
];

/* ─────────────────────────────────────────
   NEXORA Logo Mark
   ───────────────────────────────────────── */
const Logo = ({ size = "md" }) => {
  const logoSize = size === "lg" ? "w-12 h-12" : "w-9 h-9";
  const iconSize = size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const textSize = size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`relative ${logoSize} rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_4px_16px_rgba(139,92,246,0.35)] group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(139,92,246,0.6)] transition-all duration-300`}>
        <div className="absolute -inset-0.5 rounded-[14px] bg-gradient-to-br from-violet-500/40 to-cyan-500/40 -z-[1] blur-[6px] group-hover:blur-[8px] transition-all" />
        <svg className={`${iconSize} text-white group-hover:rotate-6 transition-transform duration-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <span className={`${textSize} font-extrabold bg-gradient-to-br from-indigo-200 via-violet-300 to-cyan-300 bg-clip-text text-transparent tracking-tight group-hover:from-white group-hover:to-cyan-200 transition-all`}>
        NEXORA
      </span>
    </div>
  );
};

/* ─────────────────────────────────────────
   Navbar
   ───────────────────────────────────────── */
const Navbar = ({ isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#060918]/90 backdrop-blur-xl border-b border-violet-500/10 dark:border-violet-500/15 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Security", "Community"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors relative group py-1"
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>

          {/* CTA buttons + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {isAuthenticated ? (
              <Link
                to="/chat"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_4px_25px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md shadow-violet-900/20"
              >
                Open Chat →
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-white hover:bg-violet-500/10 rounded-xl transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="relative px-5 py-2.5 rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_4px_25px_rgba(139,92,246,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden group shadow-md shadow-violet-900/20"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle mobile menu"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-white hover:bg-violet-500/10 transition-all"
            >
              {isOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden glass border border-violet-500/20 rounded-2xl mt-2 p-3 pb-4 animate-slideUp shadow-xl">
            <div className="flex flex-col gap-1">
              {["Features", "Security", "Community"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-white hover:bg-violet-500/10 rounded-xl transition-all"
                >
                  {item}
                </a>
              ))}
              <div className="flex gap-2 mt-3 pt-2 border-t border-violet-500/10">
                <Link
                  to="/login"
                  className="flex-1 px-4 py-2.5 text-center text-sm font-medium text-slate-700 dark:text-slate-300 border border-violet-500/20 rounded-xl hover:bg-violet-500/10 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 px-4 py-2.5 text-center text-sm text-white bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl font-semibold shadow-md"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

/* ─────────────────────────────────────────
   3D Hero Chat Preview — Enlarged Dimensions & Continuous GSAP Float
   ───────────────────────────────────────── */
const HeroChatPreview = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const badge1Ref = useRef(null);
  const badge2Ref = useRef(null);
  const badge3Ref = useRef(null);

  const [messages] = useState([
    { id: 1, from: "Alex", text: "Hey! Just pushed the latest build 🚀", time: "10:42 AM", own: false, color: "from-violet-500 to-violet-600" },
    { id: 2, from: "You", text: "Looks amazing! The UI is super clean 🔥", time: "10:43 AM", own: true },
    { id: 3, from: "Sarah", text: "The new design system is 💜", time: "10:44 AM", own: false, color: "from-cyan-500 to-blue-600" },
    { id: 4, from: "You", text: "Let's ship it! ✅", time: "10:45 AM", own: true },
  ]);

  useEffect(() => {
    // 1. ScrollReveal — smoothly float up from the bottom as user scrolls into view
    let srInstance = null;
    if (containerRef.current) {
      try {
        srInstance = ScrollRevealLib({
          origin: "bottom",
          distance: "80px",
          duration: 1100,
          delay: 150,
          opacity: 0,
          scale: 0.95,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          reset: false,
        });
        srInstance.reveal(containerRef.current);
      } catch (err) {
        console.warn("ScrollReveal init error:", err);
      }
    }

    // 2. GSAP Context — Continuous floating animation & badges
    const ctx = gsap.context(() => {
      // Continuous levitating float on card
      gsap.to(cardRef.current, {
        y: -16,
        rotationZ: 0.6,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Floating badge 1 (top right)
      if (badge1Ref.current) {
        gsap.to(badge1Ref.current, {
          y: -12,
          x: 4,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.2,
        });
      }

      // Floating badge 2 (bottom left)
      if (badge2Ref.current) {
        gsap.to(badge2Ref.current, {
          y: 10,
          x: -4,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5,
        });
      }

      // Floating badge 3 (reaction pill)
      if (badge3Ref.current) {
        gsap.to(badge3Ref.current, {
          y: -10,
          scale: 1.08,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.8,
        });
      }
    }, containerRef);

    // 3. Smooth animation when switching themes
    const handleThemeChange = (e) => {
      if (cardRef.current) {
        const isDark = e.detail?.theme === "dark";
        gsap.timeline()
          .to(cardRef.current, {
            scale: 1.025,
            boxShadow: isDark
              ? "0 0 50px rgba(168, 85, 247, 0.45)"
              : "0 0 40px rgba(99, 102, 241, 0.35)",
            borderColor: isDark ? "rgba(168, 85, 247, 0.5)" : "rgba(99, 102, 241, 0.4)",
            duration: 0.3,
            ease: "power2.out",
          })
          .to(cardRef.current, {
            scale: 1,
            boxShadow: "",
            borderColor: "",
            duration: 0.6,
            ease: "power2.inOut",
          });
      }
    };

    window.addEventListener("nexoraThemeChange", handleThemeChange);

    return () => {
      ctx.revert();
      window.removeEventListener("nexoraThemeChange", handleThemeChange);
      if (srInstance) {
        try {
          srInstance.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[500px] sm:max-w-[580px] md:max-w-[650px] lg:max-w-[600px] xl:max-w-[680px] mx-auto lg:mr-0 transition-transform duration-500"
      style={{ perspective: "1000px" }}
    >
      {/* Main chat window */}
      <div
        ref={cardRef}
        className="glass rounded-3xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.65)] border border-violet-500/25 hover:border-violet-500/45 transition-all duration-300 group"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Chat header */}
        <div className="flex items-center gap-4 px-6 py-4 sm:py-4.5 border-b border-violet-500/15 dark:bg-[#0d1230]/80 bg-slate-100/90 backdrop-blur-md">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-base font-bold text-white shadow-md">
            N
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">Team NEXORA</p>
            <p className="text-xs sm:text-sm text-green-500 dark:text-green-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              3 members online
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:opacity-100 cursor-pointer" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80 hover:opacity-100 cursor-pointer" />
            <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:opacity-100 cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="px-6 py-6 sm:py-7 space-y-4 sm:space-y-5 min-h-[380px] sm:min-h-[440px] md:min-h-[470px] flex flex-col justify-center dark:bg-[#060918]/65 bg-white/75 backdrop-blur-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-3.5 group/msg ${msg.own ? "flex-row-reverse" : ""}`}
            >
              {!msg.own && (
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${msg.color} border border-violet-500/20 flex items-center justify-center text-xs sm:text-sm font-bold text-white shrink-0 shadow-sm`}>
                  {msg.from[0]}
                </div>
              )}
              <div className={`flex flex-col gap-1.5 ${msg.own ? "items-end" : "items-start"}`}>
                {!msg.own && <span className="text-xs sm:text-sm text-violet-600 dark:text-violet-400/90 ml-1 font-semibold">{msg.from}</span>}
                <div className={`px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl text-xs sm:text-sm md:text-[15px] max-w-[280px] sm:max-w-[380px] md:max-w-[420px] leading-relaxed transition-all duration-200 group-hover/msg:scale-[1.01] ${
                  msg.own
                    ? "bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-br-sm shadow-md shadow-violet-900/30"
                    : "dark:bg-[#111840] bg-slate-100 border border-violet-500/15 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm"
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mx-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 border border-violet-500/20 flex items-center justify-center text-xs sm:text-sm font-bold text-white shrink-0">
              S
            </div>
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl rounded-bl-sm dark:bg-[#111840] bg-slate-100 border border-violet-500/15 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-xs sm:text-sm text-slate-500 italic">Sarah is typing…</span>
          </div>
        </div>

        {/* Composer */}
        <div className="px-6 py-4 sm:py-5 border-t border-violet-500/15 dark:bg-[#0d1230]/80 bg-slate-100/90 backdrop-blur-md">
          <div className="flex items-center gap-3.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl dark:bg-[#111840] bg-white border border-violet-500/20 hover:border-violet-500/40 transition-colors shadow-sm">
            <HiOutlineFaceSmile className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 hover:text-violet-500 cursor-pointer transition-colors" />
            <span className="text-sm sm:text-base text-slate-400 dark:text-slate-500 flex-1 truncate">Type a message…</span>
            <HiOutlinePaperClip className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 hover:text-cyan-500 cursor-pointer transition-colors" />
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform shadow-sm">
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification card */}
      <div
        ref={badge1Ref}
        className="absolute -top-5 sm:-top-7 -right-3 sm:-right-7 glass rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 sm:gap-3.5 shadow-2xl border border-violet-500/30 hover:scale-105 transition-transform cursor-pointer z-20"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-base sm:text-lg shadow-md">
          🚀
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">Build shipped!</p>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">just now</p>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse ml-1" />
      </div>

      {/* Online users card */}
      <div
        ref={badge2Ref}
        className="absolute -bottom-5 sm:-bottom-7 -left-3 sm:-left-7 glass rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 sm:gap-3.5 shadow-2xl border border-cyan-500/30 hover:scale-105 transition-transform cursor-pointer z-20"
      >
        <div className="flex -space-x-2.5">
          {["A", "S", "M"].map((l, i) => (
            <div key={i} className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white dark:border-[#060918] flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${i === 0 ? "from-violet-500 to-violet-600" : i === 1 ? "from-cyan-500 to-blue-600" : "from-pink-500 to-rose-600"} shadow-sm`}>
              {l}
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">+12 online</p>
          <p className="text-[10px] sm:text-xs text-green-500 font-medium">Active now</p>
        </div>
      </div>

      {/* Reaction pop */}
      <div
        ref={badge3Ref}
        className="absolute top-1/2 -right-4 sm:-right-7 -translate-y-1/2 glass rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-xl border border-violet-500/30 hover:scale-125 transition-transform cursor-pointer z-20"
      >
        🔥 4
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Hero Section — Single-column on mobile & 'md', 2-column on 'lg' and up
   ───────────────────────────────────────── */
const Hero = ({ isAuthenticated }) => (
  <section className="relative min-h-screen flex items-center pt-24 sm:pt-28 pb-16 overflow-hidden">
    {/* Background orbs */}
    <div className="absolute w-[600px] h-[600px] -left-[100px] top-1/4 blur-[100px] pointer-events-none opacity-30 dark:opacity-40 animate-pulse"
      style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.5) 0%, transparent 70%)" }} />
    <div className="absolute w-[500px] h-[500px] right-0 bottom-0 blur-[100px] pointer-events-none opacity-20 dark:opacity-30 animate-pulse"
      style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.5) 0%, transparent 70%)" }} />

    {/* Subtle Grid */}
    <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-100" style={{
      background: [
        "repeating-linear-gradient(0deg, transparent, transparent 78px, rgba(139,92,246,0.025) 78px, rgba(139,92,246,0.025) 80px)",
        "repeating-linear-gradient(90deg, transparent, transparent 78px, rgba(139,92,246,0.025) 78px, rgba(139,92,246,0.025) 80px)",
      ].join(", ")
    }} />

    {/* Particles */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p, i) => (
        <div key={i} className="absolute rounded-full animate-particleDrift"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, background: p.bg, animationDuration: p.dur, animationDelay: p.delay }} />
      ))}
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 md:py-12">
      {/* Single-column grid on mobile & 'md', 2-column grid layout on 'lg' and above */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 xl:gap-16 items-center">
        {/* Column 1: Copy, Headings & CTAs */}
        <div className="w-full text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
          {/* Badge */}
          <ScrollReveal animation="fade-down" delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/25 text-xs font-semibold text-violet-600 dark:text-violet-300 mb-6 shadow-sm hover:border-violet-400 hover:bg-violet-500/15 transition-all cursor-default">
              <HiOutlineSparkles className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
              Introducing NEXORA 1.0
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-[-1.5px] md:tracking-[-2px] mb-6">
              <span className="text-slate-900 dark:text-slate-100">Connect.</span>{" "}
              <span className="bg-gradient-to-br from-violet-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent">Chat.</span>{" "}
              <span className="text-slate-900 dark:text-slate-100">Collaborate.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-[540px] mx-auto lg:mx-0">
              Experience fast, seamless and modern real-time communication built for meaningful conversations. Your team, always connected.
            </p>
          </ScrollReveal>

          {/* CTA buttons */}
          <ScrollReveal animation="fade-up" delay={400}>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                to={isAuthenticated ? "/chat" : "/signup"}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-cyan-500 text-white font-bold text-base tracking-wide hover:shadow-[0_8px_32px_rgba(139,92,246,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-violet-900/25"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isAuthenticated ? "Open NEXORA" : "Start Chatting Free"}
                  <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl border border-violet-500/25 text-slate-700 dark:text-slate-300 font-semibold text-base hover:bg-violet-500/10 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-white transition-all duration-300 text-center"
              >
                Explore Features
              </a>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal animation="fade-up" delay={500}>
            <div className="flex items-center gap-6 sm:gap-8 mt-8 md:mt-10 justify-center lg:justify-start flex-wrap">
              {[
                { value: "10K+", label: "Active users" },
                { value: "99.9%", label: "Uptime" },
                { value: "<50ms", label: "Message delay" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left group cursor-default">
                  <div className="text-2xl font-extrabold gradient-text group-hover:scale-110 transition-transform duration-200">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Column 2: 3D Chat Preview (Centered on mobile & md, right-aligned on lg) */}
        <div className="w-full flex justify-center lg:justify-end mt-4 lg:mt-0">
          <HeroChatPreview />
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   Features Section
   ───────────────────────────────────────── */
const FEATURES = [
  {
    icon: <HiOutlineBolt className="w-6 h-6" />,
    title: "Real-Time Messaging",
    desc: "Instant message delivery powered by WebSocket technology. No refresh, no delay — just pure real-time conversation.",
    color: "from-amber-500/20 to-orange-600/20",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.25)",
  },
  {
    icon: <HiOutlineUserGroup className="w-6 h-6" />,
    title: "Private & Group Chat",
    desc: "Create private conversations or invite your whole team. Unlimited participants with seamless group management.",
    color: "from-violet-500/20 to-violet-600/20",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
    glowColor: "rgba(139, 92, 246, 0.25)",
  },
  {
    icon: <HiOutlineGlobeAlt className="w-6 h-6" />,
    title: "Online Presence",
    desc: "Know who's available instantly with real-time online, away, and busy status indicators across your network.",
    color: "from-green-500/20 to-emerald-600/20",
    border: "border-green-500/20",
    iconColor: "text-green-400",
    glowColor: "rgba(34, 197, 94, 0.25)",
  },
  {
    icon: <HiOutlinePaperClip className="w-6 h-6" />,
    title: "File Sharing",
    desc: "Share images, documents, and files effortlessly. Instant preview with no size limitations for power users.",
    color: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
    glowColor: "rgba(6, 182, 212, 0.25)",
  },
  {
    icon: <HiOutlineFaceSmile className="w-6 h-6" />,
    title: "Message Reactions",
    desc: "Express yourself with emoji reactions to any message. Rich reactions that make conversations more human.",
    color: "from-pink-500/20 to-rose-600/20",
    border: "border-pink-500/20",
    iconColor: "text-pink-400",
    glowColor: "rgba(236, 72, 153, 0.25)",
  },
  {
    icon: <HiOutlineLockClosed className="w-6 h-6" />,
    title: "Secure Authentication",
    desc: "JWT-based authentication with httpOnly cookies. Your credentials stay safe with bcrypt hashing.",
    color: "from-indigo-500/20 to-violet-600/20",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
    glowColor: "rgba(99, 102, 241, 0.25)",
  },
];

const Features = () => (
  <section id="features" className="py-24 px-4 relative">
    <div className="max-w-7xl mx-auto">
      {/* Section header */}
      <ScrollReveal animation="fade-up">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300 mb-4 hover:border-violet-400 transition-colors">
            <HiOutlineSparkles className="w-3.5 h-3.5 text-violet-400" />
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
            Built for{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              serious teams
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every feature you need to collaborate effectively, communicate clearly, and move faster.
          </p>
        </div>
      </ScrollReveal>

      {/* Feature grid with 3D Tilt & Magnetic Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => (
          <ScrollReveal key={feature.title} animation="fade-up" delay={i * 100}>
            <TiltCard
              glowColor={feature.glowColor}
              className={`glass rounded-2xl p-7 border ${feature.border} shadow-lg shadow-violet-950/20 hover:shadow-2xl hover:border-opacity-80 transition-all duration-300 h-full flex flex-col justify-between`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} border ${feature.border} flex items-center justify-center ${feature.iconColor} mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2.5 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   Live Chat Preview Section
   ───────────────────────────────────────── */
const LivePreview = () => (
  <section id="community" className="py-24 px-4 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

    <div className="max-w-7xl mx-auto">
      <ScrollReveal animation="fade-up">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-4 hover:border-cyan-400 transition-colors">
            <HiOutlineChatBubbleLeftRight className="w-3.5 h-3.5 text-cyan-400" />
            See it in action
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
            A chat experience{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              unlike any other
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Real-time, beautiful, and blazing fast. Built to impress and built to ship.
          </p>
        </div>
      </ScrollReveal>

      {/* App preview with Tilt & Scroll Reveal */}
      <ScrollReveal animation="scale-up" duration={800}>
        <div className="glass rounded-3xl overflow-hidden border border-violet-500/20 shadow-[0_24px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)] max-w-5xl mx-auto hover:border-violet-500/40 transition-all duration-300">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-violet-500/15 dark:bg-[#0a0f2a]/90 bg-slate-100/90">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80 hover:opacity-100 cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:opacity-100 cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 hover:opacity-100 cursor-pointer" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 px-4 py-1 rounded-lg dark:bg-[#111840] bg-white border border-violet-500/15 text-[11px] text-slate-600 dark:text-slate-400 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                nexora.app — Secure connection
              </div>
            </div>
          </div>

          {/* Three-panel layout */}
          <div className="flex h-[420px] sm:h-[480px]">
            {/* Sidebar */}
            <div className="w-56 sm:w-64 border-r border-violet-500/10 dark:bg-[#0a0f2a]/60 bg-white/70 flex-col hidden sm:flex">
              <div className="px-3 py-3 border-b border-violet-500/10">
                <Logo size="sm" />
              </div>
              <div className="px-3 py-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl dark:bg-[#111840] bg-slate-100 border border-violet-500/15 text-[11px] text-slate-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search conversations…
                </div>
              </div>
              <div className="flex-1 overflow-hidden px-2 py-1 space-y-1">
                {[
                  { name: "Alex Morgan", msg: "Ready to ship 🚀", online: true, badge: 3 },
                  { name: "Design Team", msg: "Sarah: mockups done!", online: true },
                  { name: "Sarah Chen", msg: "sending files…", online: false, badge: 1 },
                  { name: "Dev Squad", msg: "Build passed ✅", online: false },
                ].map((c, i) => (
                  <div key={i} className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer ${i === 0 ? "bg-violet-500/15 border border-violet-500/20" : "hover:bg-violet-500/10"} transition-all duration-200`}>
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        {c.name[0]}
                      </div>
                      {c.online && <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-[#0a0f2a]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{c.msg}</p>
                    </div>
                    {c.badge && (
                      <div className="w-4 h-4 rounded-full bg-violet-500 text-[9px] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                        {c.badge}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main chat */}
            <div className="flex-1 flex flex-col dark:bg-[#060918]/50 bg-slate-50/70">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-violet-500/10">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">A</div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-white dark:border-[#060918]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Alex Morgan</p>
                  <p className="text-[10px] text-green-500 dark:text-green-400 font-medium">Online</p>
                </div>
              </div>
              {/* Messages */}
              <div className="flex-1 px-3 py-4 space-y-2.5 overflow-hidden">
                {[
                  { text: "Hey! How's the new build going?", own: false },
                  { text: "It's coming together amazingly! 🚀 The UI is so polished", own: true },
                  { text: "Real-time updates working?", own: false },
                  { text: "Yes! Socket.io integration is complete. Messages fly!", own: true },
                  { text: "Can't wait to see the final demo 🔥", own: false },
                ].map((m, i) => (
                  <div key={i} className={`flex gap-2 group/bubble ${m.own ? "flex-row-reverse" : ""}`}>
                    {!m.own && <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500/40 to-violet-600/40 border border-violet-500/20 shrink-0 self-end shadow-sm" />}
                    <div className={`px-3 py-2 rounded-xl text-[11px] max-w-[75%] leading-relaxed transition-transform duration-200 group-hover/bubble:scale-[1.02] ${
                      m.own
                        ? "bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-br-sm shadow-md"
                        : "dark:bg-[#111840] bg-white border border-violet-500/15 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {/* Typing indicator */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/15 shrink-0 self-end" />
                  <div className="px-3 py-2 rounded-xl dark:bg-[#111840] bg-white border border-violet-500/10 flex gap-1 items-center shadow-sm">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Composer */}
              <div className="px-3 py-2.5 border-t border-violet-500/10">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl dark:bg-[#111840] bg-white border border-violet-500/20 hover:border-violet-500/40 transition-colors shadow-sm">
                  <span className="text-[10px] text-slate-500 flex-1">Reply to Alex…</span>
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform">
                    <svg className="w-3 h-3 text-white rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile panel */}
            <div className="w-48 border-l border-violet-500/10 dark:bg-[#0a0f2a]/60 bg-white/70 hidden lg:flex flex-col items-center py-5 px-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white mb-2 shadow-md hover:scale-105 transition-transform">A</div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-0.5">Alex Morgan</p>
              <p className="text-[10px] text-violet-400/80 mb-2">@alexmorgan</p>
              <div className="flex items-center gap-1.5 mb-4 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-400 font-medium">Online</span>
              </div>
              <div className="w-full">
                <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Shared Media</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {["from-violet-500/30 to-violet-600/30", "from-cyan-500/30 to-blue-600/30", "from-pink-500/30 to-rose-600/30"].map((g, i) => (
                    <div key={i} className={`aspect-square rounded-lg bg-gradient-to-br ${g} border border-violet-500/15 hover:scale-110 hover:border-violet-400 transition-all cursor-pointer`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   Security Section
   ───────────────────────────────────────── */
const Security = () => (
  <section id="security" className="py-24 px-4 relative">
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)" }} />

    <div className="max-w-7xl mx-auto">
      <ScrollReveal animation="fade-up">
        <div className="glass rounded-3xl border border-cyan-500/20 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl hover:border-cyan-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] pointer-events-none opacity-20"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)" }} />

          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-6 hover:border-cyan-400 transition-colors">
                <HiOutlineShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Enterprise-grade security
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
                Your conversations,{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  always protected
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                Built from the ground up with security-first principles. JWT authentication, bcrypt hashing, and httpOnly cookies keep your data safe.
              </p>
              <div className="flex flex-col gap-3.5">
                {[
                  "JWT tokens stored in httpOnly cookies",
                  "Passwords hashed with bcryptjs",
                  "CORS protection on all API endpoints",
                  "Cookie-parser with secure flag in production",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 group hover:translate-x-1.5 transition-transform duration-200">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                      <HiOutlineCheck className="w-3 h-3 text-cyan-400 group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual */}
            <div className="flex-1 flex justify-center">
              <div className="relative group cursor-pointer">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-105 group-hover:border-cyan-400/40 transition-all duration-500">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                    <HiOutlineShieldCheck className="w-16 h-16 text-cyan-400" />
                  </div>
                </div>
                {/* Orbiting dots */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-3 h-3 rounded-full bg-cyan-500/50 border border-cyan-500/30 animate-pulse"
                    style={{
                      top: `${50 + 46 * Math.sin((deg * Math.PI) / 180)}%`,
                      left: `${50 + 46 * Math.cos((deg * Math.PI) / 180)}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   CTA Section
   ───────────────────────────────────────── */
const CTA = ({ isAuthenticated }) => (
  <section className="py-24 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <ScrollReveal animation="scale-up">
        <div className="glass rounded-3xl p-12 sm:p-16 border border-violet-500/25 relative overflow-hidden shadow-2xl hover:border-violet-500/50 transition-all duration-300">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.18) 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
              Ready to{" "}
              <span className="bg-gradient-to-br from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                connect?
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Join thousands of teams already using NEXORA to communicate faster and collaborate better.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? "/chat" : "/signup"}
                className="px-10 py-4 rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-cyan-500 text-white font-bold text-base hover:shadow-[0_8px_32px_rgba(139,92,246,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 relative overflow-hidden group shadow-lg shadow-violet-900/25"
              >
                <span className="relative z-10">
                  {isAuthenticated ? "Go to NEXORA →" : "Create Free Account →"}
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="px-10 py-4 rounded-2xl border border-violet-500/25 text-slate-700 dark:text-slate-300 font-semibold hover:bg-violet-500/10 hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-white transition-all"
                >
                  Already have an account?
                </Link>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ─────────────────────────────────────────
   Footer
   ───────────────────────────────────────── */
const Footer = () => (
  <footer className="border-t border-violet-500/10 py-12 px-4 bg-slate-100 dark:bg-[#040612] transition-colors">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <Logo />
        <p className="text-sm text-slate-500 text-center">
          © 2026 NEXORA. Built with React, Node.js, and MongoDB.
        </p>
        <div className="flex items-center gap-6">
          <span className="text-xs text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors cursor-pointer">Privacy</span>
          <span className="text-xs text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 transition-colors cursor-pointer">Terms</span>
          <span className="text-xs text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors cursor-pointer">GitHub</span>
        </div>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────
   Main Home Component
   ───────────────────────────────────────── */
const Home = () => {
  const { isAuthenticated } = useSelector((s) => s.user);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060918] font-inter text-slate-800 dark:text-slate-200 transition-colors duration-300 relative">
      {/* Scroll Progress Indicator Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.7)] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar isAuthenticated={isAuthenticated} />
      <Hero isAuthenticated={isAuthenticated} />
      <Features />
      <LivePreview />
      <Security />
      <CTA isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  );
};

export default Home;
