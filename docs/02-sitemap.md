# Sitemap & User Flows

## Sitemap

```
/                        -> redirect to /dashboard or /login
/login                   -> Login
/dashboard               -> Dashboard (metrics, charts)          [all roles]
/assets                  -> Asset list (search, filter, paginate) [all roles]
/assets/:id              -> Asset detail + status timeline        [all roles]
/assets/:id/edit         -> Edit asset / change status             [operator, admin]
/assets/new              -> Create asset                           [operator, admin]
/admin/users             -> User management                        [admin only]
```

## Critical user flows

**Flow 1: Operator resolves a delayed shipment**
1. Log in -> land on Dashboard
2. See "3 delayed" metric card, click through
3. Filtered Asset list shows the 3 delayed assets
4. Click into one -> Asset detail shows status timeline
5. Update status to `exception` with a note
6. Timeline updates, AuditLog entry created, dashboard count updates

**Flow 2: Manager reviews weekly trend**
1. Log in -> Dashboard
2. Adjust date range on trend chart
3. Compare delay rate week over week
4. Export or screenshot for a standup

**Flow 3: Admin onboards a new operator**
1. Log in -> Admin > Users
2. Create user, assign `operator` role
3. New user logs in, sees operator-scoped nav (no Admin link)

## Route access matrix

| Route | Viewer | Operator | Admin |
|---|---|---|---|
| /dashboard | read | read | read |
| /assets | read | read | read |
| /assets/:id | read | read | read |
| /assets/new | - | write | write |
| /assets/:id/edit | - | write | write |
| /admin/users | - | - | write |
