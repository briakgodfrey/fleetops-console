# FleetOps Console — Phased Build Plan

A 4-week plan for building this project as a real end-to-end case study: discovery and design first, then implementation, then hardening and deployment. Each phase produces an artifact you can point to in an interview or portfolio write-up, not just working code.

Timebox: ~10-12 hours/week around your existing schedule. If a phase runs long, cut scope inside that phase rather than compressing later phases; the design and security phases are what differentiate this project, so they shouldn't be the first things dropped.

---

## Phase 0 — Discovery (weekend, before Week 1)

Goal: decide what the product actually is before opening an editor.

- [ ] Write a one-paragraph problem statement: who uses this, what decision are they trying to make, what's the single most important screen
- [ ] Define 3 user roles and what each one is blocked from doing (this drives your RBAC model later)
- [ ] List the 5-8 core entities and their state transitions (e.g. an asset moves: `pending -> in_transit -> delayed -> delivered` or `-> exception`)
- [ ] Write down what you will explicitly NOT build (scope fence). Example: no real-time GPS integration, no payment/billing, no mobile app

Artifact: `docs/01-discovery.md`

---

## Phase 1 — Design (Week 1)

Goal: produce the design artifacts a hiring manager for a "Web and Digital Interface Designer" role would actually want to see, before any backend/frontend code exists.

- [ ] Sitemap: every screen/route and how they connect (`docs/02-sitemap.md`)
- [ ] User flows: 2-3 critical paths as step lists or a simple flow diagram (login -> dashboard -> drill into asset -> update status -> see audit trail)
- [ ] Low-fi wireframes for the 4 most important screens (paper, Excalidraw, or Figma — doesn't need to be pretty, needs to show layout decisions)
- [ ] Design system doc: color tokens, type scale, spacing scale, component states (default/hover/disabled/error) (`docs/04-design-system.md`)
- [ ] Hi-fi mockup of the dashboard screen only (this is your portfolio hero image later)

Artifact: `docs/` folder, plus exported mockup images for your portfolio site.

Why this phase exists even though you're a backend-leaning engineer: this specific posting explicitly asks for sitemaps, application models, and page templates. Most backend-track candidates skip straight to code and have nothing to show here. This phase is 20% of the time and probably 50% of what makes this project match the job description.

---

## Phase 2 — Backend Foundation (Week 2)

Goal: a working API with auth, RBAC, and one full resource, tested.

- [ ] Project scaffold: Express + TypeScript, folder structure (`config/middleware/models/routes/controllers`)
- [ ] MongoDB connection + Mongoose models: `User`, `Asset`, `AuditLog`
- [ ] Auth: register/login, JWT access + refresh token rotation, bcrypt password hashing
- [ ] RBAC middleware: role check per route (admin / operator / viewer)
- [ ] Asset CRUD with Zod request validation
- [ ] Audit logging: every state-changing action writes an `AuditLog` entry (who, what, when, before/after)
- [ ] Supertest coverage for auth and one full CRUD flow

Artifact: working API you can hit with Postman/Thunder Client, plus a passing test suite.

---

## Phase 3 — Frontend (Week 3)

Goal: build the screens from Phase 1's mockups, not new screens invented on the fly.

- [ ] React + TypeScript + Vite scaffold, routing (React Router)
- [ ] Auth flow: login page, protected routes, role-aware nav
- [ ] Dashboard: metrics cards + a Recharts chart (status breakdown, delay trend)
- [ ] Assets table: server-side pagination, filter by status/region, debounced search
- [ ] Asset detail view: status timeline (the audit trail rendered as a visual sequence, not a raw table)
- [ ] Admin panel: user list + role assignment (admin-only route)
- [ ] Apply the design system tokens from Phase 1 consistently (no ad hoc colors/spacing)

Artifact: a running app that matches the wireframes, deployed locally via Docker Compose.

---

## Phase 4 — Hardening, Docs, Deploy (Week 4)

Goal: make it look like something a team would actually run, and document the process end to end.

- [ ] Security pass: helmet, rate limiting on auth routes, input sanitization, dependency audit (`docs/06-security.md` as a short threat-model note — this ties directly to your appsec direction)
- [ ] CI: GitHub Actions running lint + test + build on every push
- [ ] Docker Compose: one command spins up mongo + api + client
- [ ] Deploy: API to Render/Railway, client to Vercel/Netlify, or both via Docker to a small VPS
- [ ] Write the case-study README: problem -> design decisions -> architecture -> trade-offs -> what you'd do with more time
- [ ] Take screenshots of every major screen for your portfolio site and blog

Artifact: live demo link + polished README + a briabytes.com post walking through the process (you already have the platform for this).

---

## What "done" looks like

A reviewer should be able to: read the README problem statement, look at 2-3 design artifacts, click a live demo, log in as different roles and see different permissions, and read a short security note. That combination (design process + working full-stack app + basic security posture) is the actual signal this kind of role is screening for, more than any single technical choice inside the stack.
