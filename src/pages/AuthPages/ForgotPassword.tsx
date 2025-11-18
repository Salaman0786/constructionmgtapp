import React, { useState } from "react";
import { Building2, Clipboard } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../app/hooks";
import { useForgotPasswordMutation } from "../../features/auth/api/authApi";
import { setUserEmail } from "../../features/auth/slices/authSlice";
import { showError, showSuccess } from "../../utils/toast";
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      dispatch(setUserEmail({ userEmail: email }));
      showSuccess("Send OTP to your email id!");
      navigate("/signin/forgot-password/send-otp");
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
        displayMessage = "Failed to Send OTP to your email id!";
      }

      showError(displayMessage);
    }
  };
  const handleLoginPage = () => {
    navigate("/signin");
  };
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/backgroundImage.jpg')",
        }}
      />

      {/* Black Overlay - Darkens only the background */}
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative w-full max-w-lg">
        <div className="bg-white/96 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10">
          {/* Logo + Title */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Building2 className="w-10 h-10 text-purple-700" />
            </div>
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Addis Ababa Jamaat
              </h2>
              <p className="text-sm text-gray-600">Construction Management</p>
            </div>
          </div>

          {/* Page Title */}
          <h2 className="text-center text-xl font-bold text-gray-800 mb-3">
            Forgot Password
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Enter your registered email to reset your password
          </p>

          {/* Email Field */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-500 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-100"
          >
            {isLoading ? "Verifying Email..." : "Verify Email"}
          </button>

          {/* Optional: Back to Login Link */}
          <div className="mt-6 text-center">
            <div
              onClick={handleLoginPage}
              className="text-sm text-purple-600 hover:underline font-medium cursor-pointer"
            >
              ← Back to Login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
