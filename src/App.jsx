import { useState, useEffect, useRef, useCallback } from "react";

// ── PORTFOLIO DATA ──────────────────────────────────────────────────────────
const PORTFOLIO = {
  name: "Alex Rivera",
  title: "Full Stack Developer & AI Engineer",
  tagline: "Building scalable systems at the intersection of code and intelligence.",
  location: "San Francisco, CA",
  email: "alex@alexrivera.dev",
  github: "github.com/alexrivera",
  twitter: "@alexrivera_dev",
  linkedin: "linkedin.com/in/alexrivera-dev",
  blog: "alexrivera.dev/blog",
  available: true,

  stats: [
    { value: "5+", label: "Years Experience" },
    { value: "3.2K", label: "GitHub Stars" },
    { value: "45K", label: "Monthly Readers" },
    { value: "12K+", label: "Active Users" },
  ],

  skills: {
    Frontend: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux", "React Query"],
    Backend: ["Node.js", "FastAPI", "Go", "GraphQL", "WebSockets", "Redis", "Celery"],
    "AI & ML": ["OpenAI GPT-4", "Google Gemini", "LangChain", "Pinecone", "HuggingFace", "LlamaIndex"],
    DevOps: ["Docker", "Kubernetes", "AWS", "GCP", "Terraform", "GitHub Actions", "Nginx"],
    Databases: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "ClickHouse"],
  },

  experience: [
    {
      role: "Senior Full Stack Engineer",
      company: "Veritas AI",
      period: "Jan 2023 – Present",
      type: "Remote, San Francisco",
      color: "#6ee7b7",
      highlights: [
        "Led team of 4 engineers building enterprise AI platform for legal document analysis",
        "Built RAG pipeline (LangChain + Pinecone) reducing search time by 78%",
        "Real-time collaboration for 500+ concurrent users via WebSockets + Redis",
        "Migrated monolith → microservices on GCP, cutting infra costs by 40%",
      ],
      stack: ["TypeScript", "React", "FastAPI", "PostgreSQL", "LangChain", "GCP"],
    },
    {
      role: "Full Stack Developer",
      company: "Novaflow",
      period: "Jul 2021 – Dec 2022",
      type: "San Francisco, CA",
      color: "#93c5fd",
      highlights: [
        "Built drag-and-drop workflow editor from scratch with custom canvas rendering",
        "Webhook management system handling 2M+ events/day with retry logic",
        "OAuth 2.0 integrations with Shopify, Amazon, and Stripe APIs",
        "Reduced frontend bundle size by 52% via code splitting and lazy loading",
      ],
      stack: ["React", "Node.js", "MongoDB", "Redis", "AWS", "Stripe"],
    },
    {
      role: "Junior Web Developer",
      company: "PixelCraft Agency",
      period: "Jun 2020 – Jun 2021",
      type: "Los Angeles, CA",
      color: "#f9a8d4",
      highlights: [
        "Delivered 12+ client projects across fashion, hospitality, entertainment",
        "Award-winning fashion brand site with GSAP and Three.js animations",
        "Built custom WordPress themes and Shopify storefronts",
        "Improved Lighthouse scores from avg 62 → 94 across all client sites",
      ],
      stack: ["React", "WordPress", "Shopify", "GSAP", "Three.js"],
    },
  ],

  projects: [
    {
      name: "DocuMind",
      tagline: "AI Document Intelligence Platform",
      desc: "Open-source platform to upload PDFs and chat with them. Multi-document comparison, citation tracking, and team collaboration. 3,200+ GitHub stars.",
      status: "Live · Open Source",
      link: "documind.app",
      stars: "3.2K ⭐",
      users: "800+ WAU",
      color: "#6ee7b7",
      gradient: "from-emerald-500/20 to-teal-500/10",
      stack: ["Next.js", "FastAPI", "OpenAI", "Pinecone", "Supabase"],
      icon: "📄",
    },
    {
      name: "StreamSync",
      tagline: "Real-Time Collaborative Code Editor",
      desc: "Browser-based collaborative editor with OT conflict resolution, 30+ languages, shared terminal sessions via xterm.js, and WebRTC voice chat.",
      status: "Live",
      link: "streamsync.dev",
      stars: "1.1K ⭐",
      users: "1K+ rooms/day",
      color: "#93c5fd",
      gradient: "from-blue-500/20 to-indigo-500/10",
      stack: ["React", "Go", "CodeMirror 6", "WebRTC", "Gemini API"],
      icon: "⚡",
    },
    {
      name: "PulseMetrics",
      tagline: "Privacy-First Developer Analytics",
      desc: "Cookieless analytics for indie devs. 5M+ events/day via ClickHouse, sub-100ms queries, GDPR/CCPA compliant. Auto-scaling on Kubernetes.",
      status: "Live · SaaS",
      link: "pulsemetrics.io",
      stars: "890 ⭐",
      users: "5M+ events/day",
      color: "#fbbf24",
      gradient: "from-amber-500/20 to-orange-500/10",
      stack: ["Next.js", "FastAPI", "ClickHouse", "Kubernetes", "Redis"],
      icon: "📊",
    },
    {
      name: "Threadly",
      tagline: "AI Twitter Thread Generator",
      desc: "Turn articles and ideas into viral thread formats using LangChain + GPT-4. 12,000+ users, $2,400 MRR, auto-scheduling via X API v2.",
      status: "Live · $2.4K MRR",
      link: "threadly.app",
      stars: "640 ⭐",
      users: "12K+ users",
      color: "#c084fc",
      gradient: "from-purple-500/20 to-violet-500/10",
      stack: ["React", "LangChain", "GPT-4", "X API v2", "Stripe"],
      icon: "🧵",
    },
    {
      name: "Nomad Lens",
      tagline: "Travel Photography Community",
      desc: "Niche social platform for travel photographers. Interactive map with 50K+ photo pins, EXIF data, AI tagging, and an integrated print store.",
      status: "Live",
      link: "nomadlens.co",
      stars: "420 ⭐",
      users: "50K+ photos",
      color: "#34d399",
      gradient: "from-green-500/20 to-emerald-500/10",
      stack: ["React", "Mapbox GL", "Node.js", "Google Vision", "Cloudinary"],
      icon: "🌍",
    },
  ],

  achievements: [
    { icon: "🏆", text: "Won HackSF 2022 — Best AI/ML Project" },
    { icon: "⭐", text: "3,200+ GitHub stars across personal projects" },
    { icon: "📝", text: "45,000+ monthly readers on dev.to & blog" },
    { icon: "🎙️", text: "Speaker at React Summit 2023" },
    { icon: "💼", text: "Angel investor in 2 dev-tools startups" },
    { icon: "🌍", text: "Open source maintainer (DocuMind + 3 libs)" },
  ],
};

