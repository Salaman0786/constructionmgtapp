import { useResetPasswordMutation } from "../api/authApi";
import { useState } from "react";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword({ token, password });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-3">Reset Password</h2>
      <input
        type="text"
        className="border p-2 w-full mb-2 rounded"
        placeholder="Reset Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-2 rounded"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-4 rounded w-full"
        disabled={isLoading}
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
      {isSuccess && (
        <p className="text-green-600 mt-2">Password reset successful!</p>
      )}
    </form>
  );
}
