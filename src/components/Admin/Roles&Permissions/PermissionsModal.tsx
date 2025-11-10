import React from "react";
import { X } from "lucide-react";

interface Permission {
  module: string;
  description: string;
  actions: {
    read: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

interface RolePermissions {
  roleName: string;
  permissions: Permission[];
}

// Example mock data (can later come from API)
export const rolePermissionsData: RolePermissions[] = [
  {
    roleName: "Super Admin",
    permissions: [
      {
        module: "Projects",
        description: "Manage construction projects",
        actions: { read: true, create: true, edit: true, delete: true },
      },
      {
        module: "Gantt Charts",
        description: "Project timeline management",
        actions: { read: true, create: true, edit: true, delete: true },
      },
      {
        module: "Inventory",
        description: "Material and equipment tracking",
        actions: { read: true, create: true, edit: true, delete: true },
      },
      {
        module: "Users",
        description: "User account management",
        actions: { read: true, create: true, edit: true, delete: true },
      },
      {
        module: "Analytics",
        description: "Reports and insights",
        actions: { read: true, create: true, edit: true, delete: true },
      },
      {
        module: "Settings",
        description: "System configuration",
        actions: { read: true, create: true, edit: true, delete: true },
      },
    ],
  },
  {
    roleName: "Project Manager",
    permissions: [
      {
        module: "Projects",
        description: "Oversee ongoing projects",
        actions: { read: true, create: true, edit: true, delete: false },
      },
      {
        module: "Inventory",
        description: "Track project inventory",
        actions: { read: true, create: true, edit: false, delete: false },
      },
      {
        module: "Reports",
        description: "View and export reports",
        actions: { read: true, create: false, edit: false, delete: false },
      },
    ],
  },
  {
    roleName: "Buyers",
    permissions: [
      {
        module: "Inventory",
        description: "View purchase requests",
        actions: { read: true, create: true, edit: false, delete: false },
      },
      {
        module: "Finance",
        description: "Limited access to invoices",
        actions: { read: true, create: false, edit: false, delete: false },
      },
    ],
  },
];

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string | null;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  roleName,
}) => {
  if (!isOpen || !roleName) return null;

  const roleData = rolePermissionsData.find((r) => r.roleName === roleName);
  if (!roleData) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Permissions for {roleData.roleName}
            </h2>
            <p className="text-sm text-gray-500">
              Configure module access and actions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Permissions List */}
        <div className="p-5 space-y-4">
          {roleData.permissions.map((perm, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 last:border-0"
            >
              <div>
                <h3 className="font-medium text-gray-800">{perm.module}</h3>
                <p className="text-sm text-gray-500">{perm.description}</p>
              </div>

              <div className="flex gap-4 mt-3 md:mt-0">
                {Object.entries(perm.actions).map(([action, enabled]) => (
                  <div key={action} className="flex flex-col items-center">
                    <label
                      htmlFor={`${perm.module}-${action}`}
                      className="text-xs text-gray-500 capitalize"
                    >
                      {action}
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id={`${perm.module}-${action}`}
                        type="checkbox"
                        checked={enabled}
                        disabled
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 transition" />
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5 shadow" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
