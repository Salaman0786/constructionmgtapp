import React from "react";
import { DocumentShimmer } from "./CommonShimmer";
import { formatLabel } from "../../utils/helpers";

interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  role: {
    name: string;
  };
}

interface Props {
  users?: ApiUser[];
  isLoading?: boolean;
}

/* Role Badge Colors */
const roleColors: Record<string, string> = {
  INVESTOR: "bg-purple-100 text-purple-700",
  MANAGER: "bg-blue-100 text-blue-700",
  SUPER_ADMIN: "bg-red-100 text-red-700",
  ADMIN: "bg-green-100 text-green-700",
  DEFAULT: "bg-gray-100 text-gray-600",
};

// const formatDate = (date: string) =>
//   new Date(date).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//   });

const ActiveUsers: React.FC<Props> = ({ users, isLoading }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Active Users</h2>
      <p className="text-sm text-gray-500 mb-4">Recently active system users</p>

      {/* ✅ Stable Height */}
      <div className={`space-y-5 min-h-[200px] flex flex-col ${
          !isLoading && (!users|| users.length === 0)
            ? "justify-center"
            : "justify-start"
        }`}>
        {isLoading ? (
          [...Array(5)].map((_, i) => <DocumentShimmer key={i} />)
        ) : users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-start border border-gray-100 rounded-xl p-3 hover:shadow-sm transition"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  {formatLabel(user.fullName)|| "Unnamed User"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                {/* <p className="text-xs text-gray-400 mt-1">
                  Joined: {formatDate(user.createdAt)}
                </p> */}
              </div>

              {/* ✅ Role Badge */}
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  roleColors[user.role?.name] || roleColors.DEFAULT
                }`}
              >
                {formatLabel(user.role?.name)}
              </span>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            No active users found
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveUsers;