const GEMINI_API_KEY = "AIzaSyCUTrvhnfmnHZxpq6d86-SS7xLX_Q0CTg4"; 

const SYSTEM_PROMPT = `You are Alex Rivera's friendly AI portfolio assistant. You know everything about Alex.

ABOUT ALEX:
- Full Stack Developer, 5+ years experience, based in San Francisco CA
- Specializes in React, Next.js, TypeScript, Python, FastAPI, Go, PostgreSQL
- AI/ML focus: LangChain, OpenAI GPT-4, Google Gemini, Pinecone, RAG pipelines

EXPERIENCE:
1. Senior Full Stack Engineer @ Veritas AI (Jan 2023–Present): Enterprise AI for legal docs, RAG pipeline cut search by 78%, led team of 4, GCP microservices cut costs 40%
2. Full Stack Developer @ Novaflow (Jul 2021–Dec 2022): Drag-and-drop workflow editor, 2M+ events/day webhooks, reduced bundle 52%
3. Junior Developer @ PixelCraft Agency (Jun 2020–Jun 2021): 12+ client projects, GSAP/Three.js award-winning site, Lighthouse 62→94

PROJECTS:
1. DocuMind (documind.app) - Open source AI PDF chat, RAG pipeline, 3.2K stars, 800+ weekly active users
2. StreamSync (streamsync.dev) - Collaborative code editor, OT algorithm, WebRTC voice, Go backend, Gemini AI completion
3. PulseMetrics (pulsemetrics.io) - Privacy-first analytics, 5M events/day via ClickHouse, Kubernetes
4. Threadly (threadly.app) - AI thread generator, 12K users, $2.4K MRR, LangChain + GPT-4
5. Nomad Lens (nomadlens.co) - Travel photo community, Mapbox, 50K+ photo pins

TECH STACK: React, Next.js, TypeScript, Python, FastAPI, Go, Node.js, PostgreSQL, Redis, Docker, Kubernetes, AWS, GCP, LangChain, OpenAI, Gemini, Pinecone

EDUCATION: B.S. CS, UC Davis, GPA 3.8 (2016-2020)
CERTS: AWS Solutions Architect, Google Cloud Developer, CKAD (Kubernetes)
CONTACT: alex@alexrivera.dev | github.com/alexrivera | @alexrivera_dev
AVAILABLE: Yes, open to senior/staff roles, consulting, remote worldwide

RESPONSE RULES:
- Be friendly, concise, and helpful
- Use bullet points and markdown for clarity
- After your answer, ALWAYS add exactly this format on a new line: SUGGEST:["question1","question2","question3"]
- Make suggestions contextually relevant to what was just asked
- Don't make up info not listed above`;

