import React, { useState } from "react";
import { X } from "lucide-react";

interface AddRoleProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRole: (role: RoleData) => void;
}

interface RoleData {
  roleName: string;
  description: string;
  permissions: string[];
}

const AddRole: React.FC<AddRoleProps> = ({ isOpen, onClose, onCreateRole }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);

  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = () => {
    if (!roleName || !description)
      return alert("Please fill all required fields!");
    onCreateRole({ roleName, description, permissions });
    setRoleName("");
    setDescription("");
    setPermissions([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add New Role</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Project Manager"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Role description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Permissions <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-700">System</p>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.includes("Full Access")}
                    onChange={() => togglePermission("Full Access")}
                    className="accent-purple-600"
                  />
                  Full Access
                </label>
              </div>

              <div>
                <p className="font-medium text-gray-700">General</p>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.includes("View All Data")}
                    onChange={() => togglePermission("View All Data")}
                    className="accent-purple-600"
                  />
                  View All Data
                </label>
              </div>

              <div>
                <p className="font-medium text-gray-700">Financial</p>
                <div className="space-y-1">
                  {[
                    "View Financial Data",
                    "Manage Invoices",
                    "Manage Payments",
                    "Manage Expenses",
                  ].map((perm) => (
                    <label key={perm} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="accent-purple-600"
                      />
                      {perm}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-700">Limited</p>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.includes("View Own Data Only")}
                    onChange={() => togglePermission("View Own Data Only")}
                    className="accent-purple-600"
                  />
                  View Own Data Only
                </label>
              </div>
              <div>
                <p className="font-medium text-gray-700">Admin</p>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.includes("Manage Users")}
                    onChange={() => togglePermission("Manage Users")}
                    className="accent-purple-600"
                  />
                  Manage Users
                </label>
              </div>
              <div>
                <p className="font-medium text-gray-700">Operations</p>
                <div className="space-y-1">
                  {[
                    "Manage Investors",
                    "Manage Vendors",
                    "Manage Units",
                    "Manage Inventory",
                  ].map((perm) => (
                    <label key={perm} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="accent-purple-600"
                      />
                      {perm}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-700">Reports</p>
                <div className="space-y-1">
                  {["View Reports", "Export Data"].map((perm) => (
                    <label key={perm} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="accent-purple-600"
                      />
                      {perm}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-md bg-[#4b0082] text-white hover:bg-[#4b0089]"
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRole;
