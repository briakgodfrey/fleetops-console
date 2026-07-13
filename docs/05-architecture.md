# Architecture

## Stack

- **Client**: React 18 + TypeScript + Vite, React Router, TanStack Query for server state, Recharts for charts, Zod for form validation shared with backend types
- **API**: Node + Express + TypeScript, Mongoose (MongoDB), Zod for request validation, JWT (access + refresh) for auth
- **Database**: MongoDB (document model fits Asset's variable metadata across types better than a fixed relational schema, and audit log documents are naturally append-only)
- **Infra**: Docker Compose for local dev (mongo + api + client), GitHub Actions CI, deploy target Render/Railway (API) + Vercel (client)

## Why MongoDB over SQL here

Assets vary in shape depending on type (a pallet has different metadata than a container), so a flexible document schema avoids either a wide sparse SQL table or a full EAV pattern. AuditLog is pure append-only event data, which also fits a document store well. This is a deliberate trade-off, not a default: for a project demonstrating relational modeling and complex joins, Postgres would be the better choice (see the separate FastAPI/PostgreSQL Inventory API project for that side of the range).

## Auth model

- Access token: short-lived (15 min), sent in `Authorization: Bearer`
- Refresh token: long-lived (7 days), httpOnly cookie, rotated on use, stored hashed server-side so a stolen DB dump doesn't yield usable tokens
- RBAC: role stored on the JWT payload, checked in middleware per-route, never trusted from client-supplied data

## Request flow

```
Client (React) --fetch--> Express routes --> middleware (auth -> rbac -> validate) --> controller --> Mongoose model --> MongoDB
                                                                                      \-> AuditLog write (on any mutation)
```

## Key trade-offs / what I'd revisit with more time

- Polling-based "recent activity" feed rather than websockets — simpler, sufficient for the use case, would revisit for true real-time needs
- No soft-delete on Asset yet — audit log preserves history, but a deleted asset currently disappears from the list entirely, which is a gap worth closing before this became a real internal tool
- Role model is flat (3 roles); a real deployment would likely need per-region or per-team scoping, which this schema doesn't yet support
