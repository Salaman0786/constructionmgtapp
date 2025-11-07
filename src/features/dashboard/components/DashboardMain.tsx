import { useAppDispatch } from "../../../app/hooks";
import { logout } from "../../auth/slices/authSlice";

export default function DashboardMain() {
  const dispatch = useAppDispatch();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">🏗️ Construction Dashboard</h1>
      <p className="text-gray-700">
        Welcome to the Construction Management System.
      </p>

      <button
        onClick={() => dispatch(logout())}
        className="bg-red-600 text-white mt-4 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
