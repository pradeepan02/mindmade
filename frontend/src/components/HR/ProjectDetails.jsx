import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Briefcase,
  Calendar,
  Users,
  DollarSign,
  ChevronLeft,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  CreditCard,
  PieChart,
  Star,
} from "lucide-react";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProject(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/hr-home", {
        state: { message: "Project deleted successfully" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 mr-1 text-emerald-600" />;
      case "ongoing":
        return <Clock className="w-4 h-4 mr-1 text-indigo-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 mr-1 text-amber-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "ongoing":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-700 font-medium">
          Loading project details...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-indigo-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-500 font-medium text-lg">
            {error || "Project not found"}
          </p>
          <button
            onClick={() => navigate("/hr-home")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-700 hover:text-indigo-900 font-medium transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Projects
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/projects/${projectId}/edit`)}
              className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors font-medium"
            >
              <Edit size={16} className="mr-2" />
              Edit Project
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors font-medium disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin mr-2">↻</span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
            <AlertTriangle className="mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <Briefcase className="mr-3" />
                  {project.name}
                </h1>
                <div className="flex items-center mt-2 text-indigo-100">
                  <Building className="mr-2" />
                  <p>{project.client || "No client specified"}</p>
                </div>
              </div>
              <div
                className={`flex items-center px-4 py-2 rounded-lg ${getStatusColor(
                  project.status
                )}`}
              >
                <div className="flex items-center">
                  {getStatusIcon(project.status)}
                  <span className="capitalize font-medium">
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="font-semibold text-lg mb-4 flex items-center text-indigo-800">
                  <Calendar className="mr-2 text-indigo-600" />
                  Project Timeline
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">
                      Start Date:
                    </span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">
                      End Date:
                    </span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md">
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : "Ongoing"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="font-semibold text-lg mb-4 flex items-center text-indigo-800">
                  <DollarSign className="mr-2 text-indigo-600" />
                  Financial Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">Budget:</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md">
                      ${project.budget?.toLocaleString() || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">
                      Revenue:
                    </span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md">
                      ${project.revenue?.toLocaleString() || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 bg-white p-5 rounded-lg border border-indigo-100 shadow-sm">
              <h2 className="font-semibold text-lg mb-3 flex items-center text-indigo-800">
                <Star className="mr-2 text-indigo-600" />
                Project Description
              </h2>
              <p className="text-indigo-800 leading-relaxed bg-indigo-50 p-4 rounded-md border border-indigo-100">
                {project.description ||
                  "No description provided for this project."}
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-indigo-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg flex items-center text-indigo-800">
                  <Users className="mr-2 text-indigo-600" />
                  Team Members
                </h2>
                <button
                  onClick={() => navigate(`/projects/${projectId}/assign`)}
                  className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200 transition-colors"
                >
                  <PieChart size={16} className="mr-1.5" />
                  Assign Members
                </button>
              </div>

              {project.employees && project.employees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.employees.map((employee) => (
                    <div
                      key={employee._id}
                      className="flex items-center p-4 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <div className="bg-indigo-200 rounded-full p-2 mr-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            employee.name
                          )}&background=c7d2fe&color=4f46e5`}
                          alt={employee.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-indigo-800">
                          {employee.name}
                        </p>
                        <div className="flex items-center text-sm text-indigo-600">
                          <CreditCard size={12} className="mr-1" />
                          <span>{employee.position}</span>
                          <span className="mx-1.5">•</span>
                          <span>{employee.department}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-indigo-50 p-8 rounded-lg text-center border border-dashed border-indigo-200">
                  <Users className="mx-auto h-12 w-12 text-indigo-400 mb-3" />
                  <p className="text-indigo-600 mb-3">
                    No team members assigned to this project yet
                  </p>
                  <button
                    onClick={() => navigate(`/projects/${projectId}/assign`)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <Users size={16} className="mr-2" />
                    Assign Team Members
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
