import { Link } from "react-router-dom";
import {
  FiTarget,
  FiCompass,
  FiShield,
  FiCpu,
  FiUsers,
  FiHeart,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { PageHeader } from "../components/layout/PageHeader";

const CORE_VALUES = [
  {
    icon: <FiCpu className="w-6 h-6 text-violet-500" />,
    title: "Intelligence Without Latency",
    desc: "We believe conversations with AI should feel as fluid and immediate as natural human dialogue. We prioritize sub-second streaming over bloated abstraction layers.",
  },
  {
    icon: <FiShield className="w-6 h-6 text-emerald-500" />,
    title: "Privacy First & User Ownership",
    desc: "Your prompts and thoughts are your intellectual property. We implement strict JWT security, bcrypt encryption, and isolated sessions with zero secret harvesting.",
  },
  {
    icon: <FiCompass className="w-6 h-6 text-cyan-500" />,
    title: "Multimodal Native",
    desc: "Thinking is visual as well as textual. Nexora integrates image understanding seamlessly into standard chat streams without requiring special modes or plugins.",
  },
  {
    icon: <FiUsers className="w-6 h-6 text-pink-500" />,
    title: "Human + Machine Collaboration",
    desc: "AI is an amplifier, not a replacement. We unite AI generation with real-time human peer-to-peer messaging inside a unified, distraction-free environment.",
  },
];

const TEAM = [
  {
    name: "Alex Vance",
    role: "Founder & Lead Architect",
    bio: "Ex-Google DeepMind engineer passionate about low-latency inference, real-time distributed systems, and modern UI engineering.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    skills: ["System Architecture", "Google GenAI", "WebSockets"],
    socials: { github: "https://github.com", twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
  {
    name: "Sarah Chen",
    role: "Head of AI & NLP",
    bio: "Specializing in prompt engineering, context window management, and multimodal vision evaluation across Gemini models.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    skills: ["LLM Optimization", "Vision Models", "Python"],
    socials: { github: "https://github.com", twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
  {
    name: "Devon Marcus",
    role: "Lead Full-Stack Engineer",
    bio: "Architecting persistent MongoDB session pipelines, SSE backoff protocols, and snappy Tailwind interfaces.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    skills: ["React 19", "Express.js", "MongoDB Atlas"],
    socials: { github: "https://github.com", twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
  {
    name: "Elena Rostova",
    role: "Product & UI/UX Designer",
    bio: "Obsessed with micro-interactions, dark mode color harmony, accessibility, and high-efficiency typography.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    skills: ["Design Systems", "Figma", "Tailwind CSS"],
    socials: { github: "https://github.com", twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
];

const ROADMAP = [
  {
    quarter: "Q1 2026",
    title: "Nexora 1.0 Launch",
    status: "Completed",
    desc: "Initial release featuring Gemini 2.5/3.8 Flash, SSE streaming, and MongoDB session persistence.",
  },
  {
    quarter: "Q2 2026",
    title: "Multimodal Vision & Realtime WS",
    status: "Completed",
    desc: "Optical image attachment parsing, direct human chat, and syntax-highlighted code blocks with 1-click copy.",
  },
  {
    quarter: "Q3 2026",
    title: "Collaborative Workspaces & Teams",
    status: "In Progress",
    desc: "Shared project threads, custom system prompt templates, and granular role permissions.",
  },
  {
    quarter: "Q4 2026",
    title: "Self-Hosted Edge Runtime & Plugins",
    status: "Planned",
    desc: "Local Ollama/vLLM routing fallback, offline caching, and native webhook integration.",
  },
];

/**
 * About Page Component
 */
export const About = () => {
  return (
    <PageLayout
      title="About Us"
      description="Learn about Nexora AI's vision, core engineering principles, architectural roadmap, and the team driving real-time intelligence."
    >
      {/* ── Page Hero Header ── */}
      <PageHeader
        badge="Our Mission"
        title="We are building the future of"
        highlight="fluid human-AI communication."
        description="Nexora AI was born from a simple belief: artificial intelligence should respond at the speed of thought, respect your privacy, and seamlessly integrate into your daily workflow."
        breadcrumbs={[{ label: "About" }]}
      />

      {/* ══════════════════════════════════════════════
          THE STORY BEHIND NEXORA
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
                The Story Behind Nexora
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  In early 2025, our team grew frustrated with sluggish chatbot interfaces that required constant page refreshes, lost conversation context, and locked users into restrictive walled gardens.
                </p>
                <p>
                  We set out to build an open, high-throughput MERN-powered chat application that combines the raw reasoning power of Google Gemini with real-time SSE streaming, persistent MongoDB storage, and peer-to-peer WebSockets.
                </p>
                <p>
                  Today, Nexora AI powers conversations for individual developers, research teams, and creative agencies worldwide.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-center">
                <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-300">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">JavaScript Full-Stack</p>
              </div>
              <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-300">&lt;500ms</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Average Response Start</p>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-300">24/7</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">MongoDB Sync</p>
              </div>
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-300">0</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Data Selling</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CORE VALUES & PILLARS
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
            What Drives Us
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Our Architectural & Ethical Pillars
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CORE_VALUES.map((val, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 hover:border-violet-500/35 transition-all shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
                {val.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {val.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LEADERSHIP & CORE TEAM
          ══════════════════════════════════════════════ */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-violet-500/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
            Meet the Builders
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            The Team Behind the AI Experience
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Engineers, designers, and researchers passionate about high-impact generative tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#0a0f2a] border border-violet-500/15 shadow-sm hover:shadow-xl hover:border-violet-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative mb-5 overflow-hidden rounded-xl aspect-square">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div className="flex gap-2 text-white">
                      <a href={member.socials.github} target="_blank" rel="noreferrer" className="p-1 hover:text-violet-400">
                        <FiGithub className="w-4 h-4" />
                      </a>
                      <a href={member.socials.twitter} target="_blank" rel="noreferrer" className="p-1 hover:text-cyan-400">
                        <FiTwitter className="w-4 h-4" />
                      </a>
                      <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="p-1 hover:text-indigo-400">
                        <FiLinkedin className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {member.name}
                </h4>
                <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-3">
                  {member.role}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {member.bio}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-violet-500/10">
                {member.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ROADMAP TIMELINE
          ══════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-violet-500/10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-2">
            Looking Ahead
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Product Evolution & Milestones
          </h3>
        </div>

        <div className="relative border-l-2 border-violet-500/20 ml-4 sm:ml-8 space-y-10 pl-6 sm:pl-8">
          {ROADMAP.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  item.status === "Completed"
                    ? "bg-emerald-500 border-emerald-400"
                    : item.status === "In Progress"
                    ? "bg-violet-500 border-violet-400 animate-pulse"
                    : "bg-slate-400 border-slate-500 dark:bg-slate-700"
                }`}
              />

              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-extrabold text-violet-600 dark:text-violet-400">
                  {item.quarter}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.status === "Completed"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : item.status === "In Progress"
                      ? "bg-violet-500/15 text-violet-600 dark:text-violet-300"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                {item.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          JOIN THE JOURNEY CTA
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-violet-600/10 border border-violet-500/25">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
            Want to help shape Nexora AI?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-6">
            We are always looking for open-source contributors, community moderators, and developer feedback.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/community"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-md transition-all"
            >
              Join Our Community
            </Link>
            <Link
              to="/docs"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
