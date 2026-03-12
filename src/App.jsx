import { useState, useEffect, useRef, useCallback } from "react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


const DATA = {
  name: "Alex Rivera",
  title: "Full Stack Developer & AI Engineer",
  tagline: "Building scalable systems at the intersection of code and intelligence.",
  location: "San Francisco, CA",
  email: "alex@alexrivera.dev",
  github: "github.com/alexrivera",
  twitter: "@alexrivera_dev",
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
      id: "exp-veritas",
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
      id: "exp-novaflow",
      role: "Full Stack Developer",
      company: "Novaflow",
      period: "Jul 2021 – Dec 2022",
      type: "San Francisco, CA",
      color: "#93c5fd",
      highlights: [
        "Built drag-and-drop workflow editor with custom canvas rendering",
        "Webhook management system handling 2M+ events/day",
        "OAuth 2.0 integrations with Shopify, Amazon, and Stripe APIs",
        "Reduced frontend bundle size by 52% via code splitting",
      ],
      stack: ["React", "Node.js", "MongoDB", "Redis", "AWS", "Stripe"],
    },
    {
      id: "exp-pixelcraft",
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
      id: "project-documind",
      name: "DocuMind",
      tagline: "AI Document Intelligence Platform",
      desc: "Open-source platform to upload PDFs and chat with them. Multi-document comparison, citation tracking, and team collaboration. 3,200+ GitHub stars.",
      status: "Live · Open Source",
      stars: "3.2K ⭐",
      color: "#6ee7b7",
      stack: ["Next.js", "FastAPI", "OpenAI", "Pinecone", "Supabase"],
      icon: "📄",
    },
    {
      id: "project-streamsync",
      name: "StreamSync",
      tagline: "Real-Time Collaborative Code Editor",
      desc: "Browser-based collaborative editor with OT conflict resolution, 30+ languages, shared terminal sessions, and WebRTC voice chat.",
      status: "Live",
      stars: "1.1K ⭐",
      color: "#93c5fd",
      stack: ["React", "Go", "CodeMirror 6", "WebRTC", "Gemini API"],
      icon: "⚡",
    },
    {
      id: "project-pulsemetrics",
      name: "PulseMetrics",
      tagline: "Privacy-First Developer Analytics",
      desc: "Cookieless analytics for indie devs. 5M+ events/day via ClickHouse, sub-100ms queries, GDPR/CCPA compliant.",
      status: "Live · SaaS",
      stars: "890 ⭐",
      color: "#fbbf24",
      stack: ["Next.js", "FastAPI", "ClickHouse", "Kubernetes", "Redis"],
      icon: "📊",
    },
    {
      id: "project-threadly",
      name: "Threadly",
      tagline: "AI Twitter Thread Generator",
      desc: "Turn articles into viral thread formats using LangChain + GPT-4. 12,000+ users, $2,400 MRR, auto-scheduling via X API v2.",
      status: "Live · $2.4K MRR",
      stars: "640 ⭐",
      color: "#c084fc",
      stack: ["React", "LangChain", "GPT-4", "X API v2", "Stripe"],
      icon: "🧵",
    },
    {
      id: "project-nomadlens",
      name: "Nomad Lens",
      tagline: "Travel Photography Community",
      desc: "Niche social platform for travel photographers. Interactive map with 50K+ photo pins, AI tagging, and an integrated print store.",
      status: "Live",
      stars: "420 ⭐",
      color: "#34d399",
      stack: ["React", "Mapbox GL", "Node.js", "Google Vision", "Cloudinary"],
      icon: "🌍",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TOOL DEFINITIONS — passed to Gemini so it knows what tools exist
// ─────────────────────────────────────────────────────────────────────────────
const TOOL_DEFINITIONS = `
You have access to these DOM tools to interact with the portfolio website.
When you want to use a tool, output EXACTLY this format (nothing else on that line):
TOOL_CALL:{"tool":"<name>","params":{...}}

Available tools:

1. highlight_tool
   Highlights an element with a glowing border.
   Params: { "selector": "<css-selector>", "label": "<optional label text>" }
   Example: TOOL_CALL:{"tool":"highlight_tool","params":{"selector":"#projects","label":"Projects Section"}}

2. scroll_tool
   Smoothly scrolls to an element.
   Params: { "selector": "<css-selector>" }
   Example: TOOL_CALL:{"tool":"scroll_tool","params":{"selector":"#experience"}}

3. click_tool
   Clicks a button or link element.
   Params: { "selector": "<css-selector>", "confirm": true/false }
   Set confirm:true for destructive/navigating actions to ask user permission first.
   Example: TOOL_CALL:{"tool":"click_tool","params":{"selector":"#chat-toggle-btn","confirm":false}}

4. type_tool
   Types text into an input field.
   Params: { "selector": "<css-selector>", "text": "<text to type>", "confirm": true/false }
   Always set confirm:true when typing into inputs.
   Example: TOOL_CALL:{"tool":"type_tool","params":{"selector":"#contact-email","text":"hello@example.com","confirm":true}}

5. remove_highlight_tool
   Removes all active highlights.
   Params: {}
   Example: TOOL_CALL:{"tool":"remove_highlight_tool","params":{}}

PAGE SECTIONS AND THEIR SELECTORS:
- Hero/intro section: #hero
- About/skills section: #about
- Experience section: #experience
- Projects section: #projects
- Contact section: #contact
- Navigation bar: nav
- Individual project cards: #project-documind, #project-streamsync, #project-pulsemetrics, #project-threadly, #project-nomadlens
- Experience cards: #exp-veritas, #exp-novaflow, #exp-pixelcraft
- Stats row: #stats-row
- Skills tabs: #skills-tabs
- Contact email link: #contact-email-link
- GitHub link: #contact-github-link
- AI chat open button: #chat-toggle-btn

IMPORTANT RULES:
- Always scroll to a section before highlighting something inside it
- Use confirm:true for click and type actions
- You can chain multiple tool calls — output one per line
- After tool calls, continue with your text explanation
- Keep explanations friendly and concise
`;

const SYSTEM_PROMPT = `You are Alex Rivera's AI co-browsing assistant embedded in his portfolio website.
You can both ANSWER questions AND CONTROL the website using tool calls.

${TOOL_DEFINITIONS}

ABOUT ALEX:
- Full Stack Developer, 5+ years, San Francisco CA
- Senior Engineer @ Veritas AI (Jan 2023–Present): AI legal platform, RAG pipeline, 500+ concurrent users
- Full Stack Dev @ Novaflow (Jul 2021–Dec 2022): Workflow editor, 2M+ events/day
- Junior Dev @ PixelCraft Agency (Jun 2020–Jun 2021): 12+ client projects
- Projects: DocuMind (3.2K stars), StreamSync, PulseMetrics, Threadly ($2.4K MRR), Nomad Lens
- Stack: React, Next.js, TypeScript, Python, FastAPI, Go, PostgreSQL, Redis, Docker, K8s, AWS, GCP, LangChain, OpenAI, Gemini, Pinecone
- Education: B.S. CS, UC Davis, GPA 3.8
- Contact: alex@alexrivera.dev | github.com/alexrivera | @alexrivera_dev

BEHAVIOR:
- When asked to "show", "highlight", "navigate to", "scroll to", or "find" something → use tools
- When asked questions → answer AND use tools to visually point to relevant sections
- Be friendly, precise, and proactive
- After every response add: SUGGEST:["q1","q2","q3"]`;

// ─────────────────────────────────────────────────────────────────────────────
// TOOL EXECUTOR
// ─────────────────────────────────────────────────────────────────────────────
function executeHighlight(selector, label) {
  try {
    // Remove old highlights first
    document.querySelectorAll(".__ai-highlight").forEach((el) => {
      el.classList.remove("__ai-highlight");
      const old = el.querySelector(".__ai-highlight-label");
      if (old) old.remove();
    });

    const el = document.querySelector(selector);
    if (!el) return { success: false, error: `No element found for selector: ${selector}` };

    el.classList.add("__ai-highlight");
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    if (label) {
      const badge = document.createElement("div");
      badge.className = "__ai-highlight-label";
      badge.textContent = "🤖 " + label;
      badge.style.cssText = `
        position:absolute; top:-32px; left:0; background:linear-gradient(135deg,#6ee7b7,#3b82f6);
        color:#050d18; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700;
        white-space:nowrap; z-index:99999; pointer-events:none; font-family:sans-serif;
        box-shadow:0 4px 12px rgba(110,231,183,0.4);
      `;
      const pos = getComputedStyle(el).position;
      if (pos === "static") el.style.position = "relative";
      el.appendChild(badge);
    }
    return { success: true, message: `Highlighted: ${selector}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function executeScroll(selector) {
  try {
    const el = document.querySelector(selector);
    if (!el) return { success: false, error: `No element: ${selector}` };
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return { success: true, message: `Scrolled to: ${selector}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function executeClick(selector) {
  try {
    const el = document.querySelector(selector);
    if (!el) return { success: false, error: `No element: ${selector}` };
    el.click();
    return { success: true, message: `Clicked: ${selector}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function executeType(selector, text) {
  try {
    const el = document.querySelector(selector);
    if (!el) return { success: false, error: `No element: ${selector}` };
    el.focus();
    el.value = text;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return { success: true, message: `Typed "${text}" into ${selector}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function executeRemoveHighlight() {
  document.querySelectorAll(".__ai-highlight").forEach((el) => {
    el.classList.remove("__ai-highlight");
    el.querySelectorAll(".__ai-highlight-label").forEach((b) => b.remove());
  });
  return { success: true, message: "Removed all highlights" };
}

// ─────────────────────────────────────────────────────────────────────────────
// PARSE TOOL CALLS FROM AI RESPONSE
// ─────────────────────────────────────────────────────────────────────────────
function parseToolCalls(text) {
  const toolCalls = [];
  const lines = text.split("\n");
  const cleanLines = [];

  for (const line of lines) {
    const match = line.trim().match(/^TOOL_CALL:(\{.+\})$/);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        toolCalls.push(parsed);
      } catch (_) {}
    } else {
      cleanLines.push(line);
    }
  }

  // Remove SUGGEST line from display text
  const cleanText = cleanLines
    .join("\n")
    .replace(/SUGGEST:\[.*?\]/g, "")
    .trim();

  // Extract suggestions
  let suggestions = ["What projects has Alex built?", "What's Alex's tech stack?", "Scroll to experience"];
  const suggestMatch = text.match(/SUGGEST:\[([^\]]+)\]/);
  if (suggestMatch) {
    try { suggestions = JSON.parse(`[${suggestMatch[1]}]`); } catch (_) {}
  }

  return { toolCalls, cleanText, suggestions };
}

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI API CALL
// ─────────────────────────────────────────────────────────────────────────────
async function callGemini(userMessage, history) {
  const contents = [];
  const recent = history.slice(-8);

  for (const msg of recent) {
    contents.push({ role: msg.role === "user" ? "user" : "model", parts: [{ text: msg.content }] });
  }

  const prompt = contents.length === 0
    ? `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`
    : `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`;

  contents.push({ role: "user", parts: [{ text: prompt }] });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Gemini API error");
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN RENDERER
// ─────────────────────────────────────────────────────────────────────────────
function Md({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l.startsWith("### ")) {
      out.push(<div key={i} style={{ color: "#6ee7b7", fontWeight: 700, margin: "10px 0 4px", fontSize: "13px" }}>{l.slice(4)}</div>);
    } else if (l.startsWith("## ")) {
      out.push(<div key={i} style={{ color: "#a7f3d0", fontWeight: 700, margin: "12px 0 4px", fontSize: "14px" }}>{l.slice(3)}</div>);
    } else if (l.startsWith("- ") || l.startsWith("• ")) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("• "))) {
        items.push(<li key={i} style={{ marginBottom: "3px" }}>{fmt(lines[i].slice(2))}</li>);
        i++;
      }
      out.push(<ul key={`u${i}`} style={{ paddingLeft: "16px", margin: "5px 0", listStyle: "disc" }}>{items}</ul>);
      continue;
    } else if (l.trim() === "") {
      out.push(<br key={i} />);
    } else {
      out.push(<div key={i} style={{ margin: "3px 0", lineHeight: "1.65" }}>{fmt(l)}</div>);
    }
    i++;
  }
  return <>{out}</>;
}

function fmt(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\`[^`]+\`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i} style={{ color: "#a7f3d0", fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))
      return <code key={i} style={{ background: "rgba(110,231,183,0.15)", color: "#6ee7b7", padding: "1px 6px", borderRadius: "4px", fontSize: "12px", fontFamily: "monospace" }}>{p.slice(1, -1)}</code>;
    return p;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL LOG ENTRY
// ─────────────────────────────────────────────────────────────────────────────
function ToolLog({ entry }) {
  const colors = { executing: "#fbbf24", success: "#6ee7b7", error: "#f87171", pending: "#93c5fd" };
  const icons = { executing: "⚙️", success: "✅", error: "❌", pending: "⏳" };
  return (
    <div style={{
      background: "rgba(0,0,0,0.4)", border: `1px solid ${colors[entry.status]}30`,
      borderLeft: `3px solid ${colors[entry.status]}`,
      borderRadius: "8px", padding: "8px 12px", fontSize: "11px",
      fontFamily: "monospace", marginBottom: "6px",
    }}>
      <div style={{ color: colors[entry.status], fontWeight: 700, marginBottom: "3px" }}>
        {icons[entry.status]} {entry.tool}
      </div>
      {entry.params && (
        <div style={{ color: "#6b7280", fontSize: "10px" }}>
          {Object.entries(entry.params).map(([k, v]) => (
            <span key={k} style={{ marginRight: "10px" }}>
              <span style={{ color: "#9ca3af" }}>{k}:</span>{" "}
              <span style={{ color: "#e5e7eb" }}>{String(v)}</span>
            </span>
          ))}
        </div>
      )}
      {entry.result && (
        <div style={{ color: entry.status === "error" ? "#f87171" : "#6b7280", marginTop: "3px", fontSize: "10px" }}>
          {entry.result}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PERMISSION MODAL
// ─────────────────────────────────────────────────────────────────────────────
function PermissionModal({ action, onApprove, onDeny }) {
  const desc = {
    click_tool: `Click on: ${action.params?.selector}`,
    type_tool: `Type "${action.params?.text}" into: ${action.params?.selector}`,
  };
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0f1923, #0a1628)",
        border: "1px solid rgba(110,231,183,0.3)", borderRadius: "20px",
        padding: "32px", maxWidth: "400px", width: "90%",
        boxShadow: "0 0 60px rgba(110,231,183,0.15)",
        animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ fontSize: "32px", marginBottom: "16px", textAlign: "center" }}>🤖</div>
        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "18px", textAlign: "center", marginBottom: "10px" }}>
          AI wants to perform an action
        </h3>
        <div style={{
          background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)",
          borderRadius: "10px", padding: "14px", marginBottom: "24px",
          color: "#a7f3d0", fontSize: "14px", textAlign: "center",
        }}>
          {desc[action.tool] || `${action.tool}: ${JSON.stringify(action.params)}`}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onDeny} style={{
            flex: 1, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171", padding: "12px", borderRadius: "10px", cursor: "pointer",
            fontWeight: 600, fontSize: "14px", fontFamily: "inherit",
          }}>✕ Deny</button>
          <button onClick={onApprove} style={{
            flex: 1, background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
            border: "none", color: "#050d18", padding: "12px", borderRadius: "10px",
            cursor: "pointer", fontWeight: 700, fontSize: "14px", fontFamily: "inherit",
          }}>✓ Approve</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHATBOT
// ─────────────────────────────────────────────────────────────────────────────
function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Hello! 👋 I'm Alex's AI assistant. I can **answer questions** AND **control this website** — I can scroll to sections, highlight elements, and navigate for you!\n\nTry asking me to show you a specific project or scroll to his experience.",
    suggestions: ["Highlight the DocuMind project", "Scroll to Alex's experience", "What's Alex's tech stack?"],
    toolLogs: [],
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingResolve, setPendingResolve] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Execute a single tool call, asking permission if needed
  const executeTool = useCallback(async (toolCall) => {
    const { tool, params } = toolCall;

    // Check if needs confirmation
    const needsConfirm = params?.confirm === true;
    if (needsConfirm) {
      const approved = await new Promise((resolve) => {
        setPendingAction(toolCall);
        setPendingResolve(() => resolve);
      });
      setPendingAction(null);
      setPendingResolve(null);
      if (!approved) return { success: false, message: "User denied the action." };
    }

    switch (tool) {
      case "highlight_tool": return executeHighlight(params.selector, params.label);
      case "scroll_tool": return executeScroll(params.selector);
      case "click_tool": return executeClick(params.selector);
      case "type_tool": return executeType(params.selector, params.text);
      case "remove_highlight_tool": return executeRemoveHighlight();
      default: return { success: false, error: `Unknown tool: ${tool}` };
    }
  }, []);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const rawResponse = await callGemini(msg, history);
      const { toolCalls, cleanText, suggestions } = parseToolCalls(rawResponse);

      // Execute tools and build logs
      const toolLogs = [];
      for (const tc of toolCalls) {
        const logEntry = { tool: tc.tool, params: tc.params, status: "executing", result: null };
        toolLogs.push(logEntry);

        const result = await executeTool(tc);
        logEntry.status = result.success ? "success" : "error";
        logEntry.result = result.message || result.error;

        await new Promise((r) => setTimeout(r, 300)); // small delay between tools
      }

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: cleanText,
        suggestions,
        toolLogs,
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `⚠️ **Connection error.** Make sure your Gemini API key is set correctly.\n\nError: \`${err.message}\``,
        suggestions: ["What's Alex's tech stack?", "Show me the projects", "Scroll to contact"],
        toolLogs: [],
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, messages, executeTool]);

  const lastMsg = messages[messages.length - 1];
  const allLogs = messages.flatMap((m) => m.toolLogs || []);

  return (
    <>
      {pendingAction && pendingResolve && (
        <PermissionModal
          action={pendingAction}
          onApprove={() => pendingResolve(true)}
          onDeny={() => pendingResolve(false)}
        />
      )}

      <div style={{
        position: "fixed", bottom: "90px", right: "24px", zIndex: 1000,
        width: "min(440px, calc(100vw - 32px))",
        height: "min(640px, calc(100vh - 120px))",
        background: "linear-gradient(160deg, #0c1a26 0%, #080f1a 100%)",
        border: "1px solid rgba(110,231,183,0.2)",
        borderRadius: "22px", display: "flex", flexDirection: "column",
        boxShadow: "0 0 80px rgba(110,231,183,0.08), 0 30px 60px rgba(0,0,0,0.7)",
        overflow: "hidden",
        animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 18px", borderBottom: "1px solid rgba(110,231,183,0.12)",
          background: "rgba(110,231,183,0.04)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
            }}>🤖</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "13px" }}>Alex's AI Assistant</div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "1px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6ee7b7", animation: "pulse 2s infinite" }} />
                <span style={{ color: "#6ee7b7", fontSize: "10px", fontWeight: 600 }}>Co-Browsing · Gemini Flash</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {/* Toggle logs */}
            <button onClick={() => setShowLogs((v) => !v)} title="Tool Logs" style={{
              background: showLogs ? "rgba(110,231,183,0.2)" : "rgba(255,255,255,0.08)",
              border: "none", cursor: "pointer", color: showLogs ? "#6ee7b7" : "#9ca3af",
              width: "28px", height: "28px", borderRadius: "7px",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
            }}>⚙️</button>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
              color: "#9ca3af", width: "28px", height: "28px", borderRadius: "7px",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
            }}>✕</button>
          </div>
        </div>

        {/* Tool Logs Panel */}
        {showLogs && allLogs.length > 0 && (
          <div style={{
            padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            maxHeight: "160px", overflowY: "auto",
            background: "rgba(0,0,0,0.3)",
          }}>
            <div style={{ color: "#6b7280", fontSize: "10px", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Tool Execution Logs
            </div>
            {allLogs.map((log, i) => <ToolLog key={i} entry={log} />)}
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: "8px", alignItems: "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "85%",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #6ee7b7, #3b82f6)"
                    : "rgba(255,255,255,0.05)",
                  color: msg.role === "user" ? "#050d18" : "#e5e7eb",
                  padding: "9px 13px",
                  borderRadius: msg.role === "user" ? "14px 14px 3px 14px" : "3px 14px 14px 14px",
                  fontSize: "13px", lineHeight: "1.6",
                  border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}>
                  {msg.role === "user" ? msg.content : <Md text={msg.content} />}
                </div>
              </div>

              {/* Tool logs inline (mini) */}
              {msg.toolLogs && msg.toolLogs.length > 0 && !showLogs && (
                <div style={{ paddingLeft: "34px", marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {msg.toolLogs.map((log, li) => (
                    <span key={li} style={{
                      background: log.status === "success" ? "rgba(110,231,183,0.1)" : "rgba(248,113,113,0.1)",
                      border: `1px solid ${log.status === "success" ? "rgba(110,231,183,0.25)" : "rgba(248,113,113,0.25)"}`,
                      color: log.status === "success" ? "#6ee7b7" : "#f87171",
                      padding: "2px 8px", borderRadius: "10px", fontSize: "10px",
                      fontFamily: "monospace",
                    }}>
                      {log.status === "success" ? "✓" : "✗"} {log.tool.replace("_tool", "")}
                    </span>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {msg.role === "assistant" && msg.suggestions && idx === messages.length - 1 && (
                <div style={{ marginTop: "8px", paddingLeft: "34px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {msg.suggestions.map((s, si) => (
                    <button key={si} onClick={() => sendMessage(s)} style={{
                      background: "rgba(110,231,183,0.07)", border: "1px solid rgba(110,231,183,0.2)",
                      color: "#6ee7b7", padding: "4px 10px", borderRadius: "16px",
                      fontSize: "11px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(110,231,183,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(110,231,183,0.07)"}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%",
                background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
              }}>🤖</div>
              <div style={{
                background: "rgba(255,255,255,0.05)", padding: "10px 14px",
                borderRadius: "3px 14px 14px 14px", border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", gap: "5px", alignItems: "center",
              }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: "6px", height: "6px", borderRadius: "50%", background: "#6ee7b7",
                    animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask or say 'highlight the projects section'…"
              disabled={loading}
              style={{
                flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "11px", padding: "9px 13px", color: "#fff", fontSize: "13px",
                fontFamily: "inherit", outline: "none",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(110,231,183,0.45)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
              width: "38px", height: "38px", borderRadius: "11px", border: "none", cursor: "pointer",
              background: input.trim() && !loading ? "linear-gradient(135deg,#6ee7b7,#3b82f6)" : "rgba(255,255,255,0.08)",
              color: input.trim() && !loading ? "#050d18" : "#6b7280",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              transition: "all 0.2s",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div style={{ marginTop: "7px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {["Highlight DocuMind", "Scroll to skills", "Show contact info"].map((q) => (
              <button key={q} onClick={() => sendMessage(q)} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#6b7280", padding: "3px 9px", borderRadius: "12px",
                fontSize: "10.5px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#6ee7b7"; e.currentTarget.style.borderColor = "rgba(110,231,183,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PORTFOLIO APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSkill, setActiveSkill] = useState("Frontend");
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const ids = ["hero", "about", "experience", "projects", "contact"];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goto = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#050d18", color: "#e5e7eb", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#050d18}
        ::-webkit-scrollbar-thumb{background:rgba(110,231,183,0.3);border-radius:2px}

        @keyframes typingBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes orbFloat{0%,100%{transform:translate(0,0)}33%{transform:translate(60px,-40px)}66%{transform:translate(-30px,30px)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 0 0 rgba(110,231,183,0.4)}50%{box-shadow:0 0 0 8px rgba(110,231,183,0)}}

        .__ai-highlight {
          outline: 3px solid #6ee7b7 !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 0 6px rgba(110,231,183,0.15), 0 0 30px rgba(110,231,183,0.3) !important;
          transition: all 0.3s ease !important;
          animation: glowPulse 1.5s ease infinite !important;
          z-index: 10 !important;
          position: relative !important;
        }

        .nav-btn{background:none;border:none;cursor:pointer;font-family:inherit;transition:color 0.2s}
        .nav-btn:hover{color:#6ee7b7!important}
        .hover-lift{transition:transform 0.25s,box-shadow 0.25s}
        .hover-lift:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.4)!important}
        .hover-border{transition:border-color 0.25s,background 0.25s}
        .hover-border:hover{border-color:rgba(110,231,183,0.35)!important;background:rgba(110,231,183,0.04)!important}
        .skill-pill{transition:all 0.2s;cursor:default}
        .skill-pill:hover{background:rgba(110,231,183,0.18)!important;transform:translateY(-1px)}
      `}</style>

      {/* BG Orbs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {[["#6ee7b7", "top:-20%", "right:-10%", "600px", "20s", "0s"],
          ["#3b82f6", "bottom:5%", "left:-10%", "500px", "25s", "5s"],
          ["#c084fc", "top:45%", "left:55%", "350px", "18s", "10s"]].map(([c, t, l, s, d, delay], i) => (
          <div key={i} style={{
            position: "absolute", [t.split(":")[0]]: t.split(":")[1],
            [l.split(":")[0]]: l.split(":")[1],
            width: s, height: s, borderRadius: "50%",
            background: `radial-gradient(circle, ${c}10 0%, transparent 70%)`,
            animation: `orbFloat ${d} ease-in-out ${delay} infinite`,
          }} />
        ))}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(110,231,183,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(110,231,183,0.025) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }} />
      </div>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6%",
        background: scrolled ? "rgba(5,13,24,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(110,231,183,0.08)" : "none",
        transition: "all 0.4s",
      }}>
        <button className="nav-btn" onClick={() => goto("hero")} style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px" }}>
          Alex<span style={{ color: "#6ee7b7" }}>.</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {["About","Experience","Projects","Contact"].map((n) => (
            <button key={n} className="nav-btn" onClick={() => goto(n.toLowerCase())} style={{
              color: activeSection === n.toLowerCase() ? "#6ee7b7" : "#6b7280",
              fontWeight: activeSection === n.toLowerCase() ? 600 : 400,
              fontSize: "14px", padding: "7px 14px", borderRadius: "8px",
            }}>{n}</button>
          ))}
          <button id="chat-toggle-btn" onClick={() => setChatOpen(true)} style={{
            background: "linear-gradient(135deg,#6ee7b7,#3b82f6)", border: "none",
            borderRadius: "10px", padding: "7px 16px", color: "#050d18",
            fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: "6px", marginLeft: "6px",
            transition: "all 0.25s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            ✨ AI Chat
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 8% 60px" }}>
        <div style={{ maxWidth: "860px", animation: "fadeUp 0.8s ease forwards" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.25)",
            borderRadius: "20px", padding: "5px 14px", marginBottom: "28px",
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6ee7b7", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#6ee7b7", fontSize: "12px", fontWeight: 600, letterSpacing: "0.5px" }}>Available for opportunities</span>
          </div>

          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(52px,7.5vw,92px)", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-2.5px", marginBottom: "18px", color: "#fff" }}>
            Alex<br />
            <span style={{
              background: "linear-gradient(135deg,#6ee7b7 0%,#3b82f6 45%,#c084fc 100%)",
              backgroundSize: "200% 200%", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
              animation: "gradShift 5s ease infinite",
            }}>Rivera</span>
          </h1>

          <p style={{ fontSize: "20px", color: "#6ee7b7", fontWeight: 600, marginBottom: "12px" }}>{DATA.title}</p>
          <p style={{ fontSize: "17px", color: "#9ca3af", lineHeight: 1.75, maxWidth: "560px", marginBottom: "16px" }}>{DATA.tagline}</p>
          <p style={{ color: "#4b5563", fontSize: "13px", marginBottom: "36px", display: "flex", alignItems: "center", gap: "5px" }}>
            📍 {DATA.location}
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "60px" }}>
            <button onClick={() => setChatOpen(true)} style={{
              background: "linear-gradient(135deg,#6ee7b7,#3b82f6)", border: "none",
              borderRadius: "14px", padding: "13px 28px", color: "#050d18",
              fontWeight: 700, fontSize: "15px", cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: "8px",
              boxShadow: "0 4px 24px rgba(110,231,183,0.3)", transition: "all 0.25s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              🤖 Ask My AI Assistant
            </button>
            <button onClick={() => goto("projects")} style={{
              background: "transparent", border: "1px solid rgba(110,231,183,0.3)",
              borderRadius: "14px", padding: "13px 28px", color: "#e5e7eb",
              fontWeight: 600, fontSize: "15px", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(110,231,183,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}>
              View Projects →
            </button>
          </div>

          <div id="stats-row" style={{ display: "flex", gap: "44px", flexWrap: "wrap" }}>
            {DATA.stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "34px", fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>{s.value}</div>
                <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "3px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / SKILLS ── */}
      <section id="about" style={{ position: "relative", zIndex: 1, padding: "96px 8%", maxWidth: "1200px", margin: "0 auto" }}>
        <Label>About</Label>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(34px,4vw,52px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", marginBottom: "18px" }}>
          The Stack Behind the Work
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "16px", lineHeight: 1.85, maxWidth: "640px", marginBottom: "52px" }}>
          I'm a builder obsessed with developer experience, system reliability, and AI-powered products. Whether architecting microservices on GCP or shipping pixel-perfect React UIs, I care deeply about every layer.
        </p>

        <div id="skills-tabs" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          {Object.keys(DATA.skills).map((cat) => (
            <button key={cat} onClick={() => setActiveSkill(cat)} style={{
              background: activeSkill === cat ? "linear-gradient(135deg,#6ee7b7,#3b82f6)" : "rgba(255,255,255,0.05)",
              border: "1px solid " + (activeSkill === cat ? "transparent" : "rgba(255,255,255,0.09)"),
              color: activeSkill === cat ? "#050d18" : "#9ca3af",
              padding: "7px 18px", borderRadius: "10px", fontSize: "13px",
              fontWeight: activeSkill === cat ? 700 : 400, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s",
            }}>{cat}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "9px", minHeight: "50px" }}>
          {DATA.skills[activeSkill].map((s) => (
            <span key={s} className="skill-pill" style={{
              background: "rgba(110,231,183,0.07)", border: "1px solid rgba(110,231,183,0.18)",
              color: "#a7f3d0", padding: "7px 15px", borderRadius: "9px",
              fontSize: "13px", fontFamily: "'JetBrains Mono',monospace",
            }}>{s}</span>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ position: "relative", zIndex: 1, padding: "96px 8%", maxWidth: "1100px", margin: "0 auto" }}>
        <Label>Experience</Label>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(34px,4vw,52px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", marginBottom: "52px" }}>
          Where I've Built Things
        </h2>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "18px", top: "20px", bottom: "20px", width: "1px", background: "linear-gradient(to bottom,rgba(110,231,183,0.5),rgba(59,130,246,0.3),transparent)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {DATA.experience.map((exp) => (
              <div key={exp.id} id={exp.id} className="hover-border" style={{
                marginLeft: "44px", position: "relative",
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px", padding: "24px 28px",
                borderLeft: `3px solid ${exp.color}`,
              }}>
                <div style={{
                  position: "absolute", left: "-37px", top: "24px",
                  width: "11px", height: "11px", borderRadius: "50%",
                  background: exp.color, border: "2px solid #050d18",
                  boxShadow: `0 0 10px ${exp.color}60`,
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                  <div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff" }}>{exp.role}</h3>
                    <div style={{ color: exp.color, fontWeight: 600, fontSize: "14px", marginTop: "2px" }}>{exp.company}</div>
                    <div style={{ color: "#6b7280", fontSize: "12px" }}>{exp.type}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "7px", padding: "5px 12px", fontSize: "12px", color: "#9ca3af", fontFamily: "monospace", height: "fit-content", whiteSpace: "nowrap" }}>
                    {exp.period}
                  </div>
                </div>
                <ul style={{ paddingLeft: "16px", marginBottom: "16px" }}>
                  {exp.highlights.map((h) => <li key={h} style={{ color: "#9ca3af", fontSize: "13.5px", lineHeight: "1.7", marginBottom: "5px" }}>{h}</li>)}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {exp.stack.map((s) => (
                    <span key={s} style={{ background: `${exp.color}15`, border: `1px solid ${exp.color}30`, color: exp.color, padding: "3px 9px", borderRadius: "5px", fontSize: "11px", fontFamily: "monospace" }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ position: "relative", zIndex: 1, padding: "96px 8%", maxWidth: "1400px", margin: "0 auto" }}>
        <Label>Projects</Label>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(34px,4vw,52px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", marginBottom: "52px" }}>
          Things I've Shipped
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "18px" }}>
          {DATA.projects.map((p) => (
            <div key={p.id} id={p.id} className="hover-lift" style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "18px", padding: "26px", cursor: "default", position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = p.color + "40"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
                <span style={{ fontSize: "30px" }}>{p.icon}</span>
                <span style={{ background: `${p.color}20`, color: p.color, padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>{p.stars}</span>
              </div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "19px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{p.name}</h3>
              <div style={{ color: p.color, fontSize: "12px", fontWeight: 600, marginBottom: "10px" }}>{p.tagline}</div>
              <p style={{ color: "#9ca3af", fontSize: "13.5px", lineHeight: "1.7", marginBottom: "18px" }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "16px" }}>
                {p.stack.map((s) => (
                  <span key={s} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#d1d5db", padding: "3px 9px", borderRadius: "5px", fontSize: "11px", fontFamily: "monospace" }}>{s}</span>
                ))}
              </div>
              <span style={{ background: `${p.color}15`, color: p.color, padding: "4px 11px", borderRadius: "7px", fontSize: "11px", fontWeight: 600 }}>{p.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ position: "relative", zIndex: 1, padding: "96px 8% 130px", maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
        <Label center>Contact</Label>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(34px,4vw,52px)", fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", marginBottom: "18px" }}>
          Let's Build Something
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "16px", lineHeight: 1.8, marginBottom: "44px" }}>
          Open to senior/staff engineering roles, technical consulting, and interesting open source collaborations.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap", marginBottom: "48px" }}>
          {[
            { id: "contact-email-link", icon: "✉️", label: DATA.email, href: `mailto:${DATA.email}` },
            { id: "contact-github-link", icon: "🐙", label: DATA.github, href: `https://${DATA.github}` },
            { id: "contact-twitter-link", icon: "🐦", label: DATA.twitter, href: `https://twitter.com/${DATA.twitter.slice(1)}` },
          ].map((l) => (
            <a key={l.id} id={l.id} href={l.href} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", gap: "9px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px", padding: "13px 20px", color: "#9ca3af",
              textDecoration: "none", fontSize: "14px",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(110,231,183,0.35)"; e.currentTarget.style.color = "#6ee7b7"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.transform = "translateY(0)"; }}>
              {l.icon} {l.label}
            </a>
          ))}
        </div>

        <div style={{
          background: "linear-gradient(135deg,rgba(110,231,183,0.07),rgba(59,130,246,0.07))",
          border: "1px solid rgba(110,231,183,0.18)", borderRadius: "20px", padding: "36px",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🤖</div>
          <h3 style={{ fontFamily: "'Syne',sans-serif", color: "#fff", fontWeight: 700, fontSize: "20px", marginBottom: "10px" }}>
            Have Questions? Just Ask!
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "22px", lineHeight: 1.7 }}>
            My AI assistant can answer questions AND navigate this page for you — scroll to sections, highlight projects, and more.
          </p>
          <button onClick={() => setChatOpen(true)} style={{
            background: "linear-gradient(135deg,#6ee7b7,#3b82f6)", border: "none",
            borderRadius: "11px", padding: "12px 28px", color: "#050d18",
            fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.25s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            ✨ Open AI Chat
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", color: "#374151", fontSize: "12px" }}>
        Built with React · AI Co-Browsing by Gemini Flash · © 2024 Alex Rivera
      </footer>

      {/* CHAT TOGGLE */}
      {!chatOpen && (
        <button id="chat-toggle-btn" onClick={() => setChatOpen(true)} style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 999,
          width: "58px", height: "58px", borderRadius: "50%", border: "2px solid rgba(110,231,183,0.4)",
          cursor: "pointer", background: "linear-gradient(135deg,#6ee7b7,#3b82f6)",
          boxShadow: "0 4px 24px rgba(110,231,183,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", transition: "all 0.25s", animation: "glowPulse 2.5s ease infinite",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
          🤖
        </button>
      )}

      {chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
    </div>
  );
}

function Label({ children, center }) {
  return (
    <div style={{
      display: center ? "flex" : "inline-flex",
      justifyContent: center ? "center" : "flex-start",
      alignItems: "center", gap: "7px",
      background: "rgba(110,231,183,0.07)", border: "1px solid rgba(110,231,183,0.18)",
      borderRadius: "16px", padding: "4px 13px", marginBottom: "18px", width: "fit-content",
      ...(center ? { margin: "0 auto 18px" } : {}),
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#6ee7b7" }} />
      <span style={{ color: "#6ee7b7", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.2px" }}>{children}</span>
    </div>
  );
}
