import React, { useState } from "react";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import AddRole from "./AddRole";

interface Role {
  id: number;
  name: string;
  description: string;
  users: number;
  permissions: string[];
  type: "System" | "Custom";
}

const rolesData: Role[] = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access and management capabilities",
    users: 1,
    permissions: ["Full Access"],
    type: "System",
  },
  {
    id: 2,
    name: "Manager",
    description: "Site management and operational oversight",
    users: 1,
    permissions: [
      "View All Data",
      "Manage Inventory",
      "Manage Expenses",
      "+1 more",
    ],
    type: "Custom",
  },
  {
    id: 3,
    name: "Staff",
    description: "Limited access for staff members",
    users: 1,
    permissions: ["View Financial Data", "Manage Invoices", "Manage Payments"],
    type: "Custom",
  },
  {
    id: 4,
    name: "Viewer",
    description: "Read-only access to assigned data",
    users: 1,
    permissions: ["View Own Data Only"],
    type: "Custom",
  },
];

export const RolesTable: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(rolesData);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? roles.map((r) => r.id) : []);
  };

  const handleDeleteSelected = () => {
    setRoles((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    const selectedRoles = roles.filter((r) => selectedIds.includes(r.id));
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Role,Description,Users,Permissions,Type"]
        .concat(
          selectedRoles.map(
            (r) =>
              `${r.name},${r.description},${r.users},${r.permissions.join(
                " | "
              )},${r.type}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_roles.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleDeleteRole = (id: number) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setOpenMenuId(null);
  };

  const allSelected = selectedIds.length === roles.length && roles.length > 0;
  const [openAddRole, setOpenAddRole] = useState(false);

  const handleCreateRole = (roleData: any) => {};
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-gray-900 font-semibold text-base">
            System Roles
          </h2>
          <p className="text-sm text-gray-500">
            Define and manage user roles and permissions
          </p>
        </div>
        <button
          className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-sm px-3 py-2 rounded-md"
          onClick={() => setOpenAddRole(true)}
        >
          <Plus size={16} /> Add Role
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
      <div className="overflow-x-auto border border-gray-200 rounded-xl relative">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  className="accent-purple-700"
                  onChange={(e) => selectAll(e.target.checked)}
                />
              </th>
              <th className="p-3">Role</th>
              <th className="p-3">Users</th>
              <th className="p-3">Permissions</th>
              <th className="p-3">Type</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr
                key={role.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition relative ${
                  selectedIds.includes(role.id) ? "bg-purple-50" : ""
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(role.id)}
                    onChange={() => toggleSelect(role.id)}
                    className="accent-purple-700"
                  />
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4b0082] text-white font-medium uppercase">
                      {role.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {role.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {role.description}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-3 text-gray-700">{role.users} user</td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-[#4b0082] text-white px-2 py-1 rounded-md"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      role.type === "System"
                        ? "bg-[#4b0082] text-white"
                        : "bg-[#4b0082] text-white"
                    }`}
                  >
                    {role.type}
                  </span>
                </td>

                <td className="p-3 text-right text-gray-500 cursor-pointer hover:text-gray-700 relative">
                  <div
                    onClick={() =>
                      setOpenMenuId(openMenuId === role.id ? null : role.id)
                    }
                  >
                    <MoreHorizontal size={18} />
                  </div>

                  {openMenuId === role.id && (
                    <div className="absolute right-6 top-10 bg-white border border-gray-200 rounded-lg shadow-md w-28 z-10">
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-gray-50 text-sm"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddRole
          isOpen={openAddRole}
          onClose={() => setOpenAddRole(false)}
          onCreateRole={handleCreateRole}
        />
      </div>
    </div>
  );
};
