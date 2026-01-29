import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAppDispatch } from "../../app/hooks";
import { useForgotPasswordMutation } from "../../features/auth/api/authApi";
import { setUserEmail } from "../../features/auth/slices/authSlice";
import { showError, showSuccess } from "../../utils/toast";
interface ForgotPasswordPayload {
  email: string;
}

interface ApiErrorData {
  message?: string | string[];
}

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();

    const payload: ForgotPasswordPayload = { email };

    try {
      await forgotPassword(payload).unwrap();

      dispatch(setUserEmail({ userEmail: email }));

      showSuccess("OTP has been sent to your email!");
      navigate("/signin/forgot-password/send-otp");
    } catch (err) {
      const apiError = err as FetchBaseQueryError & {
        data?: ApiErrorData;
      };

      const errorMessage = apiError?.data?.message;

      let displayMessage = "Failed to send OTP to your email!";

      if (Array.isArray(errorMessage)) {
        displayMessage = errorMessage.join(", ");
      } else if (typeof errorMessage === "string") {
        displayMessage = errorMessage;
      }

      showError(displayMessage);
    }
  };

  const handleLoginPage = (): void => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/backgroundImage.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative w-full max-w-lg">
        <div className="bg-white/96 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Building2 className="w-10 h-10 text-purple-700" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Construction Mgt App
            </h2>
          </div>

          {/* Title */}
          <h2 className="text-center text-xl font-bold text-gray-800 mb-3">
            Forgot Password
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Enter your registered email to reset your password
          </p>

          {/* Email */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-500 text-white font-semibold py-3 rounded-lg transition"
          >
            {isLoading ? "Verifying Email..." : "Verify Email"}
          </button>

          {/* Back */}
          <div className="mt-6 text-center">
            <button
              onClick={handleLoginPage}
              className="text-sm text-purple-600 hover:underline font-medium"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
