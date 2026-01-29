import React, { useState } from "react";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAppDispatch } from "../../app/hooks";
import { useLoginMutation } from "../../features/auth/api/authApi";
import { setCredentials, setRole } from "../../features/auth/slices/authSlice";
import { showError, showSuccess } from "../../utils/toast";

interface LoginPayload {
  email: string;
  password: string;
}

interface UserRole {
  name: string;
}

interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface LoginResponse {
  data: {
    data: {
      token: string;
      user: User;
    };
  };
}

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleForgotPassword = (): void => {
    navigate("/signin/forgot-password");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();

    const payload: LoginPayload = { email, password };

    try {
      const response = (await login(payload).unwrap()) as LoginResponse;

      const token = response.data.data.token;
      const user = response.data.data.user;

      dispatch(setCredentials({ token, user }));
      dispatch(setRole({ role: user.role.name }));

      showSuccess("Welcome back to Construction Mgt App!!");
      navigate("/drawings-revisions");
    } catch (err) {
      const apiError = err as FetchBaseQueryError & {
        data?: { message?: string | string[] };
      };

      const errorMessage = apiError?.data?.message;

      let displayMessage = "Failed to login!";

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
        <div className="bg-white/97 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-purple-100 p-4 rounded-2xl">
              <Building2 className="w-12 h-12 text-purple-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Construction Mgt App
            </h1>
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
            Welcome Back
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Forgot */}
          <div className="flex justify-end mb-5 text-sm">
            <button
              onClick={handleForgotPassword}
              className="text-purple-600 hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-500 text-white font-bold py-3 rounded-lg text-lg transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
