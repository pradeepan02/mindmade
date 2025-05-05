import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import HrHome from "./components/HR/HrHome";
import EmployeeHome from "./components/Employee/EmployeeHome";
import NewUser from "./components/HR/NewUser";
import CreateLeave from "./components/Employee/CreateLeave";
import CreateProject from "./components/HR/CreateProject";
import AssignEmployees from "./components/HR/AssignEmployees";
import ProjectDetails from "./components/HR/ProjectDetails";
import EmployeeDetails from "./components/HR/EmployeeDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProject from "./components/HR/EditProject";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* HR Protected Routes */}
        <Route
          path="/hr-home"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <HrHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/edit"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <EditProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/assign"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <AssignEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id/details"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <EmployeeDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-user"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <NewUser />
            </ProtectedRoute>
          }
        />

        {/* Employee Protected Routes */}
        <Route
          path="/employee-home"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-leave"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <CreateLeave />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
