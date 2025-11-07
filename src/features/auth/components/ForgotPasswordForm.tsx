import { useForgotPasswordMutation } from "../api/authApi";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, isSuccess }] =
    useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword({ email });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-3">Forgot Password</h2>
      <input
        type="email"
        className="border p-2 w-full mb-2 rounded"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white py-2 px-4 rounded w-full"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>
      {isSuccess && (
        <p className="text-green-600 mt-2">Reset link sent successfully!</p>
      )}
    </form>
  );
}
