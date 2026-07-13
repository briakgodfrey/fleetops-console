import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { listAssets, getAsset, createAsset, updateAssetStatus } from "../controllers/asset.controller";

const router = Router();

router.use(requireAuth);

router.get("/", listAssets);
router.get("/:id", getAsset);
router.post("/", requireRole("operator", "admin"), createAsset);
router.patch("/:id/status", requireRole("operator", "admin"), updateAssetStatus);

export default router;
