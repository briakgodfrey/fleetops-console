# Discovery

## Problem statement

Operations teams tracking assets or shipments across a network need a single place to see status at a glance, drill into any one unit's history, and act on exceptions before they become customer-facing problems. FleetOps Console gives an operator a live status board, gives a manager a trend view, and gives every action an audit trail.

## Roles

| Role | Can do | Cannot do |
|---|---|---|
| Admin | Everything, plus manage users and roles | N/A |
| Operator | Create/update assets, change status, view dashboard | Manage users, delete audit history |
| Viewer | Read-only access to dashboard and asset list | Create, update, or delete anything |

## Core entities

- **User**: id, name, email, passwordHash, role, createdAt
- **Asset**: id, referenceCode, type, origin, destination, status, assignedTo, createdAt, updatedAt
- **AuditLog**: id, assetId, action, actorId, before, after, timestamp
- **Status** (enum on Asset): `pending -> in_transit -> delayed | delivered`, `in_transit -> exception`

## Explicit scope fence (not building)

- No real-time GPS/telemetry ingestion (status changes are manual/API-driven, not live-tracked)
- No billing or payments
- No native mobile app (responsive web only)
- No third-party carrier integrations (mocked/seeded data only)
