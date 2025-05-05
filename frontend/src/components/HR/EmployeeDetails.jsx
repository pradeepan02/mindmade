import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Briefcase,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Home,
  Mail,
  Phone,
  ChevronLeft,
  AlertCircle,
  BadgeCheck,
  Award,
  Clock3,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [employeeRes, leavesRes, projectsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/auth/users/${id}`, config),
          axios.get(`http://localhost:5000/api/leaves/employee/${id}`, config),
          axios.get(
            `http://localhost:5000/api/projects/employee/${id}`,
            config
          ),
        ]);

        setEmployee(employeeRes.data);
        setLeaves(leavesRes.data);
        setProjects(projectsRes.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch employee details"
        );
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-lg flex items-center justify-center h-screen">
        <AlertCircle className="mr-3" size={24} />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-8 bg-yellow-50 text-yellow-700 rounded-lg flex items-center justify-center h-screen">
        <AlertCircle className="mr-3" size={24} />
        <span className="font-medium">Employee not found</span>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
    } catch {
      return "Invalid date";
    }
  };

  const approvedLeaves = leaves.filter((leave) => leave.status === "approved");
  const pendingLeaves = leaves.filter((leave) => leave.status === "pending");
  const rejectedLeaves = leaves.filter((leave) => leave.status === "rejected");

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
      case "approved":
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6 bg-white py-2 px-4 rounded-lg shadow-sm"
      >
        <ChevronLeft size={18} className="mr-1" />
        <span className="font-medium">Back to Employees</span>
      </button>

      <div className="bg-white rounded-xl shadow-md p-8 mb-8 border-t-4 border-blue-500">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  employee.name
                )}&background=random&size=128`}
                alt={employee.name}
                className="rounded-full h-24 w-24 object-cover border-4 border-blue-100 shadow-md"
              />
              <div
                className={`absolute bottom-0 right-0 h-6 w-6 rounded-full border-4 border-white ${
                  employee.status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>
            <div className="md:ml-6 mt-4 md:mt-0">
              <h1 className="text-3xl font-bold text-gray-800">
                {employee.name}
              </h1>
              <div className="flex items-center mt-1">
                <BadgeCheck className="text-blue-500 mr-1" size={18} />
                <p className="text-lg text-gray-600">{employee.position}</p>
              </div>
              <div className="flex items-center mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    employee.status
                  )}`}
                >
                  {employee.status}
                </span>
                <span className="ml-3 text-sm text-gray-500 flex items-center">
                  <Calendar className="mr-1" size={14} />
                  Joined {formatDate(employee.joinDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
              <User className="mr-2 text-blue-500" size={20} />
              Personal Information
            </h2>
            <div className="space-y-4">
              <p className="flex items-center">
                <Mail className="mr-3 text-blue-500" size={16} />
                <span className="text-gray-700">{employee.email}</span>
              </p>
              {employee.mobileNumber && (
                <p className="flex items-center">
                  <Phone className="mr-3 text-blue-500" size={16} />
                  <span className="text-gray-700">{employee.mobileNumber}</span>
                </p>
              )}
              <p className="flex items-center">
                <Home className="mr-3 text-blue-500" size={16} />
                <span className="text-gray-700">
                  {employee.department || "No department"}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-green-800">
              <FileText className="mr-2 text-green-500" size={20} />
              Leave Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center">
                  <CheckCircle className="mr-2 text-green-500" size={16} />
                  Total Leaves Taken:
                </span>
                <span className="font-medium text-gray-900">
                  {approvedLeaves.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center">
                  <Clock3 className="mr-2 text-green-500" size={16} />
                  Remaining Leaves:
                </span>
                <span className="font-medium text-gray-900">
                  {20 - approvedLeaves.length} of 20
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center">
                  <Clock className="mr-2 text-yellow-500" size={16} />
                  Pending Requests:
                </span>
                <span className="font-medium text-gray-900">
                  {pendingLeaves.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center">
                  <XCircle className="mr-2 text-red-500" size={16} />
                  Rejected Requests:
                </span>
                <span className="font-medium text-gray-900">
                  {rejectedLeaves.length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
              <Briefcase className="mr-2 text-blue-500" size={20} />
              Project Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center">
                  <Award className="mr-2 text-blue-500" size={16} />
                  Total Projects:
                </span>
                <span className="font-medium text-gray-900">
                  {projects.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center">
                  <Clock3 className="mr-2 text-blue-500" size={16} />
                  Ongoing Projects:
                </span>
                <span className="font-medium text-gray-900">
                  {projects.filter((p) => p.status === "ongoing").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 flex items-center">
                  <CheckCircle className="mr-2 text-green-500" size={16} />
                  Completed Projects:
                </span>
                <span className="font-medium text-gray-900">
                  {projects.filter((p) => p.status === "completed").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leaves Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
            <FileText className="mr-2 text-green-600" size={22} />
            Leave History
          </h2>
          {leaves.length > 0 ? (
            <div className="space-y-4">
              {leaves.map((leave) => (
                <div
                  key={leave._id}
                  className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800 capitalize">
                      {leave.leaveType} Leave
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <Calendar className="mr-1" size={14} />
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                  </div>
                  <p className="text-sm bg-gray-50 p-2 rounded">
                    {leave.reason}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FileText className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No leave records found</p>
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
            <Briefcase className="mr-2 text-blue-600" size={22} />
            Project Assignments
          </h2>
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">
                      {project.name}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <Calendar className="mr-1" size={14} />
                    {formatDate(project.startDate)} -{" "}
                    {project.endDate ? formatDate(project.endDate) : "Ongoing"}
                  </div>
                  <p className="text-sm bg-gray-50 p-2 rounded">
                    {project.description || "No description available"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Briefcase className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No project assignments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
