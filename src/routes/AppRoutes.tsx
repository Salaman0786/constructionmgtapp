import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginForm from "../features/auth/components/LoginForm";
import ForgotPasswordForm from "../features/auth/components/ForgotPasswordForm";
import ResetPasswordForm from "../features/auth/components/ResetPasswordForm";
import DashboardMain from "../features/dashboard/components/DashboardMain";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardMain />
            </ProtectedRoute>
          }
        />

        {/* You can add other protected sections below */}
        {/* Example:
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          }
        /> */}

        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Optional: Create a simple NotFound component inside routes folder
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold mb-3">404 - Page Not Found</h1>
      <a href="/dashboard" className="text-blue-600 hover:underline text-lg">
        Go to Dashboard
      </a>
    </div>
  );
}
