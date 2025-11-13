# Orbitlearn

Orbitlearn is a full-featured LMS (Learning Management System) SaaS application built with **Next.js**, **Supabase**, and **Stripe**. It provides real-time interactive teaching sessions powered by **Vapi**, an AI vocal agent for voice-driven interactions, and AI-driven quiz generation + automated session summaries using the **OpenAI** API. Post-session emails are sent with **Brevo (Sendinblue)** and **Nodemailer** where appropriate. Orbitlearn is designed for multi-tenant SaaS usage with subscription management, secure authentication, and modern developer DX.

---

## Table of contents

* [Key features](#key-features)
* [Tech stack](#tech-stack)
* [High-level architecture](#high-level-architecture)
* [Setup (Developer)](#setup-developer)
* [Environment variables](#environment-variables)
* [Database & models](#database--models)
* [Authentication & Authorization](#authentication--authorization)
* [Subscriptions & Payments](#subscriptions--payments)
* [Real-time sessions with Vapi](#real-time-sessions-with-vapi)
* [AI features](#ai-features)
* [Email notifications](#email-notifications)
* [Deployment](#deployment)
* [Testing & CI](#testing--ci)
* [Roadmap / Future features](#roadmap--future-features)
* [Contributing](#contributing)
* [License](#license)

---

## Key features

* User sign-up / sign-in with Supabase Auth
* Tiered subscriptions handled via Stripe (free / pro / team)
* Real-time video/audio teaching sessions (Vapi) with session recording and attendance
* AI vocal agent for voice-enabled tutors / assistants
* Automatic quiz generation using OpenAI from course content
* Post-session summary generation (OpenAI) and email delivery (Brevo + Nodemailer)
* Interactive quizzes and in-session polls
* Admin dashboard for course, session, and user management
* Webhooks for Stripe, Supabase realtime events, and Vapi events

## Tech stack

* Frontend: Next.js (App Router), React, Tailwind CSS
* Backend: Next.js API Routes / Server Actions, Supabase (Postgres + Realtime + Storage)
* Payments: Stripe (Checkout + Webhooks)
* Realtime/RTC: Vapi (session signaling, room management, optional SFU)
* AI: OpenAI (GPT models) for quiz generation and summaries
* Email: Brevo (Sendinblue) API and Nodemailer fallback
* CI / CD: GitHub Actions, Vercel / Cloud provider for hosting

## High-level architecture

1. **Auth & DB**: Supabase handles authentication and stores user, course, session, and subscription metadata in Postgres.
2. **Payments**: Stripe handles payment checkout; Stripe webhooks update subscription status in Supabase.
3. **Realtime**: Vapi manages live sessions (rooms, signaling). Supabase realtime can be used for presence, chat, and lightweight state sync.
4. **AI**: OpenAI is used to generate quizzes and session summaries on-demand. Generated artifacts are stored in Supabase and sent by email.
5. **Email**: Brevo is used for transactional emails; Nodemailer used for server-side internal notifications or as fallback.

---

## Setup (Developer)

1. Clone the repo:

```bash
git clone https://github.com/<your-org>/orbitlearn.git
cd orbitlearn
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` (see [Environment variables](#environment-variables))
4. Run database migrations / seeds (uses Supabase SQL or your preferred migration tool)
5. Start dev server:

```bash
npm run dev
# opens at http://localhost:3000
```

### Useful scripts

* `npm run dev` — start Next.js in development
* `npm run build` — build for production
* `npm run start` — start production server
* `npm run lint` — lint code
* `npm run test` — run tests

## Environment variables

Create `.env.local` with at least the following keys (replace placeholders):

```
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgres://user:pass@host:port/dbname
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
OPENAI_API_KEY=sk-xxxxxxxx
VAPI_API_KEY=your_vapi_api_key
BREVO_API_KEY=brevo_api_key
EMAIL_FROM=no-reply@orbitlearn.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=smtp-user
SMTP_PASS=smtp-pass
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=some-secret-if-needed
```

> NOTE: Keep secret keys out of client bundles. Only expose `NEXT_PUBLIC_` keys to the browser.

## Database & models

Suggested core tables:

* `users` (supabase auth + profile table)
* `organizations` (for multi-tenant support)
* `courses` (title, description, author_id)
* `lessons` (course_id, content, content_type)
* `sessions` (lesson_id, starts_at, ends_at, vapi_room_id, host_id)
* `attendances` (session_id, user_id, join_time, leave_time)
* `quizzes` (session_id | lesson_id, questions (json), generated_at)
* `subscriptions` (user_id, stripe_subscription_id, status, tier)
* `summaries` (session_id, summary_text, generated_at)

Include indices on foreign keys and frequently queried columns.

## Authentication & Authorization

* Use Supabase Auth (email/password, social providers if needed).
* Store role and organization metadata in the `users` profile.
* Protect server-side APIs by verifying Supabase JWT or Service Role key where necessary.

## Subscriptions & Payments

1. Create products & prices in Stripe dashboard (Free / Pro / Team).
2. Use Stripe Checkout for purchase flows and create a Subscription.
3. Implement a webhook endpoint `/api/webhooks/stripe` to listen for events such as `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. Update the `subscriptions` table in Supabase based on webhook events.
5. Use middleware to gate paid routes and features based on subscription status.

Security tips:

* Verify webhook signatures (use `STRIPE_WEBHOOK_SECRET`).
* Store Stripe IDs in DB and never trust client-provided status without server verification.

## Real-time sessions with Vapi

* Use Vapi SDK on the client to create/join rooms. The server should create a short-lived access token for Vapi sessions.
* Persist `vapi_room_id` in the `sessions` table. Use webhooks from Vapi for events like `session.ended` or `recording.available`.
* Use Supabase realtime channels for chat, attendance list, and small state sync.

## AI features

**Quiz generation**

* Endpoint: `POST /api/ai/generate-quiz`
* Input: lesson text or session transcript + desired number of questions
* Flow: Call OpenAI with a prompt template that asks for structured JSON (questions, options, correct_index, explanation)
* Save generated quizzes to `quizzes` and return to client for rendering.

**Session summary**

* Trigger summary generation after session end or on-demand.
* Summaries stored in `summaries` and emailed to attendees.
* Consider using conversation transcripts (Vapi recordings or realtime chat) as input to OpenAI.

Prompt engineering: use explicit instructions and a JSON schema in your prompts to ensure reliably structured output.

## Email notifications

* Use Brevo API for transactional emails (session reminders, summaries). Use Nodemailer when SMTP is required or for internal notifications.
* Endpoints send templated HTML emails. Keep templates in `emails/` and use a render engine (e.g., Handlebars) or JSX email templates.

## Webhooks and reliability

* Handle idempotency: store event IDs (Stripe, Vapi) in `webhook_events` table to prevent double-processing.
* Retries: make webhook handlers idempotent and safe to re-run.

## Deployment

* Host frontend & server on Vercel (recommended) or any Node host. Ensure server functions can receive webhooks.
* Use Supabase for hosted Postgres and Auth.
* Configure environment variables in your hosting provider.
* Configure Stripe webhooks to point to your production URL.

## Testing & CI

* Unit test AI prompt templates and API routes using Jest or Vitest.
* Integration tests for webhooks (mock Stripe & Vapi events).
* Add GitHub Actions for linting, tests, and deployment.

## Roadmap / Future features

* Live whiteboard, breakout rooms, in-session co-editing
* Advanced analytics dashboard (engagement / completion rates)
* Mobile clients (React Native)
* Native recording storage and playback with captions

## Contributing

1. Fork and open a PR.
2. Follow the coding style (Prettier + ESLint).
3. Add tests for new features and update docs.

## License

MIT License — see `LICENSE` file.

---

If you want, I can also:

* Generate example `.sql` migration/seed files for the schema above
* Provide sample Next.js API route templates for Stripe and OpenAI integration
* Create email templates for session summary and reminders

Happy building — 🚀
