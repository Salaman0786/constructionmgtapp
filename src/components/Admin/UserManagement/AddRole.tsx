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
  // 🔹 Local States
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);

  // ✅ Define permission groups (later can be fetched from API)
  const permissionGroups = [
    {
      category: "Project Control",
      items: [
        "Projects",
        "Gantt & Scheduling",
        "Site Diary (DPR)",
        "BOQ & Estimation",
        "Task Assignment",
      ],
    },
    {
      category: "Procurement",
      items: [
        "Purchase Request",
        "Purchase Orders",
        "Request for Quotation",
        "Goods Received Note",
      ],
    },
    {
      category: "Inventory",
      items: ["Stock Ledger", "Material Issues","Inventory Forecast ", "Reorder Alerts"],
    },
    
      {
      category: "Audit Logs",
      items: [
        "Audit Logs",
      ],
    },

     {
      category: "Contracts & Billing",
      items: [
        "Work Orders",
        "Contractor Billing",
        "Measurement Book",
      ],
    },
    {
      category: "Finance & CRM",
      items: [
        "Buyers",
        "Vendors",
        "My Units",
        "Invoices",
        "Payments",
        "Budget vs Actual",
        "Project Cost Control",
        "Cash Flow Projection",
      ],
    },
   
     {
      category: "Quality & Safety",
      items: [
        "Qa Checklists",
        "Inspection Reports",
        "Safety Incidents",
      ],
    },
    {
      category: "Document & Controls",
      items: [
        "Drawings & Revisions",
        "Submittals",
        "Request for Information",
        "Approval Logs",
      ],
    },
    {
      category: "Reports",
      items: [
        "MIS Dashboard",
        "Procurement Reports",
        "Inventory Reports",
        "Project Cost Reports",
        "AR/AP Summary ",
      ],
    },
    {
      category: "Admin",
      items: [
        "User Management",
        "Roles & Permissions",
        "Company Settings",
        "Tally Integration",
      ],
    },
  ];

  // ✅ Toggle single permission
  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  // ✅ Toggle full group (main permission)
  const toggleGroup = (group: { category: string; items: string[] }) => {
    const allSelected = group.items.every((perm) => permissions.includes(perm));
    if (allSelected) {
      setPermissions((prev) => prev.filter((p) => !group.items.includes(p)));
    } else {
      setPermissions((prev) => [...new Set([...prev, ...group.items])]);
    }
  };

  // ✅ Full Access → all permissions
  const handleFullAccess = () => {
    const allPerms = permissionGroups.flatMap((g) => g.items);
    const hasAll = allPerms.every((perm) => permissions.includes(perm));

    if (hasAll && permissions.includes("Full Access")) {
      setPermissions([]);
    } else {
      setPermissions(["Full Access", ...allPerms]);
    }
  };

  const isFullAccessActive = permissionGroups
    .flatMap((g) => g.items)
    .every((perm) => permissions.includes(perm));

  // ✅ Form submit
  const handleSubmit = () => {
    if (!roleName.trim() || !description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    onCreateRole({
      roleName,
      description,
      permissions,
    });

    // Reset after creation
    setRoleName("");
    setDescription("");
    setPermissions([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
        {/* 🔹 Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 sticky top-0">
          <h2 className="text-lg font-semibold text-gray-800">Add New Role</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* 🔹 Form Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
              placeholder="e.g. Project Manager"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
              placeholder="Describe this role’s purpose or responsibilities..."
            />
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Permissions <span className="text-red-500">*</span>
            </label>

            {/* Full Access */}
            <div className="mb-4 border-b border-gray-200 pb-2">
              <p className="font-medium text-gray-800 mb-1">System</p>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFullAccessActive}
                  onChange={handleFullAccess}
                  className="accent-purple-600"
                />
                <span className="text-gray-700 font-medium">
                  Full Access (All Modules)
                </span>
              </label>
            </div>

            {/* Permission Groups */}
            <div className="space-y-5 max-h-[45vh] overflow-y-auto pr-2">
              {permissionGroups.map((group) => {
                const allGroupSelected = group.items.every((perm) =>
                  permissions.includes(perm)
                );

                return (
                  <div
                    key={group.category}
                    className="border-b border-gray-100 pb-3"
                  >
                    {/* Group Header */}
                    <label className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        checked={allGroupSelected}
                        onChange={() => toggleGroup(group)}
                        className="accent-purple-600"
                      />
                      <p
                        className={`font-semibold ${
                          allGroupSelected ? "text-[#4B0082]" : "text-gray-800"
                        }`}
                      >
                        {group.category}
                      </p>
                    </label>

                    {/* Sub Permissions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pl-6">
                      {group.items.map((perm) => (
                        <label key={perm} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={permissions.includes(perm)}
                            onChange={() => togglePermission(perm)}
                            className="accent-purple-600"
                          />
                          <span className="text-gray-700 text-sm">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 🔹 Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-md bg-[#4B0082] text-white font-medium hover:bg-[#4B0089] transition"
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRole;
