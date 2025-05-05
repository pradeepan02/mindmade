import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Home,
  FileText,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Calendar,
  Briefcase,
  PlusCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  TrendingUp,
  Clock,
  Award,
  Coffee,
} from "lucide-react";

const EmployeeHome = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [myLeaves, setMyLeaves] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    name: "Loading...",
    position: "",
    department: "",
    email: "",
  });
  const navigate = useNavigate();

  const fetchEmployeeProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/auth/employee/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployeeData(response.data);
    } catch (err) {
      console.error("Failed to fetch employee profile:", err);
      setError("Failed to load profile data");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch all data in parallel
      const [statsRes, leavesRes, projectsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/employee/stats", config),
        axios.get("http://localhost:5000/api/leaves/my-leaves", config),
        axios.get("http://localhost:5000/api/projects/employee", config),
      ]);

      setStats([
        {
          title: "Total Leaves",
          value: statsRes.data.totalLeaves || 0,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          icon: Calendar,
        },
        {
          title: "Pending Leaves",
          value: statsRes.data.pendingLeaves || 0,
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
          icon: Clock,
        },
        {
          title: "Approved Leaves",
          value: statsRes.data.approvedLeaves || 0,
          color: "text-green-500",
          bgColor: "bg-green-100",
          icon: CheckCircle,
        },
        {
          title: "Remaining Leaves",
          value: statsRes.data.remainingLeaves || 0,
          color: "text-purple-500",
          bgColor: "bg-purple-100",
          icon: Coffee,
        },
      ]);

      setMyLeaves(leavesRes.data || []);
      setMyProjects(projectsRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch data"
      );
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeProfile();
    fetchData();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
  };

  const handleCreateLeave = () => {
    navigate("/create-leave");
  };

  const handleCancelLeave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.delete(`http://localhost:5000/api/leaves/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyLeaves(myLeaves.filter((leave) => leave._id !== id));
      setSuccess("Leave request cancelled successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Cancel leave error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to cancel leave"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatDate = (dateString) => {
    try {
      return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
    } catch {
      return "Invalid date";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "planning":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
  };

  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    const totalDuration = end - start;
    const elapsed = today - start;

    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;

    return Math.round((elapsed / totalDuration) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg z-10">
        <div className="p-6 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <Briefcase className="mr-2" size={22} />
            Employee Portal
          </h2>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 blur-sm opacity-70"></div>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  employeeData.name
                )}&background=random&color=fff`}
                alt={employeeData.name}
                className="relative rounded-full h-24 w-24 object-cover border-4 border-white shadow-md"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-5 h-5 border-2 border-white"></div>
            </div>
          </div>
          <p className="text-center mb-1 font-semibold text-gray-800 text-lg">
            {employeeData.name}
          </p>
          {employeeData.position && (
            <p className="text-center text-blue-600 font-medium">
              {employeeData.position}
            </p>
          )}
          {employeeData.department && (
            <p className="text-center text-sm text-gray-600 mt-1">
              {employeeData.department}
            </p>
          )}
        </div>
        <nav className="mt-6">
          <button
            onClick={() => handleTabChange("dashboard")}
            className={`flex items-center w-full p-4 text-left ${
              activeTab === "dashboard"
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <Home size={18} className="mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => handleTabChange("leaves")}
            className={`flex items-center w-full p-4 text-left ${
              activeTab === "leaves"
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <Calendar size={18} className="mr-3" />
            My Leaves
          </button>
          <button
            onClick={() => handleTabChange("projects")}
            className={`flex items-center w-full p-4 text-left ${
              activeTab === "projects"
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-medium"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <Briefcase size={18} className="mr-3" />
            My Projects
          </button>
          <button
            onClick={handleCreateLeave}
            className="flex items-center w-full p-4 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            <PlusCircle size={18} className="mr-3" />
            Request Leave
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === "dashboard" && "Employee Dashboard"}
              {activeTab === "leaves" && "My Leave Requests"}
              {activeTab === "projects" && "My Projects"}
            </h1>
            <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 bg-gray-100 hover:bg-gray-200 rounded-full py-2 px-4 transition-colors"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    employeeData.name
                  )}&background=random&color=fff`}
                  alt="User"
                  className="h-8 w-8 rounded-full"
                />
                <span className="font-medium text-gray-700">
                  {employeeData.name}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-600 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center border border-red-200 shadow-sm">
              <AlertCircle className="mr-3" size={20} />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center border border-green-200 shadow-sm">
              <CheckCircle className="mr-3" size={20} />
              {success}
            </div>
          )}

          {activeTab === "dashboard" && (
            <div>
              {/* Welcome section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome back, {employeeData.name.split(" ")[0]}!
                </h2>
                <p className="text-gray-600">
                  Here's what's happening with your requests and projects.
                </p>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center">
                      <div className={`rounded-full p-3 ${stat.bgColor}`}>
                        <stat.icon className={stat.color} size={24} />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-gray-500 text-sm font-medium">
                          {stat.title}
                        </h3>
                        <p className="text-3xl font-bold text-gray-800">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                {/* Recent leave requests */}
                <div className="bg-white rounded-xl shadow-sm lg:col-span-3 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="p-6 border-b flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="text-blue-600 mr-3" size={22} />
                      <h2 className="font-bold text-lg text-gray-800">
                        My Recent Leave Requests
                      </h2>
                    </div>
                    <button
                      onClick={() => handleTabChange("leaves")}
                      className="text-blue-600 text-sm font-medium hover:underline flex items-center"
                    >
                      View All
                      <ChevronDown className="ml-1 rotate-270" size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    {myLeaves.length > 0 ? (
                      myLeaves.slice(0, 3).map((leave) => (
                        <div
                          key={leave._id}
                          className="border-b last:border-b-0 p-4 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <div className="flex justify-between mb-2">
                            <div>
                              <h3 className="font-medium capitalize text-gray-800">
                                {leave.leaveType || "Leave"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {leave.reason || "No reason provided"}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                              {formatDate(leave.startDate)} to{" "}
                              {formatDate(leave.endDate)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                leave.status
                              )}`}
                            >
                              {leave.status || "pending"}
                            </span>
                            {leave.status === "pending" && (
                              <button
                                onClick={() => handleCancelLeave(leave._id)}
                                className="text-sm px-4 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium border border-red-200"
                              >
                                Cancel Request
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Calendar className="text-gray-400 mb-3" size={40} />
                        <p className="text-gray-500 mb-2">
                          No leave requests found
                        </p>
                        <button
                          onClick={handleCreateLeave}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Request Leave
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-white rounded-xl shadow-sm lg:col-span-2 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="p-6 border-b">
                    <div className="flex items-center">
                      <TrendingUp className="text-blue-600 mr-3" size={22} />
                      <h2 className="font-bold text-lg text-gray-800">
                        Your Progress
                      </h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-gray-700">
                          Current Projects
                        </h3>
                        <span className="text-blue-600 font-medium">
                          {
                            myProjects.filter((p) => p.status === "ongoing")
                              .length
                          }{" "}
                          Active
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              myProjects.filter((p) => p.status === "ongoing")
                                .length * 10
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-gray-700">
                          Leave Balance
                        </h3>
                        <span className="text-blue-600 font-medium">
                          {stats.find((s) => s.title === "Remaining Leaves")
                            ?.value || 0}{" "}
                          Days
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (stats.find((s) => s.title === "Remaining Leaves")
                                ?.value || 0) * 5
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-start">
                        <Award className="text-blue-600 mt-1 mr-3" size={20} />
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">
                            Employee Highlight
                          </h4>
                          <p className="text-sm text-gray-600">
                            You've completed{" "}
                            {
                              myProjects.filter((p) => p.status === "completed")
                                .length
                            }{" "}
                            projects this year. Keep up the great work!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current projects */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <Briefcase className="text-blue-600 mr-3" size={22} />
                    <h2 className="font-bold text-lg text-gray-800">
                      My Current Projects
                    </h2>
                  </div>
                  <button
                    onClick={() => handleTabChange("projects")}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center"
                  >
                    View All
                    <ChevronDown className="ml-1 rotate-270" size={16} />
                  </button>
                </div>
                <div className="p-4">
                  {myProjects.filter((p) => p.status === "ongoing").length >
                  0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {myProjects
                        .filter((p) => p.status === "ongoing")
                        .slice(0, 3)
                        .map((project) => (
                          <div
                            key={project._id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-200"
                          >
                            <div className="flex justify-between mb-3">
                              <div>
                                <h3 className="font-medium text-gray-800">
                                  {project.name || "Unnamed Project"}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {project.client || "No client specified"}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium h-fit ${getStatusBadgeClass(
                                  project.status
                                )}`}
                              >
                                {project.status}
                              </span>
                            </div>

                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">
                                  {calculateProgress(
                                    project.startDate,
                                    project.endDate
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{
                                    width: `${calculateProgress(
                                      project.startDate,
                                      project.endDate
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600 mb-4">
                              <div>
                                <p className="mb-1">Start Date</p>
                                <p className="font-medium text-gray-800">
                                  {formatDate(project.startDate)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="mb-1">End Date</p>
                                <p className="font-medium text-gray-800">
                                  {project.endDate
                                    ? formatDate(project.endDate)
                                    : "Ongoing"}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                navigate(`/projects/${project._id}`)
                              }
                              className="w-full text-center py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                            >
                              View Details
                            </button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Briefcase className="text-gray-400 mb-3" size={48} />
                      <p className="text-gray-600 mb-1">
                        No ongoing projects at the moment
                      </p>
                      <p className="text-sm text-gray-500">
                        Your upcoming projects will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "leaves" && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <Calendar className="text-blue-600 mr-3" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">
                    My Leave History
                  </h2>
                </div>
                <button
                  onClick={handleCreateLeave}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center shadow-sm transition-colors"
                >
                  <PlusCircle size={18} className="mr-2" />
                  New Leave Request
                </button>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                <div className="flex flex-wrap gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex-1 min-w-fit">
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <div className="flex items-center">
                        <stat.icon className={stat.color} size={20} />
                        <span className="text-xl font-bold ml-2 text-gray-800">
                          {stat.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-600 border-b">
                      <th className="px-4 py-3 rounded-tl-lg font-medium">
                        Leave Type
                      </th>
                      <th className="px-4 py-3 font-medium">Duration</th>
                      <th className="px-4 py-3 font-medium">Reason</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 rounded-tr-lg font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLeaves.length > 0 ? (
                      myLeaves.map((leave) => (
                        <tr
                          key={leave._id}
                          className="border-b last:border-b-0 hover:bg-blue-50"
                        >
                          <td className="px-4 py-4 capitalize font-medium text-gray-800">
                            {leave.leaveType || "Leave"}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="text-gray-800">
                                {formatDate(leave.startDate)} -{" "}
                                {formatDate(leave.endDate)}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                {Math.ceil(
                                  (new Date(leave.endDate) -
                                    new Date(leave.startDate)) /
                                    (1000 * 60 * 60 * 24)
                                ) || 1}{" "}
                                day(s)
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="max-w-xs">
                              <p className="text-gray-700 truncate">
                                {leave.reason || "No reason provided"}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                leave.status
                              )}`}
                            >
                              {leave.status || "pending"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {leave.status === "pending" ? (
                              <button
                                onClick={() => handleCancelLeave(leave._id)}
                                className="px-3 py-1 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                              >
                                Cancel
                              </button>
                            ) : (
                              <button className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                                Details
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-12 text-center">
                          <div className="flex flex-col items-center">
                            <Calendar
                              className="text-gray-300 mb-3"
                              size={48}
                            />
                            <p className="text-gray-500 mb-4">
                              No leave requests found
                            </p>
                            <button
                              onClick={handleCreateLeave}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm"
                            >
                              Create New Leave Request
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <Briefcase className="text-blue-600 mr-3" size={24} />
                    <h2 className="text-2xl font-bold text-gray-800">
                      My Projects
                    </h2>
                  </div>
                  <div className="flex space-x-3">
                    <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white">
                      <option>All Status</option>
                      <option>Ongoing</option>
                      <option>Completed</option>
                      <option>Planning</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {["ongoing", "completed", "planning"].map((status) => (
                    <div
                      key={status}
                      className={`bg-white rounded-lg p-5 border-l-4 shadow-sm border ${
                        status === "completed"
                          ? "border-green-500 bg-green-50"
                          : status === "ongoing"
                          ? "border-blue-500 bg-blue-50"
                          : "border-yellow-500 bg-yellow-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-gray-700 text-sm font-medium capitalize">
                            {status} Projects
                          </h3>
                          <p className="text-3xl font-bold text-gray-800 mt-1">
                            {
                              myProjects.filter((p) => p.status === status)
                                .length
                            }
                          </p>
                        </div>
                        <div
                          className={`rounded-full p-3 ${
                            status === "completed"
                              ? "bg-green-100"
                              : status === "ongoing"
                              ? "bg-blue-100"
                              : "bg-yellow-100"
                          }`}
                        >
                          {status === "completed" ? (
                            <CheckCircle className="text-green-600" size={22} />
                          ) : status === "ongoing" ? (
                            <TrendingUp className="text-blue-600" size={22} />
                          ) : (
                            <Clock className="text-yellow-600" size={22} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left text-gray-600 border-b">
                        <th className="px-4 py-3 rounded-tl-lg font-medium">
                          Project Name
                        </th>
                        <th className="px-4 py-3 font-medium">Client</th>
                        <th className="px-4 py-3 font-medium">Timeline</th>
                        <th className="px-4 py-3 font-medium">Progress</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 rounded-tr-lg font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {myProjects.length > 0 ? (
                        myProjects.map((project) => (
                          <tr
                            key={project._id}
                            className="border-b last:border-b-0 hover:bg-blue-50"
                          >
                            <td className="px-4 py-4 font-medium text-gray-800">
                              {project.name || "Unnamed Project"}
                            </td>
                            <td className="px-4 py-4 text-gray-700">
                              {project.client || "N/A"}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col">
                                <span className="text-gray-800">
                                  {formatDate(project.startDate)}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                  to{" "}
                                  {project.endDate
                                    ? formatDate(project.endDate)
                                    : "Ongoing"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    project.status === "completed"
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                                  }`}
                                  style={{
                                    width: `${calculateProgress(
                                      project.startDate,
                                      project.endDate
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">
                                {calculateProgress(
                                  project.startDate,
                                  project.endDate
                                )}
                                % complete
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                  project.status
                                )}`}
                              >
                                {project.status || "ongoing"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() =>
                                  navigate(`/projects/${project._id}`)
                                }
                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-12 text-center">
                            <div className="flex flex-col items-center">
                              <Briefcase
                                className="text-gray-300 mb-3"
                                size={48}
                              />
                              <p className="text-gray-500 mb-2">
                                No projects assigned yet
                              </p>
                              <p className="text-sm text-gray-500">
                                Projects you are assigned to will appear here
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeHome;
