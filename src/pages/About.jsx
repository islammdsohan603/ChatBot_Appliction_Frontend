import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCompass,
  FiShield,
  FiCpu,
  FiUsers,
  FiGithub,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";
import { PageLayout } from "../components/layout/PageLayout";
import { PageHeader } from "../components/layout/PageHeader";
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "../components/motion";

const CORE_VALUES = [
  {
    icon: <FiCpu className="w-6 h-6 text-primary-text" />,
    title: "Intelligence Without Latency",
    desc: "We believe conversations with AI should feel as fluid and immediate as natural human dialogue. We prioritize sub-second streaming over bloated abstraction layers.",
  },
  {
    icon: <FiShield className="w-6 h-6 text-success-text" />,
    title: "Privacy First & User Ownership",
    desc: "Your prompts and thoughts are your intellectual property. We implement strict JWT security, bcrypt encryption, and isolated sessions with zero secret harvesting.",
  },
  {
    icon: <FiCompass className="w-6 h-6 text-accent-text" />,
    title: "Multimodal Native",
    desc: "Thinking is visual as well as textual. Nexora integrates image understanding seamlessly into standard chat streams without requiring special modes or plugins.",
  },
  {
    icon: <FiUsers className="w-6 h-6 text-primary-text" />,
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
 * Upgraded with unified Framer Motion scroll reveals
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
        <Reveal variant="fadeUp" distance={28}>
          <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-line shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight mb-4">
                  The Story Behind Nexora
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-fg-secondary leading-relaxed">
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

              <RevealGroup stagger={0.08} className="grid grid-cols-2 gap-4">
                <RevealItem variant="scaleIn">
                  <div className="p-5 rounded-2xl bg-primary/10 border border-line-strong text-center">
                    <p className="text-3xl font-extrabold text-primary-text">100%</p>
                    <p className="text-xs text-fg-muted mt-1 font-medium">JavaScript Full-Stack</p>
                  </div>
                </RevealItem>
                <RevealItem variant="scaleIn">
                  <div className="p-5 rounded-2xl bg-accent/10 border border-accent/20 text-center">
                    <p className="text-3xl font-extrabold text-accent-text">&lt;500ms</p>
                    <p className="text-xs text-fg-muted mt-1 font-medium">Average Response Start</p>
                  </div>
                </RevealItem>
                <RevealItem variant="scaleIn">
                  <div className="p-5 rounded-2xl bg-success/10 border border-success/20 text-center">
                    <p className="text-3xl font-extrabold text-success-text">24/7</p>
                    <p className="text-xs text-fg-muted mt-1 font-medium">MongoDB Sync</p>
                  </div>
                </RevealItem>
                <RevealItem variant="scaleIn">
                  <div className="p-5 rounded-2xl bg-warning/10 border border-warning/20 text-center">
                    <p className="text-3xl font-extrabold text-warning-text">0</p>
                    <p className="text-xs text-fg-muted mt-1 font-medium">Data Selling</p>
                  </div>
                </RevealItem>
              </RevealGroup>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════
          CORE VALUES & PILLARS
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-2">
            What Drives Us
          </h2>
          <h3 className="text-3xl font-extrabold text-fg tracking-tight">
            Our Architectural & Ethical Pillars
          </h3>
        </Reveal>

        <RevealGroup stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CORE_VALUES.map((val, idx) => (
            <RevealItem
              key={idx}
              variant="fadeUp"
              whileHover={{ y: -4 }}
              className="h-full"
            >
              <div className="h-full p-8 rounded-2xl bg-surface border border-line hover:border-primary/35 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-line-strong flex items-center justify-center mb-5">
                  {val.icon}
                </div>
                <h4 className="text-lg font-bold text-fg mb-2">
                  {val.title}
                </h4>
                <p className="text-sm text-fg-secondary leading-relaxed">
                  {val.desc}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ══════════════════════════════════════════════
          LEADERSHIP & CORE TEAM
          ══════════════════════════════════════════════ */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-line">
        <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-2">
            Meet the Builders
          </h2>
          <h3 className="text-3xl font-extrabold text-fg tracking-tight">
            The Team Behind the AI Experience
          </h3>
          <p className="text-sm text-fg-secondary mt-2">
            Engineers, designers, and researchers passionate about high-impact generative tools.
          </p>
        </Reveal>

        <RevealGroup stagger={0.09} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, idx) => (
            <RevealItem
              key={idx}
              variant="scaleIn"
              whileHover={{ y: -4 }}
              className="h-full"
            >
              <div className="h-full p-6 rounded-2xl bg-surface border border-line shadow-sm hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="relative mb-5 overflow-hidden rounded-xl aspect-square">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-scrim/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex gap-2 text-primary-contrast">
                        <a href={member.socials.github} target="_blank" rel="noreferrer" className="p-1 hover:text-primary-text">
                          <FiGithub className="w-4 h-4" />
                        </a>
                        <a href={member.socials.twitter} target="_blank" rel="noreferrer" className="p-1 hover:text-accent-text">
                          <FiTwitter className="w-4 h-4" />
                        </a>
                        <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="p-1 hover:text-primary-text">
                          <FiLinkedin className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-fg">
                    {member.name}
                  </h4>
                  <p className="text-xs font-semibold text-primary-text mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs text-fg-secondary leading-relaxed mb-4">
                    {member.bio}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-line">
                  {member.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-hover text-fg-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ══════════════════════════════════════════════
          ROADMAP TIMELINE
          ══════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-line">
        <Reveal variant="fadeUp" className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-2">
            Looking Ahead
          </h2>
          <h3 className="text-3xl font-extrabold text-fg tracking-tight">
            Product Evolution & Milestones
          </h3>
        </Reveal>

        <div className="relative border-l-2 border-line-strong ml-4 sm:ml-8 space-y-10 pl-6 sm:pl-8">
          {ROADMAP.map((item, idx) => (
            <Reveal
              key={idx}
              variant={idx % 2 === 0 ? "slideRight" : "slideLeft"}
              delay={idx * 0.08}
              className="relative group"
            >
              {/* Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  item.status === "Completed"
                    ? "bg-success border-success"
                    : item.status === "In Progress"
                    ? "bg-primary border-primary animate-pulse"
                    : "bg-fg-muted border-line-strong"
                }`}
              />

              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-extrabold text-primary-text">
                  {item.quarter}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.status === "Completed"
                      ? "bg-success/15 text-success-text"
                      : item.status === "In Progress"
                      ? "bg-primary/15 text-primary-text"
                      : "bg-surface-hover text-fg-muted"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <h4 className="text-lg font-bold text-fg mb-1">
                {item.title}
              </h4>
              <p className="text-sm text-fg-secondary leading-relaxed">
                {item.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          JOIN THE JOURNEY CTA
          ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <Reveal variant="fadeUp" distance={28}>
          <div className="p-8 sm:p-12 rounded-3xl bg-primary/10 border border-primary/25">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-fg mb-3">
              Want to help shape Nexora AI?
            </h3>
            <p className="text-sm text-fg-secondary max-w-lg mx-auto mb-6">
              We are always looking for open-source contributors, community moderators, and developer feedback.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/community"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-semibold text-sm shadow-md transition-all inline-block"
                >
                  Join Our Community
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/docs"
                  className="px-6 py-3 rounded-xl border border-line-strong text-fg-secondary hover:bg-surface-hover font-semibold text-sm transition-all inline-block"
                >
                  Read Documentation
                </Link>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageLayout>
  );
};

export default About;
