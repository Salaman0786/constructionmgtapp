import React, { useEffect, useState } from "react";
import { X, Mail } from "lucide-react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useUpdateUserMutation,
  useGetRolesQuery,
  useGetUserByIdQuery,
} from "../../../features/user/api/userApi";
import { showError, showSuccess } from "../../../utils/toast";

import { RequiredLabel } from "../../common/RequiredLabel";
import Loader from "../../common/Loader";

/* -----------------------------
   Types
-------------------------------- */

interface EditUserProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

interface EditUserForm {
  username: string;
  email: string;
  fullName: string;
  role: string;
  tempPassword: string;
}

interface Role {
  id: string;
  name: string;
}

interface RolesResponse {
  data?: {
    roles?: Role[];
  };
}

interface UserDetailsResponse {
  data?: {
    data?: {
      userName?: string;
      email?: string;
      fullName?: string;
      role?: {
        id?: string;
      };
    };
  };
}

interface UpdateUserPayload {
  userName: string;
  email: string;
  fullName: string;
  roleId: string;
  password?: string;
}

interface ApiErrorData {
  message?: string | string[];
}

/* -----------------------------
   Component
-------------------------------- */

const EditUser: React.FC<EditUserProps> = ({ isOpen, onClose, userId }) => {
  const [form, setForm] = useState<EditUserForm>({
    username: "",
    email: "",
    fullName: "",
    role: "",
    tempPassword: "",
  });

  const { data: userDetails, isFetching } = useGetUserByIdQuery(
    userId as string,
    {
      skip: !userId,
    },
  ) as {
    data?: UserDetailsResponse;
    isFetching: boolean;
  };

  const { data: rolesData, isLoading: rolesLoading } = useGetRolesQuery(
    undefined,
  ) as {
    data?: RolesResponse;
    isLoading: boolean;
  };

  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  useEffect(() => {
    if (!isOpen) {
      setForm({
        username: "",
        email: "",
        fullName: "",
        role: "",
        tempPassword: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && userDetails?.data?.data) {
      const user = userDetails.data.data;
      setForm({
        username: user.userName ?? "",
        email: user.email ?? "",
        fullName: user.fullName ?? "",
        role: user.role?.id ?? "",
        tempPassword: "",
      });
    }
  }, [userDetails, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const payload: UpdateUserPayload = {
      userName: form.username,
      email: form.email,
      fullName: form.fullName,
      roleId: form.role,
      password: form.tempPassword || undefined,
    };

    try {
      await updateUser({ id: userId as string, body: payload }).unwrap();
      showSuccess("User updated successfully!");
      onClose();
    } catch (err) {
      const apiError = err as FetchBaseQueryError & {
        data?: ApiErrorData;
      };

      const errorMessage = apiError?.data?.message;

      let displayMessage = "Failed to edit user!";

      if (Array.isArray(errorMessage)) {
        displayMessage = errorMessage.join(", ");
      } else if (typeof errorMessage === "string") {
        displayMessage = errorMessage;
      }

      showError(displayMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 m-4">
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

        {isFetching ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <RequiredLabel label="Username" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#5b00b2]"
                />
              </div>

              <div>
                <RequiredLabel label="Email" />
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 pr-10 text-sm focus:ring-1 focus:ring-[#5b00b2]"
                  />
                  <Mail
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <RequiredLabel label="Full Name" />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#5b00b2]"
              />
            </div>

            <div>
              <RequiredLabel label="Role" />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                disabled={rolesLoading}
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-[#5b00b2]"
              >
                <option value="">Select role</option>
                {rolesData?.data?.roles?.map((role: Role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={updating}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
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
