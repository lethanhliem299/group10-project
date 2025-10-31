import express from "express";
import {
  getAllLogs,
  getUserLogs,
  getMyLogs,
  getLogStats,
  clearOldLogs,
} from "../controllers/activityLogController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

// User routes - Xem logs của chính mình
router.get("/my-logs", authenticate, getMyLogs);

// Admin routes - Xem tất cả logs
router.get("/", authenticate, checkRole(["Admin"]), getAllLogs);
router.get("/user/:userId", authenticate, checkRole(["Admin"]), getUserLogs);
router.get("/stats", authenticate, checkRole(["Admin"]), getLogStats);
router.delete("/clear", authenticate, checkRole(["Admin"]), clearOldLogs);

export default router;

