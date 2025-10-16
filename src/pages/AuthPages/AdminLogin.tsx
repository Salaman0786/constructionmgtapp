import React, { useState } from "react";
import { Mail, Eye, EyeOff, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password, "all get");

    // Simple static authentication
    if (email === "admin@addisababa.com" && password === "password123") {
      setError("");
      navigate("/"); // redirect to home/dashboard
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-purple-900 text-white flex-col justify-center px-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white/20 p-3 rounded-xl">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Addis Ababa Jamaat</h2>
            <p className="text-lg opacity-90">Construction Management</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg leading-relaxed mb-6">
          Manage your construction projects, track investments, and oversee
          operations with our comprehensive management system.
        </p>

        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-2 text-lg ">
            <span className="text-yellow-300">•</span> Complete project
            oversight
          </li>
          <li className="flex items-center gap-2 text-lg ">
            <span className="text-yellow-300">•</span> Financial tracking &
            reporting
          </li>
          <li className="flex items-center gap-2 text-lg ">
            <span className="text-yellow-300">•</span> Investor & vendor
            management
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <form
          onSubmit={handleLogin}
          className="border rounded-xl shadow-md p-8 max-w-full w-[370px] sm:w-[380px] md:w-[380px] lg:w-[480px]"
        >
          <h2 className="text-center text-xl font-semibold mb-2">
            Admin Login
          </h2>
          <p className="text-center text-gray-500 text-lg mb-6">
            Access the administrative dashboard
          </p>

          {/* Email */}
          <label className="block text-lg mb-1 font-medium text-gray-700">
            Email
          </label>
          <div className="relative mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@addisababa.com"
              className="w-full border rounded-md px-3 py-2 pr-10 text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <Mail className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          {/* Password */}
          <label className="block text-lg mb-1 font-medium text-gray-700">
            Password
          </label>
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border rounded-md px-3 py-2 pr-10 text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-xs mb-4 text-center">{error}</p>
          )}

          <a
            href="#"
            className="text-base text-purple-700 hover:underline block mb-4 text-right"
          >
            Forgot Password?
          </a>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-purple-800 text-lg text-white py-2 rounded-md hover:bg-purple-900 transition"
          >
            Login to Admin Dashboard
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-base text-gray-500 hover:text-purple-700 transition"
            >
              Switch to User Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
