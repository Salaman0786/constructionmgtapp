import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const token = useAppSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}
