import express from "express";
import { getAllUsers, getUserById } from "../controllers/adminController.js";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Moderator chỉ có quyền xem (read-only)
router.use(verifyToken);
router.use(checkRole(["admin", "moderator"]));

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);

export default router;

