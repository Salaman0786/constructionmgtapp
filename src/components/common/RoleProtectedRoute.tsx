import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "../../app/hooks";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role?.name ?? "";

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
}
