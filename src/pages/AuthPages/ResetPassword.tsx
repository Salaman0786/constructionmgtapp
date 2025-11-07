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
      showSuccess("Successfully set up your new password!");
      navigate("/signin");
    } catch (err) {
      showError("Failed to set your new password!");
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/backgroundImage.jpg')", // Replace with your own background image
      }}
    >
      <div className="bg-white bg-opacity-95 shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Icon */}
        <div className="flex items-center justify-center gap-1 mb-5">
          <div className="bg-white/20 p-3 rounded-xl">
            <Building2 className="w-8 h-8 text-purple-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Addis Ababa Jamaat</h2>
            <p className="text-sm opacity-90">Construction Management</p>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Enter your new password to complete the reset process.
        </p>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md font-medium transition duration-200"
          onClick={handleSubmit}
        >
          {isLoading ? "Confirming..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
