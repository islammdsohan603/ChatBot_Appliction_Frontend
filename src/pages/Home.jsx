import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FiZap,
  FiShield,
  FiUsers,
  FiArrowRight,
  FiGlobe,
  FiCpu,
  FiStar,
  FiCode,
  FiChevronDown,
} from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import {
  Reveal,
  RevealStack,
  RevealItem,
  AnimatedText,
  CountUp,
  GsapSection,
  GsapStagger,
  GsapParallax,
  GsapScrubScale,
} from "../components/motion";
import { smoothScrollTo } from "../lib/gsap";

const PARTICLES = [
  { left: "8%", top: "15%", dur: "20s", delay: "0s", bg: "rgb(var(--accent-rgb)/0.4)", size: "3px" },
  { left: "20%", top: "70%", dur: "25s", delay: "-4s", bg: "rgb(var(--primary-rgb)/0.5)", size: "2px" },
  { left: "40%", top: "10%", dur: "18s", delay: "-8s", bg: "rgb(var(--brand-violet-rgb)/0.35)", size: "2px" },
  { left: "60%", top: "80%", dur: "22s", delay: "-2s", bg: "rgb(var(--accent-rgb)/0.3)", size: "4px" },
  { left: "75%", top: "25%", dur: "19s", delay: "-6s", bg: "rgb(var(--primary-rgb)/0.4)", size: "2px" },
  { left: "90%", top: "55%", dur: "24s", delay: "-1s", bg: "rgb(var(--brand-violet-rgb)/0.3)", size: "3px" },
];

const FEATURES = [
  {
    icon: <FiZap className="w-6 h-6 text-warning-text" />,
    title: "Sub-Second Streaming",
    desc: "Powered by Gemini 3.8 Flash with Server-Sent Events (SSE). Experience instantaneous token-by-token generation.",
    badge: "Fastest",
  },
  {
    icon: <FiCpu className="w-6 h-6 text-accent-text" />,
    title: "Multimodal Vision",
    desc: "Attach images, screenshots, diagrams, and data charts for instant optical AI analysis and actionable insights.",
    badge: "Vision 2.0",
  },
  {
    icon: <FiUsers className="w-6 h-6 text-primary-text" />,
    title: "Persistent Sessions",
    desc: "Every conversation is automatically stored and organized in MongoDB with inline rename, search, and delete.",
    badge: "Cloud Sync",
  },
  {
    icon: <FiCode className="w-6 h-6 text-primary-text" />,
    title: "Syntax Highlighting & Copy",
    desc: "Clean markdown parsing with syntax highlighting for 50+ languages and one-click code copy buttons.",
    badge: "Dev Ready",
  },
  {
    icon: <FiShield className="w-6 h-6 text-success-text" />,
    title: "Zero-Leak Security",
    desc: "HttpOnly JWT authentication, bcrypt encryption, and isolated sessions keep private prompts protected.",
    badge: "Encrypted",
  },
  {
    icon: <FiGlobe className="w-6 h-6 text-primary-text" />,
    title: "Direct Peer Chat",
    desc: "Seamlessly switch between AI intelligence and real-time human direct messaging via WebSockets.",
    badge: "Realtime",
  },
];

