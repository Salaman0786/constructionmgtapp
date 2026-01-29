import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ScrollToTop } from "../components/common/ScrollToTop";
import AdminLogin from "../pages/AuthPages/AdminLogin";
import ForgotPassword from "../pages/AuthPages/ForgotPassword";
import SendOtp from "../pages/AuthPages/SendOtp";
import ResetPassword from "../pages/AuthPages/ResetPassword";
import AppLayout from "../layout/AppLayout";
import AdminPanel from "../components/Admin/UserManagement/AdminPanel";
import RoleProtectedRoute from "../components/common/RoleProtectedRoute";
import NotAuthorized from "../components/common/NotAuthorized";

import DrawingsRevisions from "../components/Documents&Control/Drawings&Revisions/DrawingsRevisions";
import NotFound from "../components/common/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<AdminLogin />} />
        <Route path="/signin/forgot-password" element={<ForgotPassword />} />
        <Route path="/signin/forgot-password/send-otp" element={<SendOtp />} />
        <Route
          path="/signin/forgot-password/send-otp/reset-password"
          element={<ResetPassword />}
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/drawings-revisions"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <DrawingsRevisions />
              </RoleProtectedRoute>
            }
          />

          {/*  Admin */}
          <Route
            path="/user-management"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <AdminPanel />
              </RoleProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </BrowserRouter>
  );
}
