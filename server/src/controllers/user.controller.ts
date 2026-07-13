import { Response, NextFunction } from "express";
import { User } from "../models/User";
import { AuthedRequest } from "../middleware/auth";
import { updateRoleSchema } from "../validators/user.validator";

export async function listUsers(_req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await User.find().select("name email role createdAt").sort({ createdAt: 1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateRoleSchema.parse(req.body);
    const targetId = req.params.id;

    // Prevent an admin from locking themselves out by demoting their own only admin account.
    // This is a lightweight guard, not full last-admin protection across multiple admins.
    if (targetId === req.user!.id && input.role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        res.status(400).json({ error: "Cannot remove the last remaining admin account" });
        return;
      }
    }

    const user = await User.findByIdAndUpdate(
      targetId,
      { role: input.role },
      { new: true }
    ).select("name email role createdAt");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}
