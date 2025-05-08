const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  createUser,
  getDashboardStats,
  getEmployeeStats,
  getEmployeeProfile,
  deleteUser,
  getEmployeeById,
  updateUser
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/users", protect, admin, getAllUsers);
router.post("/users", protect, admin, createUser);
router.get("/dashboard/stats", protect, admin, getDashboardStats);
router.get("/employee/stats", protect, getEmployeeStats);
router.get("/employee/profile", protect, getEmployeeProfile);
router.delete("/users/:id", protect, admin, deleteUser);
router.get("/users/:id", protect, admin, getEmployeeById);
router.put("/users/:id", protect, admin, updateUser);
module.exports = router;
