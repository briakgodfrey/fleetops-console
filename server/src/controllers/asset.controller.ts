import { Response, NextFunction } from "express";
import { Asset } from "../models/Asset";
import { AuditLog } from "../models/AuditLog";
import { createAssetSchema, updateStatusSchema } from "../validators/asset.validator";
import { AuthedRequest } from "../middleware/auth";

export async function listAssets(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, search, page = "1", limit = "25" } = req.query as Record<string, string>;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 25, 1), 100);

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (search) filter.referenceCode = { $regex: search, $options: "i" };

    const [items, total] = await Promise.all([
      Asset.find(filter)
        .sort({ updatedAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Asset.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
}

export async function getAsset(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      res.status(404).json({ error: "Asset not found" });
      return;
    }
    const history = await AuditLog.find({ assetId: asset.id }).sort({ timestamp: 1 });
    res.json({ asset, history });
  } catch (err) {
    next(err);
  }
}

export async function createAsset(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createAssetSchema.parse(req.body);
    const asset = await Asset.create(input);

    await AuditLog.create({
      assetId: asset.id,
      actorId: req.user!.id,
      action: "created",
      after: asset.toObject(),
    });

    res.status(201).json(asset);
  } catch (err) {
    next(err);
  }
}

export async function updateAssetStatus(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = updateStatusSchema.parse(req.body);
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      res.status(404).json({ error: "Asset not found" });
      return;
    }

    const before = asset.toObject();
    asset.status = input.status;
    await asset.save();

    await AuditLog.create({
      assetId: asset.id,
      actorId: req.user!.id,
      action: "status_changed",
      before: { status: before.status },
      after: { status: asset.status },
      note: input.note,
    });

    res.json(asset);
  } catch (err) {
    next(err);
  }
}
