# Wireframes (low-fi)

These are layout decisions, not visual polish. Build these in Excalidraw/Figma before touching code; the ASCII versions below are for quick reference.

## Dashboard

```
+------------------------------------------------------------+
| FleetOps         [search]                    [role] [user] |
+---+----------------------------------------------------------+
|nav| Status Overview                                          |
|   | [Pending 12] [In Transit 48] [Delayed 3] [Exception 1]   |
|   |                                                          |
|   | Delay Trend (7/30/90d toggle)        Status Breakdown    |
|   | [--------- line chart ---------]     [--- donut ---]     |
|   |                                                          |
|   | Recent Activity (audit feed, last 10 actions)            |
|   | - [timestamp] operator1 moved FL-1042 -> delayed         |
+---+----------------------------------------------------------+
```

## Asset list

```
+------------------------------------------------------------+
| Assets                              [+ New Asset] (op/admin)|
| [search box] [status filter v] [region filter v]            |
+------------------------------------------------------------+
| REF CODE  | TYPE   | STATUS    | ORIGIN -> DEST  | UPDATED  |
| FL-1042   | pallet | delayed   | CLT -> ATL      | 2h ago   |
| FL-1041   | ...    | ...       | ...             | ...      |
+------------------------------------------------------------+
| < prev   page 3 of 40   next >                               |
```

## Asset detail

```
+------------------------------------------------------------+
| < Back to Assets            FL-1042            [Edit] (op)  |
+------------------------------------------------------------+
| Type: Pallet     Origin: CLT     Destination: ATL            |
| Status: DELAYED  Assigned: operator1                          |
|                                                                |
| Status Timeline (signature element)                           |
| pending o---o in_transit o=====> delayed  (current, pulsing)  |
|         2d ago      1d ago         3h ago                     |
|                                                                |
| Audit Log                                                     |
| - 3h ago  operator1  in_transit -> delayed  "weather hold"    |
| - 1d ago  operator1  pending -> in_transit                    |
+------------------------------------------------------------+
```

## Admin > Users

```
+------------------------------------------------------------+
| Users                                    [+ Invite User]     |
| NAME       | EMAIL              | ROLE      | ACTIONS         |
| J. Rivera  | j@ex.com           | operator  | [change role]   |
+------------------------------------------------------------+
```
