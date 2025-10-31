import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  toggleUserStatus,
} from "../controllers/adminController.js";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Tất cả routes này chỉ dành cho Admin
router.use(verifyToken);
router.use(checkRole(["admin"]));

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Role & Status Management
router.patch("/users/:id/role", changeUserRole);
router.patch("/users/:id/toggle-status", toggleUserStatus);

export default router;

