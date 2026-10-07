import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiZap,
  FiShield,
  FiUsers,
  FiPaperclip,
  FiSmile,
  FiLock,
  FiArrowRight,
  FiMessageSquare,
  FiGlobe,
  FiCpu,
  FiCheckCircle,
  FiStar,
  FiCode,
} from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { ScrollReveal } from "../components/common/ScrollReveal";

const PARTICLES = [
  { left: "8%", top: "15%", dur: "20s", delay: "0s", bg: "rgba(6,182,212,0.4)", size: "3px" },
  { left: "20%", top: "70%", dur: "25s", delay: "-4s", bg: "rgba(139,92,246,0.5)", size: "2px" },
  { left: "40%", top: "10%", dur: "18s", delay: "-8s", bg: "rgba(236,72,153,0.35)", size: "2px" },
  { left: "60%", top: "80%", dur: "22s", delay: "-2s", bg: "rgba(6,182,212,0.3)", size: "4px" },
  { left: "75%", top: "25%", dur: "19s", delay: "-6s", bg: "rgba(139,92,246,0.4)", size: "2px" },
  { left: "90%", top: "55%", dur: "24s", delay: "-1s", bg: "rgba(236,72,153,0.3)", size: "3px" },
];

const FEATURES = [
  {
    icon: <FiZap className="w-6 h-6 text-amber-500" />,
    title: "Sub-Second Streaming",
    desc: "Powered by Gemini 3.8 Flash with Server-Sent Events (SSE). Experience instantaneous token-by-token generation.",
    badge: "Fastest",
  },
  {
    icon: <FiCpu className="w-6 h-6 text-cyan-500" />,
    title: "Multimodal Vision",
    desc: "Attach images, screenshots, diagrams, and data charts for instant optical AI analysis and actionable insights.",
    badge: "Vision 2.0",
  },
  {
    icon: <FiUsers className="w-6 h-6 text-violet-500" />,
    title: "Persistent Sessions",
    desc: "Every conversation is automatically stored and organized in MongoDB with inline rename, search, and delete.",
    badge: "Cloud Sync",
  },
  {
    icon: <FiCode className="w-6 h-6 text-pink-500" />,
    title: "Syntax Highlighting & Copy",
    desc: "Clean markdown parsing with syntax highlighting for 50+ languages and one-click code copy buttons.",
    badge: "Dev Ready",
  },
  {
    icon: <FiShield className="w-6 h-6 text-emerald-500" />,
    title: "Zero-Leak Security",
    desc: "HttpOnly JWT authentication, bcrypt encryption, and isolated sessions keep private prompts protected.",
    badge: "Encrypted",
  },
  {
    icon: <FiGlobe className="w-6 h-6 text-indigo-500" />,
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

  return (
    <PageLayout
      title="Nexora AI — Modern Multimodal Real-Time AI Chatbot"
      description="Connect with intelligence. Blazing-fast Gemini streaming, multimodal vision analysis, persistent workspace history, and collaborative team messaging."
    >
      {/* ── Ambient Background Visuals ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute w-[600px] h-[600px] -left-[100px] top-1/4 blur-[100px] opacity-25 dark:opacity-35"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.6) 0%, transparent 70%)" }}
        />
        <div
          className="absolute w-[500px] h-[500px] right-0 bottom-1/4 blur-[100px] opacity-20 dark:opacity-30"
          style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.5) 0%, transparent 70%)" }}
        />
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
          HERO SECTION
          ══════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <ScrollReveal animation="fade-up" delay={80}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/25 text-xs font-semibold text-violet-600 dark:text-violet-300 mb-6 shadow-xs hover:border-violet-400 transition-colors">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
              <span>Nexora 2.0 Released — Powered by Gemini 3.8 Flash</span>
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal animation="fade-up" delay={160}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-900 dark:text-slate-100 mb-6">
              Intelligent conversations,{" "}
              <span className="bg-gradient-to-r from-violet-500 via-violet-600 to-cyan-400 bg-clip-text text-transparent">
                streamed in real time.
              </span>
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal animation="fade-up" delay={240}>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              A high-performance multimodal AI workspace with sub-second streaming, persistent session memory, vision parsing, and end-to-end encryption.
            </p>
          </ScrollReveal>

          {/* Action Buttons */}
          <ScrollReveal animation="fade-up" delay={320}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                to={isAuthenticated ? "/chat" : "/signup"}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-base shadow-lg shadow-violet-900/30 hover:shadow-violet-900/50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{isAuthenticated ? "Launch AI Workspace" : "Get Started Free"}</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/docs"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-slate-800 dark:text-slate-200 font-semibold text-base hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-violet-500/40 transition-all text-center"
              >
                Explore API Docs
              </Link>
            </div>
          </ScrollReveal>

          {/* Quick Stats Grid */}
          <ScrollReveal animation="fade-up" delay={400}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-violet-500/10 text-left">
              {[
                { val: "< 400ms", label: "Average Time-to-First-Token" },
                { val: "99.98%", label: "Uptime Reliability SLA" },
                { val: "100%", label: "Encrypted Session Privacy" },
                { val: "50+ Langs", label: "Markdown Code Highlighting" },
              ].map((stat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/40 dark:bg-[#111840]/40 border border-violet-500/10 hover:border-violet-500/30 transition-all">
                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                    {stat.val}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LIVE INTERACTIVE PLAYGROUND DEMO
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <ScrollReveal animation="fade-up" distance={40} delay={100}>
          <div className="rounded-3xl border border-violet-500/25 bg-white/80 dark:bg-[#0a0f2a]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Window Chrome Header */}
            <div className="px-5 py-4 border-b border-violet-500/15 flex items-center justify-between bg-slate-100/90 dark:bg-[#0d1230]/90">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-2">
                  Nexora AI Playground — Gemini 3.8 Flash
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
                        ? "bg-violet-600 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Starter Chips */}
            <div className="p-4 sm:p-6 border-b border-violet-500/10 bg-violet-500/5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                Click a starter prompt to preview live rendering:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {starters.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleStarterClick(s.prompt)}
                    className="p-3 rounded-xl text-left bg-white dark:bg-[#111840] border border-violet-500/15 hover:border-violet-500/50 hover:shadow-md transition-all text-xs cursor-pointer group"
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-300">
                      {s.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                      {s.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Chat Dialogue */}
            <div className="p-6 sm:p-8 space-y-5 min-h-[300px]">
              {/* User message */}
              <div className="flex gap-3 justify-end">
                <div className="px-4 py-3 rounded-2xl rounded-br-none bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm max-w-[80%] shadow-md">
                  {demoInput}
                </div>
              </div>

              {/* Assistant message */}
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <FiCpu className="w-4 h-4" />
                </div>
                <div className="px-5 py-4 rounded-2xl rounded-bl-none bg-slate-100 dark:bg-[#111840] border border-violet-500/15 text-slate-800 dark:text-slate-200 text-sm max-w-[85%] leading-relaxed shadow-xs">
                  <p className="whitespace-pre-line">{demoOutput}</p>
                  <div className="mt-4 pt-3 border-t border-violet-500/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Model: gemini-3.8-flash</span>
                    <span className="text-emerald-500 font-medium">Latency: 312ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Callout inside demo */}
            <div className="px-6 py-4 bg-slate-100/80 dark:bg-[#0d1230]/80 border-t border-violet-500/15 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Ready to test multimodal prompts with your own image attachments?
              </span>
              <Link
                to="/chat"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
              >
                Open Live Chatbox →
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════
          CORE FEATURES GRID
          ══════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
            Engineered for Developers & Teams
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Everything required for modern AI collaboration
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
            No convoluted setups. Connect, stream, code, and share instantly.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => (
            <ScrollReveal
              key={idx}
              animation="fade-up"
              delay={(idx % 3) * 100}
              distance={35}
            >
              <div
                className="h-full p-7 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 hover:border-violet-500/40 hover:shadow-xl transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20">
                      {feat.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS SECTION
          ══════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-violet-500/10">
        <ScrollReveal animation="fade-up" className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
            Loved by Developers
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Trusted by creators across the world
          </h3>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <ScrollReveal
              key={idx}
              animation="fade-up"
              delay={idx * 100}
              distance={35}
            >
              <div
                className="h-full p-7 rounded-2xl bg-white/80 dark:bg-[#0a0f2a]/80 border border-violet-500/15 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-violet-500/10">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover border border-violet-500/30"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.author}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CALL TO ACTION
          ══════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <ScrollReveal animation="fade-up" distance={40}>
          <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-violet-600/20 via-indigo-600/20 to-cyan-500/20 border border-violet-500/30 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
                Supercharge your workflow today
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                Join thousands of engineers, researchers, and creators using Nexora AI for intelligent real-time chats.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={isAuthenticated ? "/chat" : "/signup"}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-base shadow-lg shadow-violet-900/40 hover:-translate-y-0.5 transition-all"
                >
                  {isAuthenticated ? "Go to Workspace →" : "Create Free Account →"}
                </Link>
                <Link
                  to="/pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Compare Plans
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </PageLayout>
  );
};

export default Home;
