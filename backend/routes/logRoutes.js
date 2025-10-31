import express from "express";
import {
  getActivityLogs,
  getMyLogs,
  cleanupOldLogs,
  getActivityStats
} from "../controllers/activityLogController.js";
import verifyToken from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

// Admin only routes
router.get("/", verifyToken, checkRole(["admin"]), getActivityLogs);
router.get("/stats", verifyToken, checkRole(["admin"]), getActivityStats);
router.delete("/cleanup", verifyToken, checkRole(["admin"]), cleanupOldLogs);

// User can view their own logs
router.get("/my-logs", verifyToken, getMyLogs);

export default router;
