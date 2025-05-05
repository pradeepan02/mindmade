import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  CheckCircle,
  ArrowLeft,
  Users,
  XCircle,
  Briefcase,
  AlertCircle,
} from "lucide-react";

const AssignEmployees = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const [projectRes, employeesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/projects/${projectId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:5000/api/auth/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setProject(projectRes.data);
        setEmployees(employeesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleAssign = async (employeeId) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/assign/${employeeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh project data
      const response = await axios.get(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProject(response.data);
      setSuccess("Employee assigned successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign employee");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (employeeId) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/remove/${employeeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh project data
      const response = await axios.get(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProject(response.data);
      setSuccess("Employee removed successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove employee");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !project) {
    return (
      <div className="flex items-center justify-center h-screen bg-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading project data...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-indigo-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle size={48} className="text-indigo-600 mx-auto mb-4" />
          <p className="text-indigo-600 font-medium text-lg">
            {error || "Project not found"}
          </p>
          <button
            onClick={() => navigate("/hr-home")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const assignedEmployees = project.employees || [];
  const availableEmployees = employees.filter(
    (emp) => !assignedEmployees.some((e) => e._id === emp._id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center">
                <Briefcase className="mr-2" />
                {project.name}
              </h1>
              <button
                onClick={() => navigate(`/projects/${projectId}`)}
                className="flex items-center bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-1.5 rounded-md transition-colors"
              >
                <ArrowLeft size={18} className="mr-1" />
                Back to Project
              </button>
            </div>
            <p className="mt-2 opacity-90">Team Assignment</p>
          </div>

          {(error || success) && (
            <div className={`px-6 pt-4 ${error ? "mb-0" : "mb-0"}`}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center border-l-4 border-red-500">
                  <AlertCircle className="mr-2 flex-shrink-0" size={18} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-indigo-50 text-indigo-600 rounded-md flex items-center border-l-4 border-indigo-500">
                  <CheckCircle className="mr-2 flex-shrink-0" size={18} />
                  <span>{success}</span>
                </div>
              )}
            </div>
          )}

          <div className="p-6">
            <div className="mb-8">
              <h3 className="font-medium text-lg mb-4 flex items-center text-indigo-700">
                <Users className="mr-2" />
                Current Team Members{" "}
                <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                  {assignedEmployees.length}
                </span>
              </h3>

              {assignedEmployees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignedEmployees.map((emp) => (
                    <div
                      key={emp._id}
                      className="flex items-center justify-between p-4 border border-indigo-100 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={`https://ui-avatars.com/api/?name=${emp.name}&background=6366f1&color=ffffff`}
                            alt={emp.name}
                            className="w-12 h-12 rounded-full mr-3 border-2 border-white shadow-sm"
                          />
                          <div className="absolute bottom-0 right-2 w-3 h-3 bg-indigo-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {emp.name}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-1.5"></span>
                            {emp.position} • {emp.department}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(emp._id)}
                        disabled={isLoading}
                        className="flex items-center text-sm px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <XCircle size={16} className="mr-1.5" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-indigo-50 p-6 rounded-lg text-center border border-dashed border-indigo-200">
                  <Users size={32} className="mx-auto text-indigo-400 mb-2" />
                  <p className="text-indigo-700">
                    No team members assigned yet
                  </p>
                  <p className="text-sm text-indigo-500 mt-1">
                    Assign employees from the list below
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-indigo-100 pt-6">
              <h3 className="font-medium text-lg mb-4 flex items-center text-indigo-700">
                <User className="mr-2" />
                Available Employees{" "}
                <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                  {availableEmployees.length}
                </span>
              </h3>

              {availableEmployees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableEmployees.map((employee) => (
                    <div
                      key={employee._id}
                      className="flex items-center justify-between p-4 border border-indigo-100 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={`https://ui-avatars.com/api/?name=${employee.name}&background=d1d5db&color=ffffff`}
                            alt={employee.name}
                            className="w-12 h-12 rounded-full mr-3 border-2 border-white shadow-sm"
                          />
                          <div className="absolute bottom-0 right-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {employee.name}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1.5"></span>
                            {employee.position} • {employee.department}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssign(employee._id)}
                        disabled={isLoading}
                        className="flex items-center text-sm px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <CheckCircle size={16} className="mr-1.5" />
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-indigo-50 p-6 rounded-lg text-center border border-dashed border-indigo-200">
                  <CheckCircle
                    size={32}
                    className="mx-auto text-indigo-400 mb-2"
                  />
                  <p className="text-indigo-700">
                    All employees are already assigned to this project
                  </p>
                  <p className="text-sm text-indigo-500 mt-1">
                    Great job building your team!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignEmployees;
