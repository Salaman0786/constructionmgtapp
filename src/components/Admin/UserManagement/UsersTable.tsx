import React, { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import AddUser from "./AddUser";

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  status: "Active" | "Inactive";
  position: string;
  lastLogin: string;
  created: string;
}

const usersData: User[] = [
  {
    id: 1,
    name: "admin",
    email: "admin@addisababa.com",
    role: "Admin",
    status: "Active",
    position: "System Administrator",
    lastLogin: "05/10/2024",
    created: "01/01/2024",
  },
  {
    id: 2,
    name: "site_manager",
    email: "manager@addisababa.com",
    role: "Manager",
    status: "Active",
    position: "Site Manager",
    lastLogin: "04/10/2024",
    created: "15/02/2024",
  },
  {
    id: 3,
    name: "accountant",
    email: "accountant@addisababa.com",
    role: "Staff",
    status: "Active",
    position: "Chief Accountant",
    lastLogin: "03/10/2024",
    created: "01/03/2024",
  },
  {
    id: 4,
    name: "investor_portal",
    email: "investor@example.com",
    role: "Viewer",
    status: "Inactive",
    position: "Investor User",
    lastLogin: "28/09/2024",
    created: "10/04/2024",
  },
];

export const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>(usersData);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Close delete popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    setActiveMenuId(null);
  };
  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? users.map((u) => u.id) : []);
  };

  const handleDeleteSelected = () => {
    setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    const selectedUsers = users.filter((u) => selectedIds.includes(u.id));
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Email,Role,Status,Last Login,Created"]
        .concat(
          selectedUsers.map(
            (u) =>
              `${u.name},${u.email},${u.role},${u.status},${u.lastLogin},${u.created}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_users.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleToggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-gray-900 font-semibold text-base">
            System Users
          </h2>
          <p className="text-sm text-gray-500">
            Manage user accounts and access permissions
          </p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-sm px-3 py-2 rounded-md"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              {selectedIds.length} item(s) selected
            </span>
            <button
              onClick={handleExportSelected}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-md"
            >
              Export Selected
            </button>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-md"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50">
              {/* <th className="p-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  className="accent-purple-700"
                  onChange={(e) => selectAll(e.target.checked)}
                />
              </th> */}
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === users.length}
                  onChange={() =>
                    setSelectedIds(
                      selectedIds.length === users.length
                        ? []
                        : users.map((u) => u.id)
                    )
                  }
                  className="accent-purple-700"
                />
              </th>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Login</th>
              <th className="p-3">Created</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                  selectedIds.includes(user.id) ? "bg-purple-50" : ""
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="accent-purple-700"
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4b0082] text-white font-medium uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.position}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-gray-700">{user.email}</td>
                <td className="p-3">
                  <span className="text-xs font-medium bg-[#4b0082] text-white px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </td>
                {/* <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.status === "Active"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {user.status}
                    </span>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={user.status === "Active"}
                        readOnly
                      />
                      <div
                        className={`w-10 h-5 rounded-full flex justify-center items-center ${
                          user.status === "Active"
                            ? "bg-purple-700"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 mb-0.25 bg-white rounded-full transition-transform duration-300 ${
                            user.status === "Active"
                              ? "translate-x-2.5"
                              : "-translate-x-2.5"
                          }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </td> */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.status === "Active"
                          ? "bg-[#4b0082] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {user.status}
                    </span>

                    {/* Toggle Switch */}
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={user.status === "Active"}
                        onChange={() => handleToggleStatus(user.id)}
                      />
                      <div
                        className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors duration-300 ${
                          user.status === "Active"
                            ? "bg-[#4b0082]"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 mb-0.25 bg-white rounded-full shadow transform transition-transform duration-300 ${
                            user.status === "Active"
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </td>
                <td className="p-3 text-gray-700">{user.lastLogin}</td>
                <td className="p-3 text-gray-700">{user.created}</td>

                {/* Action menu */}
                <td className="relative p-3 text-right">
                  <button
                    onClick={() =>
                      setActiveMenuId(activeMenuId === user.id ? null : user.id)
                    }
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {activeMenuId === user.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-8 w-28 bg-white border border-gray-200 rounded-md shadow-md z-10"
                    >
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddUser isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};
