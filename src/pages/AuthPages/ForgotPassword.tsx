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
    } catch (err) {
      showError("Failed to Send OTP to your email id!");
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/backgroundImage.jpg')",
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
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-2">
          Forgot Password
        </h2>

        {/* Heading */}

        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Enter your registered email to reset your password
        </p>

        {/* Email Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter your email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Verify Button */}
        <button
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md font-medium transition duration-200"
          onClick={handleSubmit}
        >
          {isLoading ? "Verifing Email ..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
