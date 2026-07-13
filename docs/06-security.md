# Security Notes (short threat model)

Scope: a single-tenant internal ops tool, not a public-facing consumer app. Threat model below is sized to that.

## Assets to protect

- User credentials and session tokens
- Asset/operations data (not regulated/PII-heavy, but integrity matters — a tampered status history undermines the audit trail's entire purpose)
- Admin capability (user/role management)

## Controls implemented

| Threat | Control |
|---|---|
| Credential stuffing / brute force on login | Rate limiting on `/auth/login` (express-rate-limit), account lockout after N failed attempts |
| Password compromise via DB leak | bcrypt hashing (cost factor 12), never logging raw passwords |
| Token theft / replay | Short-lived access tokens, rotated refresh tokens stored hashed, httpOnly + Secure + SameSite cookies |
| Privilege escalation via client tampering | Role checked server-side from JWT claim only, never trusted from request body |
| Injection (NoSQL) | Zod schema validation on every request body before it reaches Mongoose; Mongoose's own query builder (no raw `$where`/string-built queries) |
| XSS | React's default escaping, `helmet` CSP headers, no `dangerouslySetInnerHTML` usage |
| Dependency vulnerabilities | `npm audit` in CI, Dependabot enabled on the repo |
| Audit trail tampering | AuditLog is append-only at the application layer (no update/delete routes exposed for it); a production deployment would additionally restrict at the DB-role level |

## Explicit gaps / not addressed at this scope

- No WAF or DDoS-layer protection (would sit in front of this at a real deployment, not application-layer)
- No field-level encryption at rest (no regulated data in this dataset; would revisit if real PII were introduced)
- No formal pen test — this is a portfolio project, not a document I'd represent as audited

This document is intentionally short: it's meant to demonstrate the habit of writing a threat model before shipping, not to be exhaustive.
