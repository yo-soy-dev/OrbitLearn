<!--
  ██████╗ ██████╗ ██████╗ ██╗████████╗██╗     ███████╗ █████╗ ██████╗ ███╗   ██╗
 ██╔═══██╗██╔══██╗██╔══██╗██║╚══██╔══╝██║     ██╔════╝██╔══██╗██╔══██╗████╗  ██║
 ██║   ██║██████╔╝██████╔╝██║   ██║   ██║     █████╗  ███████║██████╔╝██╔██╗ ██║
 ██║   ██║██╔══██╗██╔══██╗██║   ██║   ██║     ██╔══╝  ██╔══██║██╔══██╗██║╚██╗██║
 ╚██████╔╝██║  ██║██████╔╝██║   ██║   ███████╗███████╗██║  ██║██║  ██║██║ ╚████║
  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
-->

<div align="center">

```
 ○  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ○
 ·                                                                               ·
 ·        🪐  O R B I T L E A R N                                               ·
 ·            ─────────────────────────────────────                             ·
 ·            Teaching at the speed of thought.                                 ·
 ·                                                                               ·
 ○  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ○
```

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-1C1C1C?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-1C1C1C?style=for-the-badge&logo=stripe&logoColor=635BFF)](https://stripe.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-1C1C1C?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Sentry](https://img.shields.io/badge/Sentry-1C1C1C?style=for-the-badge&logo=sentry&logoColor=FB4226)](https://sentry.io)
[![MIT](https://img.shields.io/badge/License_MIT-1C1C1C?style=for-the-badge)](LICENSE)

**[What It Does](#-what-it-does) · [Under the Hood](#-under-the-hood) · [Spin It Up](#-spin-it-up) · [Schema](#-data-schema) · [Roadmap](#-whats-next)**

</div>

---

## ❯ What It Does

OrbitLearn is a **multi-tenant LMS SaaS** where AI doesn't just assist — it co-teaches. Voice-powered tutors, instant quizzes from any lesson, and automatic session summaries sent to every learner's inbox. All under one subscription roof.

```
┌──────────────────────────────────────────────────────────────────┐
│  A learner joins a session                                       │
│     → Vapi AI tutor speaks, answers, guides                      │
│     → Session ends                                               │
│     → OpenAI generates a quiz + summary from the transcript      │
│     → Brevo emails the summary to every attendee                 │
│     → Progress tracked. Subscription managed. Done.             │
└──────────────────────────────────────────────────────────────────┘
```

---

## ◈ Feature Map

```
ORBITLEARN
│
├── 🎓  LEARNING
│   ├── Course + lesson management (rich content types)
│   ├── Companions — AI study partners per course
│   ├── My Journey — personal progress tracker
│   └── Multi-tenant orgs (team & enterprise)
│
├── 🔴  LIVE SESSIONS
│   ├── Real-time rooms via Vapi (audio/video)
│   ├── AI vocal tutor — speaks, explains, responds
│   ├── In-session polls, chat, presence (Supabase Realtime)
│   └── Attendance tracking + session recordings
│
├── 🤖  AI ENGINE
│   ├── Quiz Generator — structured MCQs from lesson text
│   ├── Session Summarizer — transcript → readable recap
│   └── View Summary page — browse past session recaps
│
├── 💳  BILLING
│   ├── Free / Pro / Team tiers (Stripe Checkout)
│   ├── Webhook-driven lifecycle management
│   └── Middleware-gated premium routes
│
├── 🔐  AUTH & SECURITY
│   ├── Clerk (sign-in catch-all route + JWT)
│   ├── Idempotent webhook handlers (Stripe + Vapi)
│   └── Sentry — error monitoring across edge + server
│
└── ✉️  EMAILS
    ├── Brevo — session reminders + summaries
    └── Nodemailer — SMTP fallback + internal alerts
```

---

## ◈ Under the Hood

### System Architecture

```
                    ╔══════════════════════╗
                    ║   Browser / Client   ║
                    ║  Next.js App Router  ║
                    ║  React + Tailwind    ║
                    ╚══════════╤═══════════╝
                               │
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    ╔═════════════╗    ╔══════════════╗    ╔═════════════╗
    ║  Supabase   ║    ║    Stripe    ║    ║    Vapi     ║
    ║  ─────────  ║    ║  ──────────  ║    ║  ─────────  ║
    ║  Postgres   ║    ║  Checkout    ║    ║  Live Rooms ║
    ║  Auth       ║    ║  Webhooks    ║    ║  AI Agent   ║
    ║  Realtime   ║    ╚══════════════╝    ║  Webhooks   ║
    ║  Storage    ║                        ╚═════════════╝
    ╚══════╤══════╝
           │
    ╔══════▼══════╗          ╔══════════════╗
    ║   OpenAI    ║          ║    Sentry    ║
    ║  ─────────  ║          ║  ──────────  ║
    ║  Quizzes    ║          ║  Edge Errors ║
    ║  Summaries  ║          ║  Server Logs ║
    ╚══════╤══════╝          ╚══════════════╝
           │
    ╔══════▼══════╗
    ║    Email    ║
    ║  ─────────  ║
    ║   Brevo     ║
    ║  Nodemailer ║
    ╚═════════════╝
```

### Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| **Framework** | Next.js 14 (App Router) | Full-stack React, Server Actions, API routes |
| **UI** | React + Tailwind CSS + shadcn/ui | Component system + utility styling |
| **Database** | Supabase (Postgres + Realtime + Storage) | Data, presence, file storage |
| **Auth** | Clerk | Sign-in/out, JWT, route protection |
| **Billing** | Stripe | Checkout, subscriptions, webhooks |
| **Live Sessions** | Vapi | Real-time rooms + AI vocal agent |
| **AI** | OpenAI (GPT) | Quiz generation + session summaries |
| **Email** | Brevo + Nodemailer | Transactional + SMTP fallback |
| **Monitoring** | Sentry | Error tracking (client, server, edge) |
| **CI/CD** | GitHub Actions + Vercel | Lint → test → deploy |

---

## ◈ Spin It Up

### Prerequisites

You'll need accounts for:
[Supabase](https://supabase.com) · [Clerk](https://clerk.com) · [Stripe](https://stripe.com) · [Vapi](https://vapi.ai) · [OpenAI](https://openai.com) · [Brevo](https://brevo.com) · [Sentry](https://sentry.io)

### Steps

**1 — Clone**
```bash
git clone https://github.com/<your-org>/orbitlearn.git
cd orbitlearn
```

**2 — Install**
```bash
npm install        # or: pnpm install
```

**3 — Environment**
```bash
cp .env.example .env.local
# Fill in your keys (see section below)
```

**4 — Database**
```bash
supabase db push
# or apply /supabase/migrations manually via the SQL editor
```

**5 — Dev server**
```bash
npm run dev
# → http://localhost:3000
```

### Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint check |
| `npm run test` | Run test suite |

---

## ◈ Environment Variables

```env
# ── Supabase ─────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key        # server-only
DATABASE_URL=postgres://user:pass@host:port/dbname

# ── Clerk (Auth) ─────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# ── Stripe (Billing) ─────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx                          # server-only
STRIPE_WEBHOOK_SECRET=whsec_xxx                        # server-only

# ── OpenAI (AI Features) ─────────────────────────────────────────
OPENAI_API_KEY=sk-xxxxxxxx                             # server-only

# ── Vapi (Live Sessions) ─────────────────────────────────────────
VAPI_API_KEY=your_vapi_api_key                         # server-only

# ── Brevo + Nodemailer (Email) ───────────────────────────────────
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=no-reply@orbitlearn.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# ── Sentry (Monitoring) ──────────────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# ── App ──────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> `NEXT_PUBLIC_*` variables are exposed to the browser. Everything else is server-only. Never leak secret keys into client bundles.

---

## ◈ Data Schema

```
users ──────────────────── org_id → organizations
  │
  ├──→ subscriptions ────── stripe_subscription_id → Stripe
  │
  └──→ sessions (as host)
         │
         ├──→ attendances ── user_id → users
         ├──→ quizzes      ── questions (JSON)
         └──→ summaries    ── summary_text (Markdown)

courses ── author_id → users
  │
  └──→ lessons
         │
         └──→ sessions ── vapi_room_id → Vapi

webhook_events ── idempotency log (Stripe + Vapi event IDs)
```

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `users` | `id`, `email`, `role`, `org_id` | Auth profile + role |
| `organizations` | `id`, `name`, `slug` | Multi-tenant isolation |
| `courses` | `id`, `title`, `author_id`, `org_id` | Course catalog |
| `lessons` | `id`, `course_id`, `content`, `content_type` | Lesson content |
| `sessions` | `id`, `lesson_id`, `vapi_room_id`, `host_id`, `starts_at`, `ends_at` | Live sessions |
| `attendances` | `session_id`, `user_id`, `join_time`, `leave_time` | Participation log |
| `quizzes` | `id`, `session_id`, `questions` (JSON), `generated_at` | AI-generated quizzes |
| `summaries` | `id`, `session_id`, `summary_text`, `generated_at` | AI session recaps |
| `subscriptions` | `user_id`, `stripe_subscription_id`, `status`, `tier` | Billing state |
| `webhook_events` | `event_id`, `source`, `processed_at` | Idempotency guard |

Index on all foreign keys + `status`, `org_id`, `session_id`.

---

## ◈ Integration Notes

### Stripe Webhooks → `/api/webhooks/stripe`
```
invoice.paid                   activate / renew subscription
customer.subscription.updated  handle tier changes
customer.subscription.deleted  downgrade or cancel
```
Always verify signatures with `STRIPE_WEBHOOK_SECRET`. Store all Stripe IDs server-side — never trust client-reported status.

### Vapi Sessions
Server issues a short-lived access token → client joins via Vapi SDK → `vapi_room_id` persisted in `sessions`. On `session.ended`, webhook triggers OpenAI summary generation → stored in `summaries` → emailed via Brevo.

### AI Endpoints

```
POST /api/ai/generate-quiz
  body:  { lessonText: string, numQuestions: number }
  out:   { questions: [{ question, options, correct_index, explanation }] }

POST /api/ai/generate-summary
  body:  { sessionId: string, transcript: string }
  out:   { summary: string (Markdown) }
```

Use a JSON schema in your OpenAI prompt to enforce structure. Store results before returning — don't regenerate on every request.

---

## ◈ Project Structure

```
orbitlearn/
├── public/
├── src/
│   └── app/                              Next.js App Router root
│       ├── api/                          API route handlers
│       │   ├── webhooks/stripe/          Stripe webhook listener
│       │   ├── webhooks/vapi/            Vapi event listener
│       │   └── ai/                       Quiz + summary endpoints
│       ├── companions/                   AI study partner pages
│       ├── my-journey/                   Personal progress tracker
│       ├── pricing/                      Subscription plan picker
│       ├── quiz/                         Quiz UI pages
│       ├── sign-in/[[...sign-in]]/       Clerk catch-all auth route
│       ├── subscription/                 Billing management
│       ├── viewsummary/                  Session recap browser
│       ├── layout.tsx                    Root layout
│       └── page.tsx                      Landing / home
├── components/                           Shared UI components
├── constants/                            App-wide constants
├── lib/                                  DB clients, helpers, utils
├── types/                                TypeScript definitions
├── instrumentation.ts                    Sentry server init
├── instrumentation-client.ts             Sentry client init
├── middleware.ts                         Auth + route protection
├── sentry.server.config.ts
├── sentry.edge.config.ts
├── next.config.ts
├── components.json                       shadcn/ui config
└── package.json
```

---

## ◈ Deployment

```
1.  Push to GitHub
       ↓
2.  GitHub Actions → lint + test
       ↓
3.  Vercel auto-deploys on merge to main
       ↓
4.  Configure env vars in Vercel dashboard
       ↓
5.  Register webhooks:
      Stripe  → https://yourdomain.com/api/webhooks/stripe
      Vapi    → https://yourdomain.com/api/webhooks/vapi
```

Supabase handles Postgres, Auth, and Realtime — no extra infrastructure needed.

---

## ◈ What's Next

```diff
+ Live whiteboard + breakout rooms
+ In-session collaborative document editing
+ Advanced analytics (completion rates, quiz scores, engagement heatmaps)
+ Mobile clients (React Native)
+ Recording playback with auto-generated captions
+ Custom email template builder
+ Self-hosted deployment guide (Docker + Railway)
```

---

## ◈ Contributing

```bash
# 1. Fork → clone your fork
# 2. Branch off main
git checkout -b feat/your-feature

# 3. Write code + tests
# 4. Lint before pushing
npm run lint

# 5. Open a PR with context on what + why
```

- Follow **Prettier + ESLint** (enforced on CI)
- Add tests for new features
- Open an issue first for large changes

---

## ◈ License

MIT — see [`LICENSE`](LICENSE)

---

<div align="center">

```
 ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
          🪐  orbitlearn  ·  teaching at the speed of thought
 ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
```

[Report a Bug](https://github.com/<your-org>/orbitlearn/issues) · [Request a Feature](https://github.com/<your-org>/orbitlearn/issues) · [Discussions](https://github.com/<your-org>/orbitlearn/discussions)

</div>
