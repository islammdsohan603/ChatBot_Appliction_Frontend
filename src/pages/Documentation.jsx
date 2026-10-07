import { useState, useEffect } from "react";
import {
  FiBook,
  FiCode,
  FiCopy,
  FiCheck,
  FiSearch,
  FiExternalLink,
  FiTerminal,
  FiCpu,
  FiKey,
  FiRadio,
  FiLayers,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { PageLayout } from "../components/layout/PageLayout";
import { PageHeader } from "../components/layout/PageHeader";
import { ScrollReveal } from "../components/common/ScrollReveal";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000";

const FALLBACK_SECTIONS = [
  {
    id: "getting-started",
    category: "Getting Started",
    title: "Introduction & Architecture",
    description: "Overview of Nexora AI core primitives, communication channels, and design principles.",
    content: `Nexora AI is built on a high-throughput MERN architecture leveraging WebSocket (Socket.io) for peer messaging and Server-Sent Events (SSE) for low-latency streaming inference from Google Gemini 3.8 Flash. All sessions are persistently synced with MongoDB.

Key primitives:
• Multi-turn Turn Alternation: Guarantees strict user-model alternation preventing 503 load errors.
• Multimodal Vision: Inline base64 and Cloudinary image parsing.
• Real-time SSE Stream: Progressive token decoding at <50ms per token.`,
    codeSnippet: {
      language: "bash",
      code: `# 1. Clone the repository
git clone https://github.com/nexora/nexora-ai.git

# 2. Setup backend
cd nexora-ai/backend
npm install
npm run dev

# 3. Setup frontend
cd ../frontend
npm install
npm run dev`,
    },
  },
  {
    id: "authentication",
    category: "Authentication",
    title: "JWT Authentication & Sessions",
    description: "Secure cookie-based authentication with bcrypt hashing and JWT tokens.",
    method: "POST",
    endpoint: "/api/auth/login",
    content: "Nexora uses HTTP-only cookies containing signed JWT tokens. When making API requests from custom clients, pass credentials: 'include' or supply a Bearer token in the Authorization header.",
    codeSnippet: {
      language: "javascript",
      code: `const response = await fetch("http://localhost:8000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    email: "user@example.com",
    password: "securePassword123"
  })
});
const data = await response.json();
console.log("Logged in user:", data.user);`,
    },
  },
  {
    id: "streaming-api",
    category: "API Reference",
    title: "Real-time AI Chat Streaming",
    description: "Stream Gemini Flash conversational turns over Server-Sent Events (SSE).",
    method: "POST",
    endpoint: "/api/conversations/stream",
    content: "Submits a prompt or multimodal image attachment. The server yields chunks using data: {\"text\": \"...\"} lines and terminates with data: [DONE]. Turn alternation is automatically handled.",
    codeSnippet: {
      language: "javascript",
      code: `const response = await fetch("http://localhost:8000/api/conversations/stream", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    conversationId: "optional_conversation_id",
    prompt: "Write a high-performance LRU cache in JavaScript",
    imageUrl: null,
    model: "gemini-3.8-flash"
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  console.log(chunk);
}`,
    },
  },
  {
    id: "conversations-rest",
    category: "API Reference",
    title: "Conversations & Session Management",
    description: "Retrieve, rename, and delete conversation sessions.",
    method: "GET",
    endpoint: "/api/conversations",
    content: "Returns the authenticated user's conversation sessions ordered by most recently updated.",
    codeSnippet: {
      language: "javascript",
      code: `// Fetch all user conversations
const res = await axios.get("http://localhost:8000/api/conversations", { withCredentials: true });
console.log(res.data); // [{ _id, title, lastMessage, updatedAt }]

// Rename conversation session
await axios.put("http://localhost:8000/api/conversations/:id", { title: "Updated Title" }, { withCredentials: true });

// Delete conversation session
await axios.delete("http://localhost:8000/api/conversations/:id", { withCredentials: true });`,
    },
  },
  {
    id: "websocket-events",
    category: "Guides",
    title: "WebSocket Peer-to-Peer Events",
    description: "Direct messaging events between users with online status tracking.",
    method: "WS",
    endpoint: "ws://localhost:8000",
    content: "Socket.io events handle real-time user-to-user chatting, typing indicators, and immediate message receipt badges.",
    codeSnippet: {
      language: "javascript",
      code: `import { io } from "socket.io-client";

const socket = io("http://localhost:8000", { withCredentials: true });

socket.on("connect", () => console.log("Connected to Nexora WS"));
socket.on("receive_message", (msg) => console.log("New message:", msg));

// Emit outgoing message
socket.emit("send_message", {
  receiverId: "65f2a1b9c8...",
  text: "Hello from Nexora SDK"
});`,
    },
  },
  {
    id: "python-sdk",
    category: "SDKs",
    title: "Python SDK Quickstart",
    description: "Connect to Nexora AI backend using Python requests.",
    content: "Stream and integrate Nexora AI directly into backend microservices or CLI tools with Python.",
    codeSnippet: {
      language: "python",
      code: `import requests
import json

url = "http://localhost:8000/api/conversations/stream"
payload = {"prompt": "Write a Python binary search function"}

with requests.post(url, json=payload, stream=True) as resp:
    for line in resp.iter_lines():
        if line:
            decoded = line.decode("utf-8")
            if decoded.startswith("data: "):
                token = decoded[6:]
                if token != "[DONE]":
                    print(json.loads(token).get("text", ""), end="", flush=True)`,
    },
  },
];

/**
 * Documentation & API Reference Page
 */
export const Documentation = () => {
  const [sections, setSections] = useState(FALLBACK_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/docs/sections`);
        if (res.data?.sections && res.data.sections.length > 0) {
          setSections(res.data.sections);
        }
      } catch (err) {
        console.warn("Docs fetch fallback:", err);
      }
    };
    fetchDocs();
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSections = sections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSection =
    sections.find((s) => s.id === activeSectionId) || sections[0] || FALLBACK_SECTIONS[0];

  const categories = Array.from(new Set(sections.map((s) => s.category)));

  return (
    <PageLayout
      title="Documentation & API Reference"
      description="Comprehensive guides, REST endpoints, SSE streaming protocols, and SDK code examples for Nexora AI."
    >
      <PageHeader
        badge="Developer Portal"
        title="Comprehensive guides, APIs, and"
        highlight="real-time streaming specs."
        description="Integrate Nexora AI into your frontend apps, backend microservices, or custom agentic workflows."
        breadcrumbs={[{ label: "Docs" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ══════════════════════════════════════════════
              LEFT STICKY SIDEBAR NAVIGATION
              ══════════════════════════════════════════════ */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <ScrollReveal animation="fade-up" delay={80}>
              <div className="rounded-3xl bg-surface border border-line p-5 shadow-sm space-y-6">
                {/* Search filter */}
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
                  <input
                    type="text"
                    placeholder="Search endpoints or guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-canvas border border-line-strong focus:border-primary outline-none placeholder:text-fg-muted text-fg"
                  />
                </div>

                {/* Categorized links list */}
                <div className="space-y-5 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const catSections = filteredSections.filter((s) => s.category === cat);
                    if (catSections.length === 0) return null;

                    return (
                      <div key={cat}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted mb-2">
                          {cat}
                        </p>
                        <div className="space-y-1">
                          {catSections.map((sec) => (
                            <button
                              key={sec.id}
                              type="button"
                              onClick={() => setActiveSectionId(sec.id)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                activeSectionId === sec.id
                                  ? "bg-primary text-primary-contrast shadow-xs"
                                  : "text-fg-secondary hover:text-fg hover:bg-primary/10"
                              }`}
                            >
                              <span className="truncate">{sec.title}</span>
                              {sec.method && (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    sec.method === "POST"
                                      ? "bg-info/20 text-info-text"
                                      : sec.method === "GET"
                                      ? "bg-success/20 text-success-text"
                                      : sec.method === "WS"
                                      ? "bg-warning/20 text-warning-text"
                                      : "bg-primary/20 text-primary-text"
                                  }`}
                                >
                                  {sec.method}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          </aside>

          {/* ══════════════════════════════════════════════
              RIGHT MAIN DOCUMENTATION BODY
              ══════════════════════════════════════════════ */}
          <main className="lg:col-span-8 space-y-8">
            <ScrollReveal animation="fade-up" delay={120} distance={35}>
              <article className="p-8 sm:p-10 rounded-3xl bg-surface border border-line shadow-sm">
                {/* Category pill */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary-text border border-line-strong">
                    {activeSection.category}
                  </span>
                  {activeSection.method && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-surface-hover border border-line text-fg-secondary">
                      {activeSection.method} {activeSection.endpoint}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-fg mb-3 tracking-tight">
                  {activeSection.title}
                </h2>
                <p className="text-sm sm:text-base text-fg-secondary leading-relaxed mb-6">
                  {activeSection.description}
                </p>

                {/* Prose Content */}
                <div className="text-xs sm:text-sm text-fg-secondary leading-relaxed space-y-3 mb-8 whitespace-pre-line border-t border-line pt-6">
                  {activeSection.content}
                </div>

                {/* Code Snippet Box */}
                {activeSection.codeSnippet && (
                  <div className="rounded-2xl border border-line-strong overflow-hidden bg-canvas shadow-xl">
                    <div className="px-4 py-2.5 bg-fg-muted/90 border-b border-line-strong flex items-center justify-between text-xs text-fg-secondary">
                      <span className="font-mono font-semibold text-primary-text">
                        {activeSection.codeSnippet.language}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(activeSection.codeSnippet.code, activeSection.id)
                        }
                        className="flex items-center gap-1.5 text-xs text-fg-secondary hover:text-primary-contrast transition-colors cursor-pointer"
                      >
                        {copiedId === activeSection.id ? (
                          <FiCheck className="w-3.5 h-3.5 text-success-text" />
                        ) : (
                          <FiCopy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === activeSection.id ? "Copied!" : "Copy Code"}</span>
                      </button>
                    </div>
                    <pre className="p-5 text-xs font-mono text-fg overflow-x-auto leading-relaxed">
                      <code>{activeSection.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </article>
            </ScrollReveal>

            {/* Quick API Explorer Box */}
            <ScrollReveal animation="fade-up" delay={200} distance={30}>
              <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-violet/10 to-brand-cyan/10 border border-line-strong flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-fg">
                    Ready to test with live requests?
                  </p>
                  <p className="text-xs text-fg-muted mt-0.5">
                    Launch the interactive chatbox or join the community discussion channel.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href="/chat"
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs font-semibold shadow-md transition-all"
                  >
                    Live Chatbox →
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </main>
        </div>
      </div>
    </PageLayout>
  );
};

export default Documentation;
