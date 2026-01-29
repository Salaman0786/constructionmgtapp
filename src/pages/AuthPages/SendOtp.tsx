import React, { useState, useRef } from "react";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  useForgotPasswordMutation,
  useVerifyOTPMutation,
} from "../../features/auth/api/authApi";
import { setUserToken } from "../../features/auth/slices/authSlice";
import { showError, showSuccess } from "../../utils/toast";

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface VerifyOtpResponse {
  data: {
    resetToken: string;
  };
}

interface ApiErrorData {
  message?: string | string[];
}

const SendOtp: React.FC = () => {
  const { userEmail } = useAppSelector(
    (state: { auth: { userEmail: string } }) => state.auth,
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const length = 6;

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [verifyOTP, { isLoading: isLoadingOTP }] = useVerifyOTPMutation();

  const handleChange = (value: string, index: number): void => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = otp.split("");
    while (newOtp.length < length) newOtp.push("");

    newOtp[index] = value;
    setOtp(newOtp.join(""));

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ): void => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = otp.split("");
        newOtp[index] = "";
        setOtp(newOtp.join(""));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();

    const payload: VerifyOtpPayload = {
      email: userEmail,
      otp,
    };

    try {
      const response = (await verifyOTP(payload).unwrap()) as VerifyOtpResponse;

      dispatch(setUserToken({ token: response.data.resetToken }));

      showSuccess("Verify OTP successfully!");
      navigate("/signin/forgot-password/send-otp/reset-password");
    } catch (err) {
      const apiError = err as FetchBaseQueryError & {
        data?: ApiErrorData;
      };

      const errorMessage = apiError?.data?.message;

      let displayMessage = "Failed to verify OTP!";

      if (Array.isArray(errorMessage)) {
        displayMessage = errorMessage.join(", ");
      } else if (typeof errorMessage === "string") {
        displayMessage = errorMessage;
      }

      showError(displayMessage);
    }
  };

  const handleResendOtp = async (
    e: React.FormEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();

    const payload: ForgotPasswordPayload = { email: userEmail };

    try {
      await forgotPassword(payload).unwrap();
      showSuccess("Resend OTP successfully!");
    } catch (err) {
      const apiError = err as FetchBaseQueryError & {
        data?: ApiErrorData;
      };

      const errorMessage = apiError?.data?.message;

      let displayMessage = "Failed to resend OTP!";

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
        <div className="bg-white/97 backdrop-blur-sm shadow-2xl rounded-2xl p-8 sm:p-10 lg:p-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Building2 className="w-10 h-10 text-purple-700" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Construction Mgt App
            </h2>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
            Check Your Email
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-10 max-w-xs mx-auto">
            We've sent a 6-digit verification code to your email address
          </p>

          <div className="flex justify-center gap-3 sm:gap-4 mb-10">
            {Array.from({ length }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                           text-lg sm:text-xl font-bold text-center
                           border border-gray-300 rounded-2xl
                           focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-200"
                placeholder="0"
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl text-lg transition shadow-lg mb-5"
          >
            {isLoadingOTP ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              className="text-purple-600 hover:text-purple-700 font-semibold text-base hover:underline transition"
            >
              {isLoading ? "Resending OTP..." : "Resend OTP"}
            </button>
          </div>

          <div className="mt-6">
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

export default SendOtp;
