# RichConnect - AI-Powered Elite Dating & Networking Platform

An ultra-luxury, high-net-worth dating, matchmaking, and networking platform powered by **Event-Based AI Helpers** (Matchmaker, Moderation, and Concierge agents) built with **Next.js 14 / Vite React + Tailwind + Supabase + Groq Free API**.

Optimized for **1-Click Vercel Deployment** with zero heavy 24/7 background worker processes or Redis drains.

---

## 🏗 Event-Driven AI Architecture

Rather than burning compute on costly 24/7 background worker servers, RichConnect utilizes lightweight, event-triggered serverless AI helpers:

1. 🤖 **Matchmaker Agent (`/api/agents/matchmaker`)**:
   - **Trigger**: Runs on demand + **Vercel Cron 2x daily** (`0 0,12 * * *`).
   - **Engine**: Groq free LLaMA-3.3-70B API (or Gemini fallback).
   - **Function**: Automatically evaluates candidate profiles, calculating cross-cultural synergy, wealth alignment, and shared lifestyle compatibility scores (0–100%) and generates top match proposals.

2. 🛡 **Moderation Agent (`/api/agents/moderate`)**:
   - **Trigger**: **Event-based ONLY** — executes strictly when a message or image is sent.
   - **Engine**: Groq free LLaMA-3.3-70B + real-time safety heuristic scanner.
   - **Function**: Intercepts unauthorized off-platform contact leaks, wire transfer / cryptocurrency scams, and inappropriate content with $0 idle cost.

3. 🛎 **Concierge Agent (`/api/agents/concierge`)**:
   - **Trigger**: **Event-based ONLY** — executes strictly when a member chats with AI or completes onboarding.
   - **Engine**: Groq free LLaMA-3.3-70B luxury wingman model.
   - **Function**: Serves personalized icebreakers, Mayfair / Dubai / Lagos / Monaco private dining recommendations, and high-status intercultural courtship advice.

---

## 🚀 1-Click Vercel Deployment

Deploy RichConnect to Vercel in seconds with no Dockerfile, no Celery, and no Redis workers:

### Step 1: Push to GitHub & Import to Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your imported GitHub repository.

### Step 2: Configure Environment Variables
Add the following in your Vercel Project Settings (`Environment Variables`):

| Variable | Description | Example / Source |
|---|---|---|
| `GROQ_API_KEY` | Free Groq API Key | [console.groq.com/keys](https://console.groq.com/keys) |
| `GEMINI_API_KEY` | Fallback AI Key | Google AI Studio |
| `MY_PRIVATE_PASSWORD` | Master CRM Passcode | `royalty2026` |
| `VITE_SUPABASE_URL` | Supabase Project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Public Anon Key | `ey...` |
| `NEXT_PUBLIC_SUPABASE_URL`| Supabase Project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Supabase Public Anon Key | `ey...` |

### Step 3: Deploy & Vercel Cron
Click **Deploy**. Vercel will automatically build the application and register the Cron Job configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/agents/matchmaker",
      "schedule": "0 0,12 * * *"
    }
  ]
}
```

---

## 🗄 Supabase Database & Edge Functions Setup

1. Open your Supabase Dashboard -> **SQL Editor**.
2. Copy and run `supabase/schema.sql`. It provisions:
   - `girls`, `messages`, `memories` (Mode 1: Private Dating CRM)
   - `clients`, `matches`, `match_messages`, `consultations` (Mode 2: Elite Private Matchmaking)
   - `agent_events` (Event-based AI audit log)
   - Row Level Security (RLS) policies and curated seed profiles.

### Optional: Deploying Supabase Edge Functions Directly
If you prefer running the 3 AI helpers directly inside Supabase Edge Functions:
```bash
supabase functions deploy matchmaker
supabase functions deploy moderate
supabase functions deploy concierge
```

---

## 💻 Local Development

Run the fullstack application locally:

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

App runs at `http://localhost:3000`.

---

## 🌟 Key Application Features

1. **Authentication & Master Passcode**:
   - Master passcode gate (`royalty2026`) protecting the executive CRM.
   - Quick autofill button for instant testing.

2. **Discover / Swipe Deck (`/swipe`)**:
   - Gesture-based cards with bio preview, wealth indicators, superlikes, and match celebrations.

3. **Event-Based AI Agent Hub (`/agents`)**:
   - Live telemetry for Matchmaker, Moderation, and Concierge agents.
   - Interactive testing modals for live Groq evaluations.
   - Event audit feed streaming serverless executions.

4. **Private 1-on-1 Encrypted Chat (`/chat/:matchId`)**:
   - Strictly unlocked only after matchmaker approval.
   - Event-based Moderation Agent intercepts solicitations in real time.
   - Built-in high-status icebreaker generators.

5. **VIP Video Suite Placeholder (`/video-call`)**:
   - End-to-end simulated encrypted video rendezvous with camera preview and AI concierge wingman prompt.

6. **Date Planner**:
   - Integrated inside the Dating stage on the Pipeline page for coordinating upcoming visits with rich partner candidates.
