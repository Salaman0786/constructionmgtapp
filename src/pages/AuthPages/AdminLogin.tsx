import React, { useState } from "react";
import { Mail, Eye, EyeOff, Building2, Clipboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { useLoginMutation } from "../../features/auth/api/authApi";
import { setCredentials, setRole } from "../../features/auth/slices/authSlice";
import { showError, showSuccess } from "../../utils/toast";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleForgotPassword = () => {
    navigate("/signin/forgot-password");
  };

  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          token: userData?.data?.data?.token,
          user: userData?.data?.data?.user,
        })
      );
      dispatch(
        setRole({
          role: userData?.data?.data?.user?.role?.name,
        })
      );
      showSuccess("Welcome back to Addis Ababa Jamaat!!");
      navigate("/");
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
        displayMessage = "Failed to login!";
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
      <div className="absolute inset-0 bg-black/65" />{" "}
      <div className="relative w-full max-w-lg">
        <div className="bg-white/97 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10">
          {/* Logo & Title */}
          <div className="flex items-center justify-center gap-4 mb-4">
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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-5 text-sm">
            <label className="flex items-center text-gray-600 mb-4 sm:mb-0">
              {/* <input
                type="checkbox"
                className="mr-2 rounded accent-purple-700"
              />
              Remember me */}
            </label>
            <button
              onClick={handleForgotPassword}
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-500 text-white font-bold py-3 rounded-lg text-lg transition duration-200 transform hover:scale-[1.02] active:scale-100 shadow-lg"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
