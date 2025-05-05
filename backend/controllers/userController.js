const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const Leave = require("../models/Leave");
const Department = require("../models/Department");
const Project = require("../models/projectModel");

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register new user
const registerUser = async (req, res) => {
  const { name, email, password, role, department, position, mobileNumber } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || "employee",
      department,
      position,
      mobileNumber,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        position: newUser.position,
      },
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (for HR dashboard)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new user (by admin)
const createUser = async (req, res) => {
  const { name, email, password, role, department, position, mobileNumber } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      department,
      position,
      mobileNumber,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments();
    const pendingLeaves = await Leave.countDocuments({ status: "pending" });
    const departments = await Department.countDocuments();
    const newJoins = await User.countDocuments({
      joinDate: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    });

    const projectStats = await Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = {
      totalEmployees,
      pendingLeaves,
      departments,
      newJoins,
      totalProjects: projectStats.reduce((acc, curr) => acc + curr.count, 0),
      projectStats: projectStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get employee dashboard stats
const getEmployeeStats = async (req, res) => {
  try {
    const totalLeaves = await Leave.countDocuments({ employee: req.user.id });
    const pendingLeaves = await Leave.countDocuments({
      employee: req.user.id,
      status: "pending",
    });
    const approvedLeaves = await Leave.countDocuments({
      employee: req.user.id,
      status: "approved",
    });
    const remainingLeaves = 20 - approvedLeaves;

    res.json({
      totalLeaves,
      pendingLeaves,
      approvedLeaves,
      remainingLeaves,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get employee profile
const getEmployeeProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("department", "name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department?.name || "Not assigned",
      position: user.position || "Not specified",
      mobileNumber: user.mobileNumber || "Not provided",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Prevent HR from deleting themselves
    if (req.user.id === req.params.id) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    // Check if user exists
    const user = await User.findById(req.params.id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is admin
    if (user.role === "hr") {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    // Delete all leaves associated with the employee
    await Leave.deleteMany({ employee: req.params.id }).session(session);

    // Remove employee from all projects and delete empty projects
    const projects = await Project.find({ employees: req.params.id }).session(
      session
    );
    for (const project of projects) {
      project.employees = project.employees.filter(
        (id) => id.toString() !== req.params.id
      );
      await project.save({ session });

      // Delete project if no employees left
      if (project.employees.length === 0) {
        await Project.findByIdAndDelete(project._id).session(session);
      }
    }

    // Delete the user
    await User.findByIdAndDelete(req.params.id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Employee and all associated data deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("department", "name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  createUser,
  getDashboardStats,
  getEmployeeStats,
  getEmployeeProfile,
  deleteUser,
  getEmployeeById,
};
