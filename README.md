Setup Instructions:
1. Clone the repository
2. On Terminal run "npm create vite@latest portfolio-app -- --template react"
3. Then run "cd portfolio-app"
4. Then run "npm install"
5. Then run "npm run dev"
6. Open http://localhost:5173 to view it in the browser
API configuration:
Genmini 2.5 Flash Lite
Architecture Overview:
                    ┌───────────────────────┐
                    │       Browser UI      │
                    │  (Portfolio Website)  │
                    └──────────┬────────────┘
                               │
                        React Components
                               │
              ┌────────────────┼────────────────┐
              │                │                │
         Portfolio UI       Chatbot UI       Navigation
              │                │
              │          Gemini API Layer
              │                │
              │         Google Gemini API
              │
         Local Data Layer
        (PORTFOLIO object)
       It uses a single-page React architecture (SPA) with component-based UI, client-side state management, and a Gemini API integration layer for the AI chatbot. It follows a Vite + React functional component architecture.


       Live URL Link:https://portfolio-ai-umber-iota.vercel.app/