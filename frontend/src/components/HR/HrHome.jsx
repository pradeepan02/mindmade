import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Home,
  PlusCircle,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Search,
  Calendar,
  Briefcase,
  Building,
  AlertCircle,
  Trash2,
  Edit,
  Eye,
  Settings,
  BarChart,
  Clock,
} from "lucide-react";

const HrHome = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leaves, setLeaves] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [stats, setStats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectStats, setProjectStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    planningProjects: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hrData, setHrData] = useState({
    name: "Loading...",
    position: "",
    department: "",
    email: "",
    _id: "",
  });
  const navigate = useNavigate();

  const fetchHrProfile = async () => {
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
      setHrData({
        ...response.data,
        _id: response.data.id,
      });
    } catch (err) {
      console.error("Failed to fetch HR profile:", err);
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

      // Fetch dashboard stats
      const statsResponse = await axios.get(
        "http://localhost:5000/api/auth/dashboard/stats",
        config
      );
      setStats([
        {
          title: "Total Employees",
          value: statsResponse.data.totalEmployees,
          icon: <Users className="text-blue-500" size={24} />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
        },
        {
          title: "Pending Leaves",
          value: statsResponse.data.pendingLeaves,
          icon: <FileText className="text-yellow-500" size={24} />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
        },
        {
          title: "Departments",
          value: statsResponse.data.departments,
          icon: <Building className="text-green-500" size={24} />,
          bgColor: "bg-green-100",
          textColor: "text-green-700",
        },
        {
          title: "New Joins",
          value: statsResponse.data.newJoins,
          icon: <PlusCircle className="text-purple-500" size={24} />,
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
        },
      ]);

      // Fetch leaves based on active tab
      let leavesEndpoint = "http://localhost:5000/api/leaves";
      if (activeTab === "dashboard") {
        leavesEndpoint += "/pending";
      }

      const leavesResponse = await axios.get(leavesEndpoint, config);
      setLeaves(leavesResponse.data);

      // Fetch recent employees
      const employeesResponse = await axios.get(
        "http://localhost:5000/api/auth/users",
        config
      );
      const employeesWithDefaults = employeesResponse.data.map((emp) => ({
        _id: emp._id,
        name: emp.name || "Unknown",
        email: emp.email || "",
        position: emp.position || "Not specified",
        department: emp.department || "Not specified",
        joinDate: emp.joinDate || new Date(),
        status: emp.status || "active",
      }));
      setRecentEmployees(employeesWithDefaults);

      // Fetch projects and project stats
      if (activeTab === "projects" || activeTab === "dashboard") {
        const [projectsRes, statsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/projects", config),
          axios.get("http://localhost:5000/api/projects/stats", config),
        ]);
        setProjects(projectsRes.data);
        setProjectStats(statsRes.data);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch data"
      );
      if (err.response?.status === 401) {
        handleLogout();
      }
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
  };

  const handleAddUser = () => {
    navigate("/new-user");
  };

  const handleCreateProject = () => {
    navigate("/create-project");
  };

  const handleLeaveAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/leaves/${id}/status`,
        { status: action === "approve" ? "approved" : "rejected" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeaves(
        leaves.map((leave) =>
          leave._id === id
            ? {
                ...leave,
                status: action === "approve" ? "approved" : "rejected",
              }
            : leave
        )
      );
      setSuccess(
        `Leave request ${
          action === "approve" ? "approved" : "rejected"
        } successfully`
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update leave status");
    }
  };

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleAssignTeam = (projectId) => {
    navigate(`/projects/${projectId}/assign`);
  };

  const handleDeleteEmployee = async (employeeId) => {
    const employee = recentEmployees.find((emp) => emp._id === employeeId);

    if (
      window.confirm(
        `WARNING: This will permanently delete ${employee?.name} and ALL associated data!\n\n` +
          "This includes:\n" +
          "- All leave records\n" +
          "- Removal from all projects\n" +
          "- Deletion of any empty projects\n\n" +
          "This action cannot be undone. Are you sure?"
      )
    ) {
      try {
        setIsLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `http://localhost:5000/api/auth/users/${employeeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update state
        setRecentEmployees(
          recentEmployees.filter((emp) => emp._id !== employeeId)
        );
        setProjects(
          projects.map((p) => ({
            ...p,
            employees: p.employees.filter((id) => id !== employeeId),
          }))
        );
        setProjects(projects.filter((p) => p.employees.length > 0));

        setSuccess(
          response.data.message ||
            "Employee and all associated data deleted successfully"
        );
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to delete employee";

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
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

  const filteredEmployees = recentEmployees.filter((employee) => {
    const name = employee.name?.toLowerCase() || "";
    const department = employee.department?.toLowerCase() || "";
    const position = employee.position?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      name.includes(search) ||
      department.includes(search) ||
      position.includes(search)
    );
  });

  const filteredLeaves = leaves.filter((leave) => {
    if (!leave.employee) return false;
    const typeMatch =
      leaveTypeFilter === "all" || leave.leaveType === leaveTypeFilter;
    const statusMatch = statusFilter === "all" || leave.status === statusFilter;
    return typeMatch && statusMatch;
  });

  useEffect(() => {
    fetchHrProfile();
    fetchData();
  }, [activeTab, leaveTypeFilter, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 bg-blue-600 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <BarChart className="mr-2" size={24} />
            HR Admin Panel
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  hrData.name
                )}&background=random&size=128`}
                alt={hrData.name}
                className="rounded-full h-24 w-24 object-cover border-4 border-blue-100 shadow-md"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-5 h-5 border-2 border-white"></div>
            </div>
          </div>
          <p className="text-center mb-1 font-semibold text-lg">
            {hrData.name}
          </p>
          {hrData.position && (
            <p className="text-center text-sm text-gray-600 font-medium">
              {hrData.position}
            </p>
          )}
          {hrData.department && (
            <p className="text-center text-sm text-gray-600">
              {hrData.department}
            </p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">MAIN MENU</div>
          </div>
        </div>
        <nav>
          <button
            onClick={() => handleTabChange("dashboard")}
            className={`flex items-center w-full px-6 py-4 text-left transition-colors duration-200 ${
              activeTab === "dashboard"
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Home size={18} className="mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => handleTabChange("employees")}
            className={`flex items-center w-full px-6 py-4 text-left transition-colors duration-200 ${
              activeTab === "employees"
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users size={18} className="mr-3" />
            Employees
          </button>
          <button
            onClick={() => handleTabChange("leaves")}
            className={`flex items-center w-full px-6 py-4 text-left transition-colors duration-200 ${
              activeTab === "leaves"
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FileText size={18} className="mr-3" />
            Leave Management
          </button>
          <button
            onClick={() => handleTabChange("projects")}
            className={`flex items-center w-full px-6 py-4 text-left transition-colors duration-200 ${
              activeTab === "projects"
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Briefcase size={18} className="mr-3" />
            Project Management
          </button>

          <div className="px-6 py-4">
            <div className="text-xs text-gray-500 mb-2">ACTIONS</div>
          </div>

          <button
            onClick={handleAddUser}
            className="flex items-center w-full px-6 py-4 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <PlusCircle size={18} className="mr-3 text-blue-600" />
            Add New User
          </button>

          <button
            onClick={handleCreateProject}
            className="flex items-center w-full px-6 py-4 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <Briefcase size={18} className="mr-3 text-blue-600" />
            Create Project
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-4 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200 mt-auto"
          >
            <LogOut size={18} className="mr-3 text-red-500" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "employees" && "Employee Management"}
              {activeTab === "leaves" && "Leave Management"}
              {activeTab === "projects" && "Project Management"}
            </h1>
            <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hidden md:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 group">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    hrData.name
                  )}&background=random&size=32`}
                  alt={hrData.name}
                  className="rounded-full h-8 w-8 object-cover border border-gray-200"
                />
                <span className="font-medium hidden md:block">
                  {hrData.name}
                </span>
                <ChevronDown
                  size={16}
                  className="text-gray-500 transition-transform group-hover:rotate-180"
                />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} className="inline mr-2" />
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} className="inline mr-2" />
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="inline mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center border border-red-200 shadow-sm animate-fadeIn">
              <AlertCircle className="mr-3 flex-shrink-0" size={20} />
              <p>{error}</p>
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <XCircle size={18} />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center border border-green-200 shadow-sm animate-fadeIn">
              <CheckCircle className="mr-3 flex-shrink-0" size={20} />
              <p>{success}</p>
              <button
                onClick={() => setSuccess("")}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <XCircle size={18} />
              </button>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div>
              {/* Welcome banner */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Welcome back, {hrData.name}!
                    </h2>
                    <p className="opacity-90">
                      Here's what's happening with your team today.
                    </p>
                  </div>
                  <button
                    onClick={handleAddUser}
                    className="mt-4 md:mt-0 px-5 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center shadow-md"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Add New Employee
                  </button>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-6 flex items-center hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className={`rounded-full p-4 ${stat.bgColor}`}>
                      {stat.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm font-medium">
                        {stat.title}
                      </h3>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project stats */}
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Project Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Total Projects
                    </h3>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase size={18} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {projectStats.totalProjects}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Completed
                    </h3>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle size={18} className="text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {projectStats.completedProjects}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Ongoing
                    </h3>
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock size={18} className="text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {projectStats.ongoingProjects}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Planning
                    </h3>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar size={18} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {projectStats.planningProjects}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Revenue
                    </h3>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BarChart size={18} className="text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    ${projectStats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Recent employees */}
              <div className="bg-white rounded-xl shadow-md mb-8">
                <div className="p-5 border-b flex flex-col md:flex-row justify-between md:items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <Users size={20} className="text-blue-600 mr-2" />
                    <h2 className="font-bold text-lg">Recent Employees</h2>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-5">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-3 pr-4 font-medium">Name</th>
                          <th className="pb-3 pr-4 font-medium">Position</th>
                          <th className="pb-3 pr-4 font-medium">Department</th>
                          <th className="pb-3 font-medium">Join Date</th>
                          <th className="pb-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.length > 0 ? (
                          filteredEmployees.slice(0, 5).map((employee) => (
                            <tr
                              key={employee._id}
                              className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 pr-4 font-medium">
                                <div className="flex items-center">
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      employee.name
                                    )}&background=random&size=32`}
                                    className="w-8 h-8 rounded-full mr-3"
                                    alt={employee.name}
                                  />
                                  {employee.name}
                                </div>
                              </td>
                              <td className="py-4 pr-4">{employee.position}</td>
                              <td className="py-4 pr-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {employee.department}
                                </span>
                              </td>
                              <td className="py-4">
                                {formatDate(employee.joinDate)}
                              </td>
                              <td className="py-4">
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/employees/${employee._id}/details`
                                    )
                                  }
                                  className="text-blue-600 hover:underline font-medium flex items-center"
                                >
                                  <Eye size={16} className="mr-1" />
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="py-4 text-center text-gray-500"
                            >
                              No employees found matching your search
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {filteredEmployees.length > 5 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => handleTabChange("employees")}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View All Employees
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pending leave requests */}
              <div className="bg-white rounded-xl shadow-md">
                <div className="p-5 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText size={20} className="text-blue-600 mr-2" />
                    <h2 className="font-bold text-lg">
                      Pending Leave Requests
                    </h2>
                  </div>
                  <button
                    onClick={() => handleTabChange("leaves")}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center"
                  >
                    View All
                    <ChevronDown size={16} className="ml-1 rotate-270" />
                  </button>
                </div>
                <div className="p-5">
                  {leaves.length > 0 ? (
                    <div className="space-y-5">
                      {leaves.slice(0, 5).map((leave) => (
                        <div
                          key={leave._id}
                          className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex justify-between mb-3">
                            <div className="flex items-center">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  leave.employee?.name || "Unknown"
                                )}&background=random&size=32`}
                                alt={leave.employee?.name || "Unknown"}
                                className="w-8 h-8 rounded-full mr-3 border border-gray-200"
                              />
                              <div>
                                <h3 className="font-medium">
                                  {leave.employee?.name || "Unknown Employee"}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {leave.employee?.department ||
                                    "No department"}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full h-fit flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(leave.startDate)} to{" "}
                              {formatDate(leave.endDate)}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-700 mb-3">
                            <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium mr-2">
                              {leave.leaveType || "Personal"}
                            </div>
                            <p className="text-sm">{leave.reason}</p>
                          </div>
                          <div className="flex space-x-3 justify-end">
                            <button
                              onClick={() =>
                                handleLeaveAction(leave._id, "reject")
                              }
                              className="flex items-center text-sm px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <XCircle size={16} className="mr-2" />
                              Reject
                            </button>
                            <button
                              onClick={() =>
                                handleLeaveAction(leave._id, "approve")
                              }
                              className="flex items-center text-sm px-4 py-2 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition-colors"
                            >
                              <CheckCircle size={16} className="mr-2" />
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <FileText
                        size={40}
                        className="mx-auto text-gray-300 mb-3"
                      />
                      <p className="text-gray-500 font-medium">
                        No pending leave requests
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        All caught up! Check back later for new requests
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "employees" && (
            <div>
              <div className="bg-white rounded-xl shadow-md mb-6">
                <div className="p-5 border-b flex flex-col md:flex-row justify-between md:items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <Users size={20} className="text-blue-600 mr-2" />
                    <h2 className="font-bold text-lg">Employee Directory</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search employees..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleAddUser}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <PlusCircle size={18} className="mr-2" />
                      Add Employee
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-3 pr-4 font-medium">Name</th>
                          <th className="pb-3 pr-4 font-medium">Position</th>
                          <th className="pb-3 pr-4 font-medium">Department</th>
                          <th className="pb-3 pr-4 font-medium">Email</th>
                          <th className="pb-3 pr-4 font-medium">Join Date</th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.length > 0 ? (
                          filteredEmployees.map((employee) => (
                            <tr
                              key={employee._id}
                              className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 pr-4">
                                <div className="flex items-center">
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      employee.name
                                    )}&background=random&size=32`}
                                    className="w-8 h-8 rounded-full mr-3"
                                    alt={employee.name}
                                  />
                                  <span className="font-medium">
                                    {employee.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 pr-4">{employee.position}</td>
                              <td className="py-4 pr-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {employee.department}
                                </span>
                              </td>
                              <td className="py-4 pr-4">{employee.email}</td>
                              <td className="py-4 pr-4">
                                {formatDate(employee.joinDate)}
                              </td>
                              <td className="py-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/employees/${employee._id}/details`
                                      )
                                    }
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="View Details"
                                  >
                                    <Eye size={18} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/employees/${employee._id}/edit`
                                      )
                                    }
                                    className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                                    title="Edit Employee"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteEmployee(employee._id)
                                    }
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="Delete Employee"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="py-4 text-center text-gray-500"
                            >
                              No employees found matching your search
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "leaves" && (
            <div>
              <div className="bg-white rounded-xl shadow-md mb-6">
                <div className="p-5 border-b">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                    <div className="flex items-center mb-4 md:mb-0">
                      <FileText size={20} className="text-blue-600 mr-2" />
                      <h2 className="font-bold text-lg">Leave Management</h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2">
                    <select
                      value={leaveTypeFilter}
                      onChange={(e) => setLeaveTypeFilter(e.target.value)}
                      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="sick">Sick Leave</option>
                      <option value="vacation">Vacation</option>
                      <option value="personal">Personal</option>
                      <option value="maternity">Maternity</option>
                      <option value="paternity">Paternity</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="p-5">
                  {filteredLeaves.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {filteredLeaves.map((leave) => (
                        <div
                          key={leave._id}
                          className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
                            leave.status === "approved"
                              ? "border-green-200 bg-green-50"
                              : leave.status === "rejected"
                              ? "border-red-200 bg-red-50"
                              : "border-yellow-200 bg-yellow-50"
                          }`}
                        >
                          <div className="flex justify-between mb-3">
                            <div className="flex items-center">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  leave.employee?.name || "Unknown"
                                )}&background=random&size=32`}
                                alt={leave.employee?.name || "Unknown"}
                                className="w-8 h-8 rounded-full mr-3 border border-white"
                              />
                              <div>
                                <h3 className="font-medium">
                                  {leave.employee?.name || "Unknown Employee"}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {leave.employee?.department ||
                                    "No department"}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  leave.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : leave.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {leave.status === "approved" && (
                                  <CheckCircle size={14} className="mr-1" />
                                )}
                                {leave.status === "rejected" && (
                                  <XCircle size={14} className="mr-1" />
                                )}
                                {leave.status === "pending" && (
                                  <Clock size={14} className="mr-1" />
                                )}
                                {leave.status.charAt(0).toUpperCase() +
                                  leave.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-3 mb-3">
                            <div className="flex items-center text-sm text-gray-700 mb-2">
                              <Calendar
                                size={16}
                                className="mr-2 text-blue-600"
                              />
                              <span className="font-medium mr-2">
                                Date Range:
                              </span>
                              {formatDate(leave.startDate)} to{" "}
                              {formatDate(leave.endDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-700 mb-2">
                              <FileText
                                size={16}
                                className="mr-2 text-blue-600"
                              />
                              <span className="font-medium mr-2">Type:</span>
                              {leave.leaveType || "Personal"}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium mr-2">Reason:</span>
                              {leave.reason}
                            </div>
                          </div>

                          {leave.status === "pending" && (
                            <div className="flex space-x-3 justify-end">
                              <button
                                onClick={() =>
                                  handleLeaveAction(leave._id, "reject")
                                }
                                className="flex items-center text-sm px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
                              >
                                <XCircle size={16} className="mr-2" />
                                Reject
                              </button>
                              <button
                                onClick={() =>
                                  handleLeaveAction(leave._id, "approve")
                                }
                                className="flex items-center text-sm px-4 py-2 rounded-lg border border-green-200 text-green-600 hover:bg-green-100 transition-colors"
                              >
                                <CheckCircle size={16} className="mr-2" />
                                Approve
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <FileText
                        size={40}
                        className="mx-auto text-gray-300 mb-3"
                      />
                      <p className="text-gray-500 font-medium">
                        No leave requests found
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Adjust your filters to see more results
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Project Management
                  </h2>
                  <p className="text-gray-500">
                    Manage and oversee all company projects
                  </p>
                </div>
                <button
                  onClick={handleCreateProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Create Project
                </button>
              </div>

              {/* Project stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Total Projects
                    </h3>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase size={18} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {projectStats.totalProjects}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Completed
                    </h3>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle size={18} className="text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {projectStats.completedProjects}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Ongoing
                    </h3>
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock size={18} className="text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {projectStats.ongoingProjects}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Planning
                    </h3>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar size={18} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {projectStats.planningProjects}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500 text-sm font-medium">
                      Revenue
                    </h3>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BarChart size={18} className="text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    ${projectStats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md">
                <div className="p-5 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <Briefcase size={20} className="text-blue-600 mr-2" />
                    <h2 className="font-bold text-lg">Project List</h2>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search projects..."
                      className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-5">
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {projects.map((project) => (
                        <div
                          key={project._id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex justify-between mb-3">
                            <h3 className="font-medium text-lg">
                              {project.name}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                project.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : project.status === "ongoing"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {project.status.charAt(0).toUpperCase() +
                                project.status.slice(1)}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mb-3">
                            {project.description?.substring(0, 100)}
                            {project.description?.length > 100 ? "..." : ""}
                          </p>

                          <div className="flex items-center text-sm text-gray-700 mb-3">
                            <Calendar
                              size={16}
                              className="mr-2 text-blue-600"
                            />
                            <span className="font-medium mr-2">Timeline:</span>
                            {formatDate(project.startDate)} to{" "}
                            {formatDate(project.endDate)}
                          </div>

                          <div className="flex items-center text-sm text-gray-700 mb-4">
                            <Users size={16} className="mr-2 text-blue-600" />
                            <span className="font-medium mr-2">Team Size:</span>
                            {project.employees?.length || 0} members
                          </div>

                          <div className="flex space-x-3 justify-end">
                            <button
                              onClick={() => handleAssignTeam(project._id)}
                              className="flex items-center text-sm px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <Users size={16} className="mr-2" />
                              Assign Team
                            </button>
                            <button
                              onClick={() => handleViewProject(project._id)}
                              className="flex items-center text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                              <Eye size={16} className="mr-2" />
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Briefcase
                        size={40}
                        className="mx-auto text-gray-300 mb-3"
                      />
                      <p className="text-gray-500 font-medium">
                        No projects found
                      </p>
                      <button
                        onClick={handleCreateProject}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
                      >
                        <PlusCircle size={18} className="mr-2" />
                        Create First Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HrHome;
