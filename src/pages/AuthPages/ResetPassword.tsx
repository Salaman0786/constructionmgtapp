import React, { useState } from "react";
import { Building2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAppSelector } from "../../app/hooks";
import { useResetPasswordMutation } from "../../features/auth/api/authApi";
import { showError, showSuccess } from "../../utils/toast";

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiErrorData {
  message?: string | string[];
}

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const { token } = useAppSelector(
    (state: { auth: { token: string } }) => state.auth,
  );

  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();

    const payload: ResetPasswordPayload = {
      token,
      newPassword: password,
      confirmPassword,
    };

    try {
      await resetPassword(payload).unwrap();
      showSuccess("Updated new password!");
      navigate("/signin");
    } catch (err) {
      const apiError = err as FetchBaseQueryError & {
        data?: ApiErrorData;
      };

      const errorMessage = apiError?.data?.message;

      let displayMessage = "Failed to set your new password!";

      if (Array.isArray(errorMessage)) {
        displayMessage = errorMessage.join(", ");
      } else if (typeof errorMessage === "string") {
        displayMessage = errorMessage;
      }

      showError(displayMessage);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/backgroundImage.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative w-full max-w-lg">
        <div className="bg-white/97 backdrop-blur-sm shadow-2xl rounded-2xl p-8 sm:p-10 lg:p-12">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="bg-purple-100 p-4 rounded-2xl">
              <Building2 className="w-12 h-12 text-purple-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Construction Mgt App
            </h1>
          </div>

          <h2 className="text-center text-lg sm:text-xl font-bold text-gray-800 mb-1">
            Reset Password
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-600 mb-7">
            Create a strong new password for your account
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter new password"
                className="w-full px-4 py-3.5 pr-12 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                className="w-full px-4 py-3.5 pr-12 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-500 text-white font-bold py-3 rounded-xl text-lg transition"
          >
            {isLoading ? "Updating Password..." : "Set New Password"}
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/signin")}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
