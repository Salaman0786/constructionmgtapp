import React, { useState, useRef } from "react";
import { Building2, Clipboard, ClipboardCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router";
import {
  useForgotPasswordMutation,
  useVerifyOTPMutation,
} from "../../features/auth/api/authApi";
import { setUserToken } from "../../features/auth/slices/authSlice";
import { showError, showSuccess } from "../../utils/toast";

const SendOtp: React.FC = () => {
  const { userEmail } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const [otp, setOtp] = useState<string>(""); // Empty initially
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const length = 6; // Number of OTP boxes
  const dispatch = useAppDispatch();
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits 0-9

    // Create a char array with the right length, filling missing positions with ""
    const newOtp = otp.split("");
    while (newOtp.length < length) newOtp.push("");

    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // Move focus to next field if a number is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // If there’s a value, clear it
        const newOtp = otp.split("");
        newOtp[index] = "";
        setOtp(newOtp.join(""));
      } else if (index > 0) {
        // If empty, move focus back
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const [verifyOTP, { isLoading: isloadingOTP, error: errorOTP }] =
    useVerifyOTPMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await verifyOTP({ email: userEmail, otp }).unwrap();
      dispatch(setUserToken({ token: userData?.data?.resetToken }));
      showSuccess("Verify OTP successfully!");
      navigate("/signin/forgot-password/send-otp/reset-password");
    } catch (err: any) {
      const errorMessage = err?.data?.message;

      let displayMessage: string;

      if (Array.isArray(errorMessage)) {
        displayMessage = errorMessage.join(", ");
      } else if (typeof errorMessage === "string") {
        displayMessage = errorMessage;
      } else {
        displayMessage = "Failed to verify OTP!";
      }

      showError(displayMessage);
    }
  };

  const handleResendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email: userEmail }).unwrap();
      showSuccess("Resend OTP successfully!");
    } catch (err: any) {
      const errorMessage = err?.data?.message;

      let displayMessage: string;

      if (Array.isArray(errorMessage)) {
        displayMessage = errorMessage.join(", ");
      } else if (typeof errorMessage === "string") {
        displayMessage = errorMessage;
      } else {
        displayMessage = "Failed to resend OTP!";
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

      {/* Dark Overlay - Only affects background */}
      <div className="absolute inset-0 bg-black/65" />
      {/* Try /60 for lighter, /70-/75 for darker */}

      {/* OTP Card - Beautiful & Fully Responsive */}
      <div className="relative w-full max-w-lg">
        <div className="bg-white/97 backdrop-blur-sm shadow-2xl rounded-2xl p-8 sm:p-10 lg:p-12 text-center">
          {/* Icon */}
          <div className="flex items-center justify-center gap-3 mb-7">
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

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
            Check Your Email
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-10 max-w-xs mx-auto leading-relaxed">
            We've sent a 6-digit verification code to your email address
          </p>

          <div className="flex justify-center gap-3 sm:gap-4 mb-10">
            {Array.from({ length }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                value={otp[index] || ""}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                         text-lg sm:text-xl font-bold text-center
                         border-1 border-gray-300 rounded-2xl
                         focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-200
                         transition-all duration-200 bg-white"
                placeholder="0"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl text-lg transition transform hover:scale-[1.02] active:scale-100 shadow-lg mb-5"
            onClick={handleSubmit}
          >
            {isloadingOTP ? "Verifing..." : "Verify & Continue"}
          </button>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              className="text-purple-600 hover:text-purple-700 font-semibold text-base hover:underline transition"
              onClick={handleResendOtp}
            >
              {isLoading ? "Resending OTP..." : "Resend OTP"}
            </button>
          </div>

          {/* Back Link */}
          <div className="mt-6">
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

export default SendOtp;
