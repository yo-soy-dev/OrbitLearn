<div align="center">

# 🪐 OrbitLearn

**AI-Powered Learning Management System — Built for the Modern Web**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Environment Variables](#-environment-variables) · [Database Schema](#-database-schema) · [Roadmap](#-roadmap) · [Contributing](#-contributing)

</div>

---

## 📖 Overview

OrbitLearn is a full-featured, multi-tenant LMS SaaS built with **Next.js**, **Supabase**, and **Stripe**. It delivers real-time interactive teaching sessions powered by **Vapi** (AI vocal agent), AI-generated quizzes and session summaries via **OpenAI**, and automated post-session email delivery via **Brevo** and **Nodemailer**.

Designed for scalability from day one — with subscription tiers, webhook-driven billing, and a clean developer experience.

---

## ✨ Features

### 🎓 Core LMS
- Course and lesson management with rich content types
- Multi-tenant support via organizations
- Admin dashboard for courses, sessions, and users
- Attendance tracking and session recordings

### 🔴 Real-Time Sessions
- Live audio/video teaching rooms via **Vapi**
- AI vocal agent for voice-driven tutors and assistants
- In-session polls, chat, and presence via **Supabase Realtime**
- Webhook-driven events for session end, recordings, and attendance

### 🤖 AI Features
- **Quiz Generator** — Auto-generates structured quizzes from lesson content or session transcripts (OpenAI)
- **Session Summaries** — Automatically summarizes sessions post-recording and emails them to attendees
- Structured JSON output via prompt engineering for reliable, parseable responses

### 💳 Subscriptions & Billing
- **Free / Pro / Team** plans via Stripe Checkout
- Webhook-driven subscription lifecycle (`invoice.paid`, `subscription.updated`, `subscription.deleted`)
- Server-side gating of paid routes and features

### 🔐 Auth & Security
- Supabase Auth (email/password + optional social providers)
- JWT-protected API routes and Server Actions
- Webhook signature verification (Stripe + Vapi)
- Idempotent webhook handling to prevent double-processing

### ✉️ Email Notifications
- Session reminders and post-session summaries via **Brevo**
- Internal and SMTP-based notifications via **Nodemailer**
- Templated HTML emails (Handlebars or JSX-based)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│           Next.js App Router + React + Tailwind         │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌──────────┐   ┌──────────────┐  ┌─────────┐
   │ Supabase │   │  Stripe API  │  │  Vapi   │
   │ Auth +   │   │  Checkout +  │  │ Rooms + │
   │ Postgres │   │  Webhooks    │  │ Agents  │
   │ Realtime │   └──────────────┘  └─────────┘
   └──────────┘
         │
   ┌─────┴────────┐
   │   OpenAI     │  Quiz generation + Session summaries
   └──────────────┘
         │
   ┌─────┴────────┐
   │  Brevo /     │  Post-session emails + reminders
   │  Nodemailer  │
   └──────────────┘
```

**Data flow at a glance:**

1. **Auth & DB** — Supabase handles identity and stores all platform data in Postgres
2. **Billing** — Stripe manages checkout; webhooks update `subscriptions` in Supabase
3. **Realtime** — Vapi powers live rooms; Supabase Realtime handles chat and presence
4. **AI** — OpenAI generates quizzes and summaries from transcripts/content; artifacts stored and emailed
5. **Email** — Brevo handles transactional delivery; Nodemailer used as SMTP fallback

---

## 🧩 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 (App Router) | Full-stack React framework |
| React | Component-based UI |
| Tailwind CSS | Utility-first styling |

### Backend & Infrastructure
| Technology | Purpose |
|------------|---------|
| Supabase | Postgres DB, Auth, Realtime, Storage |
| Next.js API Routes / Server Actions | REST endpoints & server logic |
| Stripe | Subscription billing & webhooks |
| Vapi | Live session rooms & AI vocal agent |
| OpenAI (GPT) | Quiz generation & session summaries |
| Brevo (Sendinblue) | Transactional email delivery |
| Nodemailer | SMTP / internal email fallback |

### DevOps
| Technology | Purpose |
|------------|---------|
| GitHub Actions | CI/CD pipelines |
| Vercel | Hosting & serverless functions |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Accounts for: [Supabase](https://supabase.com), [Stripe](https://stripe.com), [Vapi](https://vapi.ai), [OpenAI](https://openai.com), [Brevo](https://brevo.com)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-org>/orbitlearn.git
cd orbitlearn
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values — see [Environment Variables](#-environment-variables) below.

### 4. Run Database Migrations

Apply the schema to your Supabase project using the Supabase CLI or the SQL editor:

```bash
supabase db push
# or paste migrations from /supabase/migrations into the SQL editor
```

### 5. Start the Development Server

```bash
npm run dev
# App runs at http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js in development mode |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run test suite |

---

## 🔑 Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgres://user:pass@host:port/dbname

# Stripe (Billing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# OpenAI (AI Features)
OPENAI_API_KEY=sk-xxxxxxxx

# Vapi (Real-Time Sessions)
VAPI_API_KEY=your_vapi_api_key

# Brevo / Nodemailer (Email)
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=no-reply@orbitlearn.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# App
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
```

> ⚠️ Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secret keys in client bundles.

---

## 🗄️ Database Schema

### Core Tables

| Table | Key Columns | Description |
|-------|-------------|-------------|
| `users` | `id`, `email`, `role`, `org_id` | Auth profile + role metadata |
| `organizations` | `id`, `name`, `slug` | Multi-tenant support |
| `courses` | `id`, `title`, `author_id`, `org_id` | Course catalog |
| `lessons` | `id`, `course_id`, `content`, `content_type` | Lesson content |
| `sessions` | `id`, `lesson_id`, `vapi_room_id`, `host_id`, `starts_at`, `ends_at` | Live teaching sessions |
| `attendances` | `session_id`, `user_id`, `join_time`, `leave_time` | Session participation |
| `quizzes` | `id`, `session_id`, `questions` (JSON), `generated_at` | AI-generated quizzes |
| `summaries` | `id`, `session_id`, `summary_text`, `generated_at` | AI session summaries |
| `subscriptions` | `user_id`, `stripe_subscription_id`, `status`, `tier` | Billing status |
| `webhook_events` | `event_id`, `source`, `processed_at` | Idempotency tracking |

> Add indices on all foreign keys and frequently queried columns (`status`, `org_id`, `session_id`).

---

## 💳 Stripe Integration

1. Create **Free / Pro / Team** products and prices in your Stripe dashboard
2. Use **Stripe Checkout** for purchase flows
3. Implement the webhook handler at `/api/webhooks/stripe`:

```ts
// Key events to handle:
invoice.paid                        // Activate/renew subscription
customer.subscription.updated       // Tier change
customer.subscription.deleted       // Cancellation / expiry
```

4. Update the `subscriptions` table based on webhook payloads
5. Use middleware to gate premium routes based on subscription status

**Security:** Always verify webhook signatures using `STRIPE_WEBHOOK_SECRET` and never trust client-provided subscription status.

---

## 🎙️ Vapi Sessions

1. Server creates a **short-lived access token** for each Vapi room
2. `vapi_room_id` is stored in the `sessions` table
3. Client joins room using the Vapi SDK with the access token
4. Vapi webhooks trigger summary generation and recording delivery on `session.ended`
5. Supabase Realtime handles lightweight state — chat, attendance list, polls

---

## 🤖 AI Features

### Quiz Generation

**Endpoint:** `POST /api/ai/generate-quiz`

```json
// Request
{ "lessonText": "...", "numQuestions": 5 }

// Response (stored in quizzes table)
{
  "questions": [
    {
      "question": "What is...",
      "options": ["A", "B", "C", "D"],
      "correct_index": 2,
      "explanation": "Because..."
    }
  ]
}
```

Use a JSON schema in your prompt to ensure reliably structured output from OpenAI.

### Session Summaries

- Triggered automatically on `session.ended` webhook (or on-demand)
- Input: Vapi transcript or Realtime chat log
- Output: Markdown summary stored in `summaries`, then emailed to all attendees

---

## 📂 Project Structure

```
orbitlearn/
├── public/                          # Static assets
├── src/
│   └── app/                         # Next.js App Router
│       ├── api/                     # API route handlers
│       ├── companions/              # Companions feature pages
│       ├── my-journey/             # User journey / progress pages
│       ├── pricing/                 # Pricing page
│       ├── quiz/                    # Quiz feature pages
│       ├── sentry-example-page/     # Sentry error monitoring example
│       ├── sign-in/[[...sign-in]]/  # Clerk catch-all auth route
│       ├── subscription/            # Subscription management pages
│       ├── viewsummary/             # Session summary viewer
│       ├── favicon.ico
│       ├── global-error.tsx         # Global error boundary
│       ├── globals.css              # Global styles
│       ├── layout.tsx               # Root layout
│       └── page.tsx                 # Home page
├── components/                      # Reusable UI components
├── constants/                       # App-wide constants
├── lib/                             # Utilities, DB clients, helpers
├── types/                           # TypeScript type definitions
├── instrumentation-client.ts        # Sentry client instrumentation
├── instrumentation.ts               # Sentry server instrumentation
├── middleware.ts                    # Auth & route protection middleware
├── .gitignore
├── components.json                  # shadcn/ui config
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── sentry.edge.config.ts            # Sentry edge runtime config
├── sentry.server.config.ts          # Sentry server config
└── README.md
```

---

## 🚢 Deployment

1. **Host on Vercel** — automatic serverless function support and Next.js optimizations
2. **Supabase** — managed Postgres, Auth, and Realtime (no extra infrastructure needed)
3. Set all environment variables in your Vercel project settings
4. Point **Stripe webhooks** to `https://yourdomain.com/api/webhooks/stripe`
5. Point **Vapi webhooks** to `https://yourdomain.com/api/webhooks/vapi`

---

## 🧪 Testing & CI

- Unit tests for AI prompt templates and API route logic via **Jest** or **Vitest**
- Integration tests for webhooks using mocked Stripe and Vapi payloads
- **GitHub Actions** pipeline for lint → test → deploy on every PR

---

## 🛣️ Roadmap

- [ ] Live whiteboard and breakout rooms
- [ ] In-session collaborative document editing
- [ ] Advanced analytics (engagement, completion rates, quiz performance)
- [ ] Mobile clients (React Native)
- [ ] Native recording playback with captions
- [ ] Custom email template builder

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the coding style — **Prettier + ESLint** enforced
4. Add tests for new features and update relevant docs
5. Open a Pull Request with a clear description of changes

Please open an issue first to discuss significant changes or new features.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ using Next.js, Supabase & OpenAI · [Report a Bug](https://github.com/<your-org>/orbitlearn/issues) · [Request a Feature](https://github.com/<your-org>/orbitlearn/issues)

</div>
