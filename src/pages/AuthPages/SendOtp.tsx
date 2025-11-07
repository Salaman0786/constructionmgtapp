import React, { useState, useRef } from "react";
import { Clipboard } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router";
import {
  useForgotPasswordMutation,
  useVerifyOTPMutation,
} from "../../features/auth/api/authApi";
import { setUserToken } from "../../features/auth/slices/authSlice";

const SendOtp: React.FC = () => {
  const { userEmail } = useAppSelector((state) => state.auth);

  console.log(userEmail, "email got");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  // const handleChange = (value: string, index: number) => {
  //   if (!/^[0-9]?$/.test(value)) return; // Only allow numbers
  //   const newOtp = [...otp];
  //   newOtp[index] = value;
  //   setOtp(newOtp);

  //   // Auto focus next input
  //   if (value && index < 5) {
  //     inputRefs.current[index + 1]?.focus();
  //   }
  // };

  // const handleKeyDown = (
  //   e: React.KeyboardEvent<HTMLInputElement>,
  //   index: number
  // ) => {
  //   if (e.key === "Backspace" && !otp[index] && index > 0) {
  //     inputRefs.current[index - 1]?.focus();
  //   }
  // };

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
      navigate("/signin/forgot-password/send-otp/reset-password");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleResendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ userEmail }).unwrap();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600566752471-72ecb5bdf25b?auto=format&fit=crop&w=1920&q=80')", // Replace with your own background
      }}
    >
      <div className="bg-white bg-opacity-95 shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Clipboard className="text-purple-700 w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold text-gray-800">
          Send OTP
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Please enter the OTP we just sent to your inbox.
        </p>

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index] || ""}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md font-medium transition duration-200"
          onClick={handleSubmit}
        >
          Submit
        </button>

        {/* Resend OTP */}
        <button
          className="w-full border border-purple-700 text-purple-700 mt-4 py-2 rounded-md font-medium hover:bg-purple-50 transition duration-200"
          onClick={handleResendOtp}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default SendOtp;
