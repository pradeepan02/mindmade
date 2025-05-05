const express = require("express");
const {
  createProject,
  getAllProjects,
  getEmployeeProjects,
  updateProject,
  assignEmployee,
  getProjectStats,
  getProjectsByEmployee,
  getProjectById,
  removeEmployee,
  deleteProject
} = require("../controllers/projectController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, admin, createProject);
router.get("/", protect, getAllProjects);
router.get("/employee", protect, getEmployeeProjects);
router.put("/:id", protect, admin, updateProject);
router.post("/:projectId/assign/:employeeId", protect, admin, assignEmployee);
router.post("/:projectId/remove/:employeeId", protect, admin, removeEmployee);
router.get("/stats", protect, admin, getProjectStats);
router.get("/employee/:id", protect, admin, getProjectsByEmployee);
router.get("/:id", protect, getProjectById);
router.delete("/:id", protect, admin, deleteProject);
module.exports = router;
