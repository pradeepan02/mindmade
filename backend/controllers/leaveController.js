const Leave = require("../models/Leave");
const User = require("../models/User");

// Create leave request
const createLeave = async (req, res) => {
  const { startDate, endDate, reason, leaveType } = req.body;

  try {
    if (new Date(startDate) > new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    const newLeave = new Leave({
      employee: req.user.id,
      startDate,
      endDate,
      reason,
      leaveType,
    });

    await newLeave.save();
    res.status(201).json(newLeave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all leaves (for HR)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "employee",
          foreignField: "_id",
          as: "employee"
        }
      },
      {
        $unwind: "$employee"
      },
      {
        $project: {
          "employee.password": 0
        }
      }
    ]);
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get pending leaves
const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.aggregate([
      {
        $match: { status: "pending" }
      },
      {
        $lookup: {
          from: "users",
          localField: "employee",
          foreignField: "_id",
          as: "employee"
        }
      },
      {
        $unwind: "$employee"
      },
      {
        $project: {
          "employee.password": 0
        }
      }
    ]);
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update leave status
const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = status;
    await leave.save();
    res.json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get leaves for current employee
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel leave request
const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findOne({
      _id: req.params.id,
      employee: req.user.id,
      status: "pending",
    });

    if (!leave) {
      return res
        .status(404)
        .json({ message: "Leave not found or cannot be canceled" });
    }

    await leave.remove();
    res.json({ message: "Leave request canceled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get leaves by employee ID
const getLeavesByEmployee = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.id })
      .sort({ startDate: -1 })
      .populate("employee", "name");
    res.json(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createLeave,
  getAllLeaves,
  getPendingLeaves,
  updateLeaveStatus,
  getMyLeaves,
  cancelLeave,
  getLeavesByEmployee,
};
