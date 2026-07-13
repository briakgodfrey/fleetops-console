import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { listUsers, updateUserRole } from "../controllers/user.controller";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/", listUsers);
router.patch("/:id/role", updateUserRole);

export default router;
