import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getStatusCounts, getRecentActivity } from "../controllers/dashboard.controller";

const router = Router();

router.use(requireAuth);
router.get("/status-counts", getStatusCounts);
router.get("/recent-activity", getRecentActivity);

export default router;
