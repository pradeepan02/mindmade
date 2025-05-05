import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Briefcase,
  User,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  Building,
  Tag,
} from "lucide-react";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "planning",
    budget: "",
    revenue: "",
    client: "",
  });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/auth/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(response.data);
      } catch (err) {
        setError("Failed to fetch employees");
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const projectData = {
        ...formData,
        employees: selectedEmployees,
        budget: Number(formData.budget),
        revenue: Number(formData.revenue),
      };

      await axios.post("http://localhost:5000/api/projects", projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/hr-home");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planning":
        return "bg-indigo-100 text-indigo-700";
      case "ongoing":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "onhold":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
        <div className="bg-indigo-600 text-white p-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-indigo-200 mr-4 transition-colors"
            >
              <ArrowLeft size={20} className="mr-1" />
              Back
            </button>
            <div className="flex items-center">
              <Briefcase className="h-6 w-6 mr-3" />
              <h1 className="text-2xl font-bold">Create New Project</h1>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-700">
                  Project Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    required
                    placeholder="Enterprise App Redesign"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-700">
                  Client
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    placeholder="Acme Corporation"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-700">
                Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-indigo-400" />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  placeholder="Detailed description of project scope and objectives"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-700">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-700">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-700">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full pl-3 pr-10 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none"
                  >
                    <option value="planning">Planning</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="onhold">On Hold</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-indigo-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      formData.status
                    )}`}
                  >
                    {formData.status.charAt(0).toUpperCase() +
                      formData.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-700">
                  Budget ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-700">
                Revenue Generated ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="number"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  placeholder="15000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-indigo-700">
                Assign Team Members
              </label>
              <div className="border border-indigo-200 rounded-lg shadow-sm bg-white overflow-hidden">
                <div className="bg-indigo-50 py-2 px-4 border-b border-indigo-200">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-xs font-medium text-indigo-700">
                      Select team members for this project
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-3">
                  {employees.length === 0 ? (
                    <p className="text-gray-500 text-sm col-span-3">
                      Loading employees...
                    </p>
                  ) : (
                    employees.map((employee) => (
                      <div
                        key={employee._id}
                        className="flex items-center p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          id={`emp-${employee._id}`}
                          checked={selectedEmployees.includes(employee._id)}
                          onChange={() => handleEmployeeSelect(employee._id)}
                          className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`emp-${employee._id}`}
                          className="flex items-center cursor-pointer flex-1"
                        >
                          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-2 text-xs font-medium">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              {employee.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {employee.position}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
                <div className="bg-indigo-50 py-2 px-4 border-t border-indigo-200 text-xs text-indigo-700">
                  {selectedEmployees.length} team members selected
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center transition-colors ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Project...
                  </span>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
