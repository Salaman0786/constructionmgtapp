import React, { useState } from "react";
import { Building2, Clipboard, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useResetPasswordMutation } from "../../features/auth/api/authApi";
import { useNavigate } from "react-router";
import { showError, showSuccess } from "../../utils/toast";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({
        token,
        newPassword: password,
        confirmPassword: confirmPassword,
      }).unwrap();
      showSuccess("Updated new password!");
      navigate("/signin");
    } catch (err: any) {
      // Normalize the message: always turn it into a string
      const errorMessage = err?.data?.message;

      let displayMessage: string;

      if (Array.isArray(errorMessage)) {
        // If it's an array → join all messages (you can also take just the first one)
        displayMessage = errorMessage.join(", ");
        // Or just the first one: errorMessage[0]
      } else if (typeof errorMessage === "string") {
        displayMessage = errorMessage;
      } else {
        displayMessage = "Failed to set your new password!";
      }

      showError(displayMessage);
    }
  };
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/backgroundImage.jpg')",
        }}
      />

      {/* Black Overlay - Darkens only the background */}
      <div className="absolute inset-0 bg-black/65" />
      {/* Adjust 65 → 55 (lighter) | 75 (darker) */}

      {/* Reset Password Card */}
      <div className="relative w-full max-w-lg">
        <div className="bg-white/97 backdrop-blur-sm shadow-2xl rounded-2xl p-8 sm:p-10 lg:p-12">
          {/* Logo & Title */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="bg-purple-100 p-4 rounded-2xl">
              <Building2 className="w-12 h-12 text-purple-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Addis Ababa Jamaat
              </h1>
              <p className="text-sm text-gray-600">Construction Management</p>
            </div>
          </div>

          {/* Page Title */}
          <h2 className="text-center text-lg sm:text-xl font-bold text-gray-800 mb-1">
            Reset Password
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-600 mb-7">
            Create a strong new password for your account
          </p>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-500 text-white font-bold py-3 rounded-xl text-lg transition transform hover:scale-[1.02] active:scale-100 shadow-lg"
          >
            {isLoading ? "Updating Password..." : "Set New Password"}
          </button>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <div
              onClick={() => {
                navigate("/signin");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              ← Back to Login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
