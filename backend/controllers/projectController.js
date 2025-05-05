const Project = require("../models/projectModel");
const User = require("../models/User");

// Create new project
const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "employees",
      "name email position"
    );
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("employees", "name email position department")
      .populate("client");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get projects for employee
const getEmployeeProjects = async (req, res) => {
  try {
    const projects = await Project.find({ employees: req.user.id })
      .populate("employees", "name")
      .sort({ status: 1, endDate: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update project
// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("employees", "name email position department");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Assign employee to project
const assignEmployee = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const employee = await User.findById(req.params.employeeId);

    if (!project || !employee) {
      return res.status(404).json({ message: "Project or employee not found" });
    }

    if (!project.employees.includes(req.params.employeeId)) {
      project.employees.push(req.params.employeeId);
      await project.save();
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove employee from project
const removeEmployee = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.employees = project.employees.filter(
      (empId) => empId.toString() !== req.params.employeeId
    );

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get project stats
const getProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({
      status: "completed",
    });
    const ongoingProjects = await Project.countDocuments({ status: "ongoing" });
    const planningProjects = await Project.countDocuments({
      status: "planning",
    });

    const revenueResult = await Project.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$revenue" } } },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalProjects,
      completedProjects,
      ongoingProjects,
      planningProjects,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get projects by employee ID
const getProjectsByEmployee = async (req, res) => {
  try {
    const projects = await Project.find({ employees: req.params.id })
      .sort({ status: 1, endDate: 1 })
      .populate("employees", "name");
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(204).end(); // No content response for successful deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createProject,
  getAllProjects,
  getEmployeeProjects,
  updateProject,
  assignEmployee,
  removeEmployee,
  getProjectStats,
  getProjectsByEmployee,
  getProjectById,
  deleteProject
};
