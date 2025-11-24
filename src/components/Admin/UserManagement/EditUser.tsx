import React, { useEffect, useState } from "react";
import { X, Mail } from "lucide-react";
import {
  useUpdateUserMutation,
  useGetRolesQuery,
  useGetUserByIdQuery,
} from "../../../features/user/api/userApi";
import { showError, showSuccess } from "../../../utils/toast";
import Loader from "../../common/Loader";

interface EditUserProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

const EditUser: React.FC<EditUserProps> = ({
  isOpen,
  onClose,

  userId,
}) => {
  const { data: userDetails, isLoading } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "",
    tempPassword: "",
  });

  const { data: rolesData, isLoading: rolesLoading } =
    useGetRolesQuery(undefined);

  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  /** 📌 Fill form when userDetails is fetched */
  useEffect(() => {
    if (userDetails) {
      setForm({
        username: userDetails?.data?.data?.userName || "",
        email: userDetails?.data?.data?.email || "",
        fullName: userDetails?.data?.data?.fullName || "",
        role: userDetails?.data?.data?.role?.id || "",
        tempPassword: "", // password is never returned
      });
    }
  }, [userDetails, userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** 📌 Submit update request */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      userName: form.username,
      email: form.email,
      fullName: form.fullName,
      roleId: form.role,
      password: form.tempPassword || undefined, // optional
    };

    try {
      await updateUser({ id: userId, body: payload }).unwrap();
      showSuccess("User updated successfully!");
      onClose();
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
        displayMessage = "Failed to edit user!";
      }

      showError(displayMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Update user account details.
        </p>
        {isLoading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm pr-8 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                  <Mail
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                disabled={rolesLoading}
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option value="">Select role</option>
                {rolesData?.data?.roles?.map((role: any) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={updating}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-[#4b0082] text-white rounded-md text-sm hover:bg-[#5b00a2] disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUser;
