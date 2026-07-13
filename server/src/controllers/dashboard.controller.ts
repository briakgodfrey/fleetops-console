import { Response, NextFunction } from "express";
import { Asset } from "../models/Asset";
import { AuditLog } from "../models/AuditLog";
import { AuthedRequest } from "../middleware/auth";

export async function getStatusCounts(_req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const counts = await Asset.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    const result: Record<string, number> = {
      pending: 0,
      in_transit: 0,
      delayed: 0,
      delivered: 0,
      exception: 0,
    };
    counts.forEach((c) => {
      result[c._id] = c.count;
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getRecentActivity(_req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const activity = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("actorId", "name")
      .populate("assetId", "referenceCode");
    res.json(activity);
  } catch (err) {
    next(err);
  }
}
