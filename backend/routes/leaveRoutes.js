const express = require("express");
const {
  createLeave,
  getAllLeaves,
  getPendingLeaves,
  updateLeaveStatus,
  getMyLeaves,
  cancelLeave,
  getLeavesByEmployee,
} = require("../controllers/leaveController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/", protect, createLeave);
router.get("/", protect, admin, getAllLeaves);
router.get("/pending", protect, admin, getPendingLeaves);
router.put("/:id/status", protect, admin, updateLeaveStatus);
router.get("/my-leaves", protect, getMyLeaves);
router.delete("/:id", protect, cancelLeave);
router.get("/employee/:id", protect, admin, getLeavesByEmployee);

module.exports = router;