async function callGemini(userMessage, history) {
  const contents = [];
  
  const recentHistory = history.slice(-6);
  for (const msg of recentHistory) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    });
  }
  const messageWithContext = contents.length === 0
    ? `${SYSTEM_PROMPT}\n\nUser question: ${userMessage}`
    : `${SYSTEM_PROMPT}\n\nUser question: ${userMessage}`;

  contents.push({ role: "user", parts: [{ text: messageWithContext }] });

  // 🔴 UPDATED: Switched model to gemini-2.5-flash-lite
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Gemini API error");
  }

  const data = await response.json();
  const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Parse suggestions
  let mainText = fullText;
  let suggestions = ["What tech does Alex use?", "Tell me about DocuMind", "What's Alex's experience?"];
  
  // UPDATED: Matches "SUGGEST:", "SUGGESTED:", or "SUGGESTIONS:" (case-insensitive)
  const suggestMatch = fullText.match(/(?:SUGGEST|SUGGESTED|SUGGESTIONS):\s*(\[.*?\])/is);
  
  if (suggestMatch) {
    // 1. Remove the raw text from the visible chat bubble
    mainText = fullText.replace(/(?:SUGGEST|SUGGESTED|SUGGESTIONS):\s*\[.*?\]/is, "").trim();
    
    // 2. Parse the array and inject them into your clickable UI buttons
    try {
      const parsed = JSON.parse(suggestMatch[1]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        suggestions = parsed;
      }
    } catch (e) {
      console.warn("Could not parse AI suggestions, falling back to defaults.", e);
    }
  }

  return { message: mainText, suggestions: suggestions.slice(0, 3) };
}

// ── ICONS ──────────────────────────────────────────────────────────────────
const Icons = {
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Bot: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Github: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Twitter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
  Arrow: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  MapPin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

// ── MARKDOWN RENDERER ──────────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} style={{ color: "#6ee7b7", fontWeight: 700, margin: "10px 0 4px", fontSize: "14px" }}>{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} style={{ color: "#6ee7b7", fontWeight: 700, margin: "12px 0 4px", fontSize: "15px" }}>{line.slice(3)}</h2>);
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("• "))) {
        items.push(<li key={i} style={{ marginBottom: "3px" }}>{formatInline(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: "18px", margin: "6px 0", listStyle: "disc" }}>{items}</ul>);
      continue;
    } else if (line.trim() === "") {
      elements.push(<br key={i} />);
    } else if (line.match(/^\d+\./)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\./)) {
        const content = lines[i].replace(/^\d+\.\s*/, "");
        items.push(<li key={i} style={{ marginBottom: "3px" }}>{formatInline(content)}</li>);
        i++;
      }
      elements.push(<ol key={`ol-${i}`} style={{ paddingLeft: "18px", margin: "6px 0" }}>{items}</ol>);
      continue;
    } else {
      elements.push(<p key={i} style={{ margin: "4px 0", lineHeight: "1.6" }}>{formatInline(line)}</p>);
    }
    i++;
  }

  return elements;
}

function formatInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\`[^`]+\`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "#a7f3d0", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} style={{ background: "rgba(110, 231, 183, 0.15)", color: "#6ee7b7", padding: "1px 5px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace" }}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

// ── TYPING INDICATOR ──────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: "#6ee7b7", opacity: 0.7,
          animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── CHATBOT COMPONENT ──────────────────────────────────────────────────────
function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey there! 👋 I'm Alex's AI assistant. Ask me anything about his projects, tech stack, experience, or how to get in touch!",
      suggestions: ["What projects has Alex built?", "What's Alex's tech stack?", "Tell me about his AI experience"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const result = await callGemini(msg, history);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: result.message,
        suggestions: result.suggestions,
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "⚠️ Couldn't connect to Gemini API. Make sure to replace `GEMINI_API_KEY` with your real Google Gemini API key (free at aistudio.google.com).",
        suggestions: ["What is Alex's tech stack?", "Tell me about DocuMind", "What's Alex's experience?"],
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, messages]);

  return (
    <div style={{
      position: "fixed", bottom: "90px", right: "24px", zIndex: 1000,
      width: "min(420px, calc(100vw - 32px))", height: "min(600px, calc(100vh - 120px))",
      background: "linear-gradient(135deg, #0f1923 0%, #0a1628 100%)",
      border: "1px solid rgba(110, 231, 183, 0.25)",
      borderRadius: "20px", display: "flex", flexDirection: "column",
      boxShadow: "0 0 60px rgba(110, 231, 183, 0.1), 0 25px 50px rgba(0,0,0,0.6)",
      overflow: "hidden",
      animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid rgba(110, 231, 183, 0.15)",
        background: "rgba(110, 231, 183, 0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
          }}>🤖</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px", fontFamily: "'Space Grotesk', sans-serif" }}>
              Alex's AI Assistant
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6ee7b7", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600 }}>Online · Powered by Gemini</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer",
          color: "#9ca3af", width: "30px", height: "30px", borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#ef4444"; }}
           onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#9ca3af"; }}>
          <Icons.X />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <div style={{
              display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              gap: "10px", alignItems: "flex-start",
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: "85%",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%)"
                  : "rgba(255,255,255,0.06)",
                color: msg.role === "user" ? "#0a1628" : "#e5e7eb",
                padding: "10px 14px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                fontSize: "13.5px", lineHeight: "1.6",
                border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}>
                {msg.role === "user" ? msg.content : renderMarkdown(msg.content)}
              </div>
            </div>

            {/* Suggestions */}
            {msg.role === "assistant" && msg.suggestions && idx === messages.length - 1 && (
              <div style={{ marginTop: "10px", paddingLeft: "38px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {msg.suggestions.map((s, si) => (
                  <button key={si} onClick={() => sendMessage(s)} style={{
                    background: "rgba(110, 231, 183, 0.08)", border: "1px solid rgba(110, 231, 183, 0.25)",
                    color: "#6ee7b7", padding: "5px 10px", borderRadius: "20px",
                    fontSize: "11.5px", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(110, 231, 183, 0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(110, 231, 183, 0.08)"; }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
            }}>🤖</div>
            <div style={{
              background: "rgba(255,255,255,0.06)", padding: "12px 16px", borderRadius: "4px 16px 16px 16px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about Alex's projects, skills…"
            disabled={loading}
            style={{
              flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px", padding: "10px 14px", color: "#fff", fontSize: "13.5px",
              fontFamily: "inherit", outline: "none", transition: "border 0.2s",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "rgba(110, 231, 183, 0.5)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width: "40px", height: "40px", borderRadius: "12px", border: "none", cursor: "pointer",
            background: input.trim() && !loading ? "linear-gradient(135deg, #6ee7b7, #3b82f6)" : "rgba(255,255,255,0.1)",
            color: input.trim() && !loading ? "#0a1628" : "#6b7280",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s", flexShrink: 0,
          }}>
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [activeSkillTab, setActiveSkillTab] = useState("Frontend");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["hero", "about", "experience", "projects", "contact"];
      for (const s of sections.reverse()) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(s);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = ["About", "Experience", "Projects", "Contact"];

  return (
    <div style={{
      background: "#050d18",
      color: "#e5e7eb",
      minHeight: "100vh",
      fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #050d18; }
        ::-webkit-scrollbar-thumb { background: rgba(110, 231, 183, 0.3); border-radius: 3px; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(110, 231, 183, 0.2); }
          50% { box-shadow: 0 0 40px rgba(110, 231, 183, 0.5); }
        }
        @keyframes orb {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, -60px) scale(1.1); }
          66% { transform: translate(-40px, 40px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .nav-link { transition: color 0.2s; cursor: pointer; }
        .nav-link:hover { color: #6ee7b7 !important; }
        .tag { transition: all 0.2s; }
        .tag:hover { background: rgba(110,231,183,0.2) !important; color: #6ee7b7 !important; }
        .btn-primary { transition: all 0.25s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(110,231,183,0.35) !important; }
        .btn-outline { transition: all 0.25s; }
        .btn-outline:hover { background: rgba(110,231,183,0.1) !important; transform: translateY(-2px); }
        .project-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .project-card:hover { transform: translateY(-6px); }
        .exp-card { transition: all 0.3s; }
        .exp-card:hover { border-color: rgba(110,231,183,0.4) !important; }
        .social-btn { transition: all 0.2s; }
        .social-btn:hover { transform: translateY(-3px); border-color: rgba(110,231,183,0.5) !important; color: #6ee7b7 !important; }
        .skill-tag { transition: all 0.2s; }
        .skill-tag:hover { background: rgba(110,231,183,0.2) !important; transform: translateY(-1px); }
      `}</style>

      {/* Background Orbs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-10%", width: "600px", height: "600px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(110,231,183,0.08) 0%, transparent 70%)",
          animation: "orb 20s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "-15%", width: "500px", height: "500px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
          animation: "orb 25s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "50%", width: "400px", height: "400px",
          borderRadius: "50%", background: "radial-gradient(circle, rgba(192,132,252,0.05) 0%, transparent 70%)",
          animation: "orb 18s ease-in-out infinite 5s",
        }} />
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(110,231,183,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,183,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5%",
        background: scrolled ? "rgba(5, 13, 24, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(110,231,183,0.1)" : "none",
        transition: "all 0.4s",
        height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px",
          color: "#fff", letterSpacing: "-0.5px", cursor: "pointer",
        }} onClick={() => scrollTo("hero")}>
          Alex<span style={{ color: "#6ee7b7" }}>.</span>Rivera
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {navItems.map((item) => (
            <button key={item} className="nav-link" onClick={() => scrollTo(item.toLowerCase())} style={{
              background: "none", border: "none", cursor: "pointer",
              color: activeSection === item.toLowerCase() ? "#6ee7b7" : "#9ca3af",
              fontWeight: activeSection === item.toLowerCase() ? 600 : 400,
              fontSize: "14px", padding: "8px 16px", fontFamily: "inherit",
              borderRadius: "8px",
            }}>
              {item}
            </button>
          ))}
          <button className="btn-primary" onClick={() => setChatOpen(true)} style={{
            background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
            border: "none", borderRadius: "10px", padding: "8px 18px",
            color: "#0a1628", fontWeight: 700, fontSize: "13px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px", fontFamily: "inherit",
          }}>
            <Icons.Sparkle /> Chat with AI
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{
        position: "relative", zIndex: 1, minHeight: "100vh",
        display: "flex", alignItems: "center", padding: "120px 8% 80px",
      }}>
        <div style={{ maxWidth: "900px", animation: "fadeInUp 0.8s ease forwards" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(110, 231, 183, 0.1)", border: "1px solid rgba(110,231,183,0.3)",
            borderRadius: "20px", padding: "6px 16px", marginBottom: "28px",
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6ee7b7", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#6ee7b7", fontSize: "13px", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
              Available for opportunities
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(52px, 7vw, 88px)",
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: "-2px", marginBottom: "20px", color: "#fff",
          }}>
            {PORTFOLIO.name.split(" ").map((word, i) => (
              <span key={i} style={{ display: "block" }}>
                {i === 1 ? (
                  <span style={{
                    background: "linear-gradient(135deg, #6ee7b7 0%, #3b82f6 50%, #c084fc 100%)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "gradientShift 4s ease infinite",
                  }}>{word}</span>
                ) : word}
              </span>
            ))}
          </h1>

          <p style={{ fontSize: "20px", color: "#6ee7b7", fontWeight: 500, marginBottom: "14px", fontFamily: "'Space Grotesk', sans-serif" }}>
            {PORTFOLIO.title}
          </p>

          <p style={{ fontSize: "18px", color: "#9ca3af", lineHeight: 1.7, maxWidth: "600px", marginBottom: "36px" }}>
            {PORTFOLIO.tagline}
          </p>

          {/* Location */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "14px", marginBottom: "36px" }}>
            <Icons.MapPin /> {PORTFOLIO.location}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "64px" }}>
            <button className="btn-primary" onClick={() => setChatOpen(true)} style={{
              background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
              border: "none", borderRadius: "14px", padding: "14px 28px",
              color: "#0a1628", fontWeight: 700, fontSize: "15px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px", fontFamily: "inherit",
              boxShadow: "0 4px 20px rgba(110,231,183,0.25)",
            }}>
              <Icons.Sparkle /> Ask My AI Assistant
            </button>
            <button className="btn-outline" onClick={() => scrollTo("projects")} style={{
              background: "transparent", border: "1px solid rgba(110,231,183,0.35)",
              borderRadius: "14px", padding: "14px 28px", color: "#fff",
              fontWeight: 600, fontSize: "15px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px", fontFamily: "inherit",
            }}>
              View Projects <Icons.Arrow />
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
            {PORTFOLIO.stats.map((s) => (
              <div key={s.label}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: "32px", fontWeight: 700,
                  color: "#fff", letterSpacing: "-1px",
                }}>{s.value}</div>
                <div style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          animation: "float 3s ease-in-out infinite", cursor: "pointer", color: "#4b5563",
        }} onClick={() => scrollTo("about")}>
          <span style={{ fontSize: "12px" }}>Scroll</span>
          <Icons.ChevronDown />
        </div>
      </section>

      {/* ── ABOUT / SKILLS ── */}
      <section id="about" style={{ position: "relative", zIndex: 1, padding: "100px 8%", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionLabel>About</SectionLabel>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 4vw, 52px)",
          fontWeight: 700, color: "#fff", letterSpacing: "-1.5px", marginBottom: "20px",
        }}>
          The Stack Behind the Stories
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "17px", lineHeight: 1.8, maxWidth: "680px", marginBottom: "60px" }}>
          I'm a builder obsessed with developer experience, system reliability, and AI-augmented products. 
          Whether architecting microservices on GCP or crafting pixel-perfect React UIs, I care about every layer of the stack.
        </p>

        {/* Skill Tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {Object.keys(PORTFOLIO.skills).map((cat) => (
            <button key={cat} onClick={() => setActiveSkillTab(cat)} style={{
              background: activeSkillTab === cat ? "linear-gradient(135deg, #6ee7b7, #3b82f6)" : "rgba(255,255,255,0.06)",
              border: "1px solid " + (activeSkillTab === cat ? "transparent" : "rgba(255,255,255,0.1)"),
              color: activeSkillTab === cat ? "#0a1628" : "#9ca3af",
              padding: "8px 18px", borderRadius: "10px", fontSize: "13px",
              fontWeight: activeSkillTab === cat ? 700 : 400, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s",
            }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", minHeight: "60px" }}>
          {PORTFOLIO.skills[activeSkillTab].map((skill) => (
            <span key={skill} className="skill-tag" style={{
              background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)",
              color: "#a7f3d0", padding: "8px 16px", borderRadius: "10px",
              fontSize: "13.5px", fontFamily: "'JetBrains Mono', monospace", cursor: "default",
              animation: "fadeInUp 0.3s ease forwards",
            }}>{skill}</span>
          ))}
        </div>

        {/* Achievements */}
        <div style={{ marginTop: "70px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {PORTFOLIO.achievements.map((a) => (
            <div key={a.text} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px", padding: "16px 20px",
              display: "flex", alignItems: "center", gap: "14px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(110,231,183,0.3)"; e.currentTarget.style.background = "rgba(110,231,183,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
              <span style={{ fontSize: "22px" }}>{a.icon}</span>
              <span style={{ color: "#d1d5db", fontSize: "13.5px" }}>{a.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ position: "relative", zIndex: 1, padding: "100px 8%", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionLabel>Experience</SectionLabel>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 4vw, 52px)",
          fontWeight: 700, color: "#fff", letterSpacing: "-1.5px", marginBottom: "56px",
        }}>
          Where I've Built Things
        </h2>

        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div style={{
            position: "absolute", left: "19px", top: "24px", bottom: "24px", width: "1px",
            background: "linear-gradient(to bottom, rgba(110,231,183,0.6), rgba(59,130,246,0.3), transparent)",
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {PORTFOLIO.experience.map((exp, i) => (
              <div key={exp.company} className="exp-card" style={{
                marginLeft: "48px", position: "relative",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px", padding: "28px 32px",
                borderLeft: `3px solid ${exp.color}`,
              }}>
                {/* Timeline dot */}
                <div style={{
                  position: "absolute", left: "-40px", top: "28px",
                  width: "12px", height: "12px", borderRadius: "50%",
                  background: exp.color, border: "2px solid #050d18",
                  boxShadow: `0 0 12px ${exp.color}60`,
                }} />

                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
                      {exp.role}
                    </h3>
                    <div style={{ color: exp.color, fontWeight: 600, fontSize: "15px" }}>{exp.company}</div>
                    <div style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>{exp.type}</div>
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px", padding: "6px 14px", height: "fit-content",
                    fontSize: "13px", color: "#9ca3af", fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: "nowrap",
                  }}>
                    {exp.period}
                  </div>
                </div>

                <ul style={{ paddingLeft: "18px", marginBottom: "20px" }}>
                  {exp.highlights.map((h) => (
                    <li key={h} style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.7", marginBottom: "6px" }}>
                      {h}
                    </li>
                  ))}
                </ul>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {exp.stack.map((s) => (
                    <span key={s} style={{
                      background: `${exp.color}15`, border: `1px solid ${exp.color}35`,
                      color: exp.color, padding: "4px 10px", borderRadius: "6px",
                      fontSize: "12px", fontFamily: "'JetBrains Mono', monospace",
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ position: "relative", zIndex: 1, padding: "100px 8%", maxWidth: "1400px", margin: "0 auto" }}>
        <SectionLabel>Projects</SectionLabel>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 4vw, 52px)",
          fontWeight: 700, color: "#fff", letterSpacing: "-1.5px", marginBottom: "56px",
        }}>
          Things I've Shipped
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
          {PORTFOLIO.projects.map((project, i) => (
            <div key={project.name} className="project-card" style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${hoveredProject === i ? project.color + "50" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "20px", padding: "28px",
              cursor: "pointer", position: "relative", overflow: "hidden",
            }}
            onMouseEnter={() => setHoveredProject(i)}
            onMouseLeave={() => setHoveredProject(null)}>
              {/* Gradient bg */}
              <div style={{
                position: "absolute", inset: 0, opacity: hoveredProject === i ? 1 : 0,
                background: `radial-gradient(circle at top right, ${project.color}12, transparent 60%)`,
                transition: "opacity 0.3s",
              }} />

              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <span style={{ fontSize: "32px" }}>{project.icon}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ background: `${project.color}20`, color: project.color, padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>
                      {project.stars}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
                  {project.name}
                </h3>
                <div style={{ color: project.color, fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>
                  {project.tagline}
                </div>
                <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>
                  {project.desc}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                  {project.stack.map((s) => (
                    <span key={s} style={{
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "#d1d5db", padding: "4px 10px", borderRadius: "6px",
                      fontSize: "11.5px", fontFamily: "'JetBrains Mono', monospace",
                    }}>{s}</span>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ background: `${project.color}15`, color: project.color, padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>
                    {project.status}
                  </span>
                  <div style={{ color: "#6b7280", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Icons.Arrow />
                    <span>{project.link}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ position: "relative", zIndex: 1, padding: "100px 8% 140px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <SectionLabel center>Contact</SectionLabel>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 4vw, 52px)",
          fontWeight: 700, color: "#fff", letterSpacing: "-1.5px", marginBottom: "20px",
        }}>
          Let's Build Something
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "17px", lineHeight: 1.8, marginBottom: "48px" }}>
          Open to senior/staff engineering roles, technical consulting, and interesting open source collaborations. 
          Don't hesitate to reach out — or just chat with my AI assistant!
        </p>

        {/* Social Links */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "40px" }}>
          {[
            { icon: <Icons.Mail />, label: "Email", value: PORTFOLIO.email },
            { icon: <Icons.Github />, label: "GitHub", value: PORTFOLIO.github },
            { icon: <Icons.Twitter />, label: "Twitter", value: PORTFOLIO.twitter },
          ].map((link) => (
            <a key={link.label} href={link.label === "Email" ? `mailto:${link.value}` : `https://${link.value}`}
               target="_blank" rel="noopener noreferrer" className="social-btn" style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px", padding: "14px 22px", color: "#9ca3af",
              textDecoration: "none", fontSize: "14px", fontWeight: 500,
            }}>
              {link.icon} {link.value}
            </a>
          ))}
        </div>

        {/* AI CTA */}
        <div style={{
          background: "linear-gradient(135deg, rgba(110,231,183,0.08), rgba(59,130,246,0.08))",
          border: "1px solid rgba(110,231,183,0.2)", borderRadius: "20px", padding: "36px",
          animation: "glow 3s ease-in-out infinite",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "14px" }}>🤖</div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#fff", fontWeight: 700, fontSize: "22px", marginBottom: "10px" }}>
            Have Questions? Just Ask!
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "15px", marginBottom: "24px", lineHeight: 1.7 }}>
            My AI assistant knows everything about my projects, tech stack, and experience. 
            Ask it anything — it's powered by Google Gemini.
          </p>
          <button className="btn-primary" onClick={() => setChatOpen(true)} style={{
            background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
            border: "none", borderRadius: "12px", padding: "14px 32px",
            color: "#0a1628", fontWeight: 700, fontSize: "15px", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(110,231,183,0.25)",
          }}>
            <Icons.Sparkle /> Open AI Chat
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: "relative", zIndex: 1, textAlign: "center",
        padding: "24px", borderTop: "1px solid rgba(255,255,255,0.06)",
        color: "#4b5563", fontSize: "13px",
      }}>
        Built with React & Tailwind · AI by Google Gemini · © 2024 Alex Rivera
      </footer>

      {/* CHAT TOGGLE BUTTON */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 999,
          width: "60px", height: "60px", borderRadius: "50%", border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
          boxShadow: "0 4px 20px rgba(110,231,183,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px", transition: "all 0.25s", animation: "glow 3s ease infinite",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
          🤖
        </button>
      )}

      {/* CHATBOT */}
      {chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
    </div>
  );
}

// Section Label component
function SectionLabel({ children, center }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)",
      borderRadius: "20px", padding: "5px 14px", marginBottom: "20px",
      ...(center ? { display: "flex", justifyContent: "center" } : {}),
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6ee7b7" }} />
      <span style={{ color: "#6ee7b7", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
        {children}
      </span>
    </div>
  );
}