const TESTIMONIALS = [
  {
    quote: "Nexora AI has cut our engineering research time in half. The instant code snippet highlighting and multimodal vision are phenomenal.",
    author: "Sophia Martinez",
    role: "Lead Architect, HyperScale",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote: "The cleanest UI of any chatbot I've used. Fluid dark mode, instant response streaming, and zero fluff.",
    author: "David Vance",
    role: "Senior Full-Stack Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote: "Being able to bring our own Google Gemini API key while retaining shared team histories gives us complete autonomy.",
    author: "Amara Patel",
    role: "CTO, CloudPulse AI",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

/**
 * Modern, responsive Home landing page
 * Powered by Lenis smooth momentum scrolling and GSAP ScrollTrigger
 */
export const Home = () => {
  const { isAuthenticated } = useSelector((s) => s.user);
  const [activeTab, setActiveTab] = useState("chat");
  const [demoInput, setDemoInput] = useState("Explain how SSE streaming differs from WebSockets");
  const [demoOutput, setDemoOutput] = useState(
    "Server-Sent Events (SSE) provide a unidirectional HTTP channel where the server pushes real-time text chunks to the client. This makes it lighter, faster, and natively compatible with HTTP/2 proxies for AI token streaming, whereas WebSockets provide full-duplex communication ideal for two-way chat."
  );

  const starters = [
    { title: "Quantum Physics", prompt: "Explain quantum computing simply in 3 bullet points" },
    { title: "React Architecture", prompt: "Compare Zustand vs Redux Toolkit in 2026" },
    { title: "TypeScript Clean Code", prompt: "Write a type-safe debounce function with generic types" },
    { title: "Vision Analysis", prompt: "Analyze this UI mockup and suggest modern Tailwind improvements" },
  ];

  const handleStarterClick = (prompt) => {
    setDemoInput(prompt);
    setDemoOutput(
      `Generating response for "${prompt}"...\n\n1. Nexora AI executes contextual analysis with Gemini 3.8 Flash.\n2. Stream tokens arrive at <50ms per chunk over persistent SSE channels.\n3. Output is rendered with React Markdown & prism syntax highlighting.`
    );
  };

  const scrollToSection = (id) => {
    smoothScrollTo(id, { offset: -80, duration: 1.2 });
  };

  return (
    <PageLayout
      title="Nexora AI — Modern Multimodal Real-Time AI Chatbot"
      description="Connect with intelligence. Blazing-fast Gemini streaming, multimodal vision analysis, persistent workspace history, and collaborative team messaging."
    >
      {/* ── Ambient Background Visuals with GSAP Parallax ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <GsapParallax speed={0.35} yPercent={25} className="absolute inset-0">
          <div
            className="absolute w-[650px] h-[650px] -left-[120px] top-1/4 blur-[110px] opacity-25 dark:opacity-40"
            style={{ background: "radial-gradient(ellipse, rgb(var(--primary-rgb)/0.65) 0%, transparent 70%)" }}
          />
        </GsapParallax>
        <GsapParallax speed={-0.3} yPercent={30} className="absolute inset-0">
          <div
            className="absolute w-[550px] h-[550px] right-0 top-1/2 blur-[100px] opacity-20 dark:opacity-35"
            style={{ background: "radial-gradient(ellipse, rgb(var(--accent-rgb)/0.55) 0%, transparent 70%)" }}
          />
        </GsapParallax>
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-particleDrift"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: p.bg,
              animationDuration: p.dur,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════════
          HERO SECTION (Plays on load, not on scroll)
          ══════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-14 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* 1. Badge pill */}
          <Reveal variant="fadeDown" playOnMount delay={0.05} distance={16}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary-text mb-4 shadow-xs hover:border-primary transition-colors">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>Nexora 2.0 Released — Powered by Gemini 3.8 Flash</span>
            </div>
          </Reveal>

          {/* 2. Headline words reveal */}
          <AnimatedText
            text="Intelligent conversations,"
            highlight="streamed in real time."
            highlightClassName="text-gradient text-transparent inline-block md:whitespace-nowrap"
            delay={0.18}
            stagger={0.05}
            shine={true}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-fg mb-4 max-w-4xl mx-auto"
          />

          {/* 3. Subtitle */}
          <Reveal variant="fadeUp" playOnMount delay={0.52} distance={18}>
            <p className="text-base sm:text-lg text-fg-secondary max-w-2xl mx-auto leading-relaxed mb-6">
              A high-performance multimodal AI workspace with sub-second streaming, persistent session memory, vision parsing, and end-to-end encryption.
            </p>
          </Reveal>

          {/* 4. Action Buttons with Smooth Section Scroll Link */}
          <RevealStack
            playOnMount
            delay={0.7}
            stagger={0.1}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8"
          >
            <RevealItem variant="scaleIn">
              <motion.div
                whileHover={{ scale: 1.03, y: -1.5 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={isAuthenticated ? "/chat" : "/signup"}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-violet via-brand-indigo to-brand-cyan text-primary-contrast font-bold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{isAuthenticated ? "Launch AI Workspace" : "Get Started Free"}</span>
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </RevealItem>

            <RevealItem variant="scaleIn">
              <button
                type="button"
                onClick={() => scrollToSection("#demo")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-line-strong bg-surface/70 backdrop-blur-md text-fg font-semibold text-base hover:bg-surface-hover hover:border-primary/40 transition-all text-center inline-flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Interactive Preview</span>
                <FiChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-primary-text" />
              </button>
            </RevealItem>
          </RevealStack>

          {/* 5. Quick Stats Grid */}
          <RevealStack
            playOnMount
            delay={0.88}
            stagger={0.08}
            className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-3xl mx-auto pt-5 border-t border-line text-left"
          >
            {[
              { val: "< 400ms", label: "Average Time-to-First-Token", rawNum: 400, prefix: "< ", suffix: "ms" },
              { val: "99.98%", label: "Uptime Reliability SLA", rawNum: 99.98, prefix: "", suffix: "%" },
              { val: "100%", label: "Encrypted Session Privacy", rawNum: 100, prefix: "", suffix: "%" },
              { val: "50+ Langs", label: "Markdown Code Highlighting", rawNum: 50, prefix: "", suffix: "+ Langs" },
            ].map((stat, idx) => (
              <RevealItem key={idx} variant="fadeUp" whileHover={{ y: -3 }}>
                <div className="p-3.5 rounded-xl bg-surface/90 dark:bg-surface/85 backdrop-blur-md border border-line hover:border-primary/30 transition-all shadow-xs">
                  <p className="text-xl sm:text-2xl font-bold text-gradient text-transparent">
                    <CountUp
                      value={stat.rawNum}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={1.0}
                    />
                  </p>
                  <p className="text-xs text-fg-muted mt-0.5">{stat.label}</p>
                </div>
              </RevealItem>
            ))}
          </RevealStack>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LIVE INTERACTIVE PLAYGROUND DEMO (With GSAP Scrub Scale)
          ══════════════════════════════════════════════ */}
      <GsapSection id="demo" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <GsapScrubScale initialScale={0.93} targetScale={1.0} initialRotateX={6} start="top 90%" end="top 30%">
          <div className="rounded-3xl border border-primary/25 bg-surface/85 backdrop-blur-2xl shadow-2xl overflow-hidden hover:border-primary/45 transition-colors">
            {/* Window Chrome Header */}
            <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-surface-hover/90">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs font-semibold text-fg-secondary ml-2">
                  Nexora AI Playground — Gemini 3.8 Flash Live Stream
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {["chat", "code", "vision"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      activeTab === tab
                        ? "bg-primary text-primary-contrast shadow-xs"
                        : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Starter Chips */}
            <div className="p-4 sm:p-6 border-b border-line bg-primary/5">
              <p className="text-xs font-semibold text-fg-muted mb-3">
                Click a starter prompt to preview live rendering:
              </p>
              <GsapStagger stagger={0.08} childSelector=".starter-chip" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {starters.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    title={s.prompt}
                    onClick={() => handleStarterClick(s.prompt)}
                    className="starter-chip w-full min-h-[92px] p-3.5 rounded-xl text-left bg-surface border border-line hover:border-primary/50 hover:shadow-md transition-all text-xs cursor-pointer group flex flex-col justify-between"
                  >
                    <p className="font-bold text-fg group-hover:text-primary-text">
                      {s.title}
                    </p>
                    <p className="text-xs text-fg-muted line-clamp-2 mt-1 leading-snug break-words">
                      {s.prompt}
                    </p>
                  </button>
                ))}
              </GsapStagger>
            </div>

            {/* Simulated Chat Dialogue */}
            <div className="p-6 sm:p-8 space-y-5 min-h-[300px]">
              {/* User message */}
              <div className="flex gap-3 justify-end">
                <motion.div
                  initial={{ opacity: 0, x: 20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 py-3 rounded-2xl rounded-br-none bg-gradient-to-r from-brand-violet to-brand-indigo text-primary-contrast text-sm max-w-[80%] shadow-md"
                >
                  {demoInput}
                </motion.div>
              </div>

              {/* Assistant message */}
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center text-primary-contrast shrink-0 shadow-md">
                  <FiCpu className="w-4 h-4" />
                </div>
                <motion.div
                  key={demoOutput}
                  initial={{ opacity: 0, x: -16, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="px-5 py-4 rounded-2xl rounded-bl-none bg-surface-hover border border-line text-fg text-sm max-w-[85%] leading-relaxed shadow-xs"
                >
                  <p className="whitespace-pre-line">{demoOutput}</p>
                  <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs text-fg-muted">
                    <span>Model: gemini-3.8-flash</span>
                    <span className="text-success-text font-medium">Latency: 312ms</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Footer Callout inside demo */}
            <div className="px-6 py-4 bg-surface-hover/80 border-t border-line flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-fg-muted">
                Ready to test multimodal prompts with your own image attachments?
              </span>
              <Link
                to="/chat"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-text hover:underline"
              >
                Open Live Chatbox →
              </Link>
            </div>
          </div>
        </GsapScrubScale>
      </GsapSection>

      {/* ══════════════════════════════════════════════
          CORE FEATURES GRID (With GSAP ScrollTrigger Stagger)
          ══════════════════════════════════════════════ */}
      <GsapSection id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8 bg-canvas/90 dark:bg-canvas/95 backdrop-blur-xl -z-10 pointer-events-none rounded-3xl" aria-hidden="true" />
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-2">
            Engineered for Developers & Teams
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight">
            Everything required for modern AI collaboration
          </h3>
          <p className="text-sm sm:text-base text-fg-secondary mt-3">
            No convoluted setups. Connect, stream, code, and share instantly.
          </p>
        </div>

        <GsapStagger
          stagger={0.11}
          y={50}
          childSelector=".feature-card"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="feature-card h-full p-7 rounded-2xl bg-surface border border-line hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-line-strong flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    {feat.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary-text border border-line-strong">
                    {feat.badge}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-fg mb-2 group-hover:text-primary-text transition-colors">
                  {feat.title}
                </h4>
                <p className="text-sm text-fg-secondary leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </GsapStagger>
      </GsapSection>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS SECTION (With GSAP ScrollTrigger Stagger)
          ══════════════════════════════════════════════ */}
      <GsapSection id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-line">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-2">
            Loved by Developers
          </h2>
          <h3 className="text-3xl font-extrabold text-fg">
            Trusted by creators across the world
          </h3>
        </div>

        <GsapStagger
          stagger={0.12}
          y={40}
          childSelector=".testimonial-card"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="testimonial-card h-full p-7 rounded-2xl bg-surface/85 border border-line shadow-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-warning-text mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-warning-text" />
                  ))}
                </div>
                <p className="text-sm text-fg-secondary italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-line">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-primary/30"
                />
                <div>
                  <p className="text-sm font-bold text-fg">{t.author}</p>
                  <p className="text-xs text-fg-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </GsapStagger>
      </GsapSection>

      {/* ══════════════════════════════════════════════
          FINAL CALL TO ACTION (With GSAP Section Entrance)
          ══════════════════════════════════════════════ */}
      <GsapSection id="cta" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-brand-violet/20 via-brand-indigo/20 to-brand-cyan/20 border border-primary/35 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-fg tracking-tight mb-4">
              Supercharge your workflow today
            </h2>
            <p className="text-base text-fg-secondary leading-relaxed mb-8">
              Join thousands of engineers, researchers, and creators using Nexora AI for intelligent real-time chats.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={isAuthenticated ? "/chat" : "/signup"}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-bold text-base shadow-lg shadow-primary/40 transition-all inline-block"
                >
                  {isAuthenticated ? "Go to Workspace →" : "Create Free Account →"}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl border border-line-strong bg-surface/50 text-fg font-semibold hover:bg-surface-hover transition-all inline-block"
                >
                  Compare Plans
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </GsapSection>
    </PageLayout>
  );
};

export default Home;
