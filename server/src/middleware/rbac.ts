import { Response, NextFunction } from "express";
import { AuthedRequest } from "./auth";
import { Role } from "../models/User";

// Role is always read from the verified JWT payload set by requireAuth,
// never from req.body or req.query — see docs/06-security.md.
export function requireRole(...allowed: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    if (!allowed.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions for this action" });
      return;
    }
    next();
  };
}
