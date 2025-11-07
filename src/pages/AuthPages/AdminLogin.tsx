import React, { useState } from "react";
import { Mail, Eye, EyeOff, Building2, Clipboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { useLoginMutation } from "../../features/auth/api/authApi";
import { setCredentials } from "../../features/auth/slices/authSlice";
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
      dispatch(setCredentials({ token: userData.token, user: userData.user }));
      showSuccess("Login successful!");
      navigate("/");
    } catch (err) {
      showError("Login failed!");
    }
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/backgroundImage.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-95 shadow-lg rounded-2xl p-8 max-w-xs w-full sm:max-w-md mx-2 ">
        <div className="flex items-center justify-center gap-1 mb-5">
          <div className="bg-white/20 p-3 rounded-xl">
            <Building2 className="w-8 h-8 text-purple-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Addis Ababa Jamaat</h2>
            <p className="text-sm opacity-90">Construction Management</p>
          </div>
        </div>
        <h2 className="text-center text-lg font-semibold mb-2 text-gray-800">
          login
        </h2>

        {/* Heading */}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Admin@addisababa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="mr-2 accent-purple-700" />
            Remember me
          </label>
          <a
            onClick={handleForgotPassword}
            className="text-sm text-purple-600 hover:underline hover:cursor-pointer"
          >
            Forgot password
          </a>
        </div>

        {/* Login button */}
        <button
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md font-medium transition duration-200"
          onClick={handleSubmit}
        >
          {isLoading ? "Logining..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
