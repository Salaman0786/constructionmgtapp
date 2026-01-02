import React, { useState } from "react";
import { X, Mail, EyeOff, Eye } from "lucide-react";
import {
  useAddUserMutation,
  useGetRolesQuery,
} from "../../../features/user/api/userApi";
import { showError, showSuccess } from "../../../utils/toast";
import { RequiredLabel } from "../../common/RequiredLabel";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUser: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "",
    tempPassword: "",
  });

  const [addUser, { isLoading }] = useAddUserMutation();
  const { data: rolesData, isLoading: rolesLoading } =
    useGetRolesQuery(undefined);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      userName: form.username,
      fullName: form.fullName,
      email: form.email,
      // roleId: roleMap[form.role],
      roleId: form.role,
      password: form.tempPassword,
    };

    try {
      await addUser(payload).unwrap();
      showSuccess("User created successfully!");
      onClose();
      setForm({
        username: "",
        email: "",
        fullName: "",
        role: "",
        tempPassword: "",
      });
    } catch (err: any) {
      const errorMessage = err?.data?.message;

      let displayMessage: string;

      if (Array.isArray(errorMessage)) {
        // If it's an array → join all messages (you can also take just the first one)
        displayMessage = errorMessage.join(", ");
        // Or just the first one: errorMessage[0]
      } else if (typeof errorMessage === "string") {
        displayMessage = errorMessage;
      } else {
        displayMessage = "Failed to add user!";
      }

      showError(displayMessage);
    }
  };
  const handleCancel = () => {
    onClose();
    setForm({
      username: "",
      email: "",
      fullName: "",
      role: "",
      tempPassword: "",
    });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 m-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">Add New User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Create a new user account with assigned role.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <RequiredLabel label="Username" />
              <input
                type="text"
                name="username"
                placeholder="john_doe"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
              />
            </div>
            <div>
              <RequiredLabel label="Email" />
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  title={form.email}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 pr-10 text-sm
focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                />
                <Mail
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <RequiredLabel label="Full Name" />
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            />
          </div>

          {/* Role */}
          <div>
            <RequiredLabel label="Role" />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              disabled={rolesLoading}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            >
              <option value="">Select role</option>
              {rolesData?.data?.roles?.map((role: any) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Temporary Password */}
          <div className="relative">
            <RequiredLabel label="Temporary Password" />
            <input
              type={showPassword ? "text" : "password"}
              name="tempPassword"
              placeholder="Temporary password"
              value={form.tempPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md p-2 pr-10 text-sm
  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700
              hover:bg-[#facf6c] hover:border-[#fe9a00]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#4b0082] text-white rounded-md text-sm hover:bg-[#5b00a2] disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
