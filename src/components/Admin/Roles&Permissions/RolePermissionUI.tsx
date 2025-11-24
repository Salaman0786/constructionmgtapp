import React, { useEffect, useState } from "react";
import {
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "../../../features/role/api/roleApi";

// Sample sections and permissions
const sections = [
  {
    title: "Dashboard",
    permissions: [],
  },
  {
    title: "Project Control",
    permissions: [],
  },
  {
    title: "Procurement",
    permissions: [
      "Purchase Request (PR)",
      "Request for Quotation (RFQ)",
      "Purchase Orders (PO)",
      "Goods Received Note (GRN)",
    ],
  },
  {
    title: "Inventory",
    permissions: [],
  },
  {
    title: "Audit Logs",
    permissions: [],
  },
  {
    title: "Contracts & Billing",
    permissions: [],
  },
  {
    title: "Finance & CRM",
    permissions: [],
  },
  {
    title: "Quality & Safety",
    permissions: [],
  },
  {
    title: "Documents & Control",
    permissions: [],
  },
  {
    title: "Reports",
    permissions: [],
  },
  {
    title: "Admin",
    permissions: [],
  },
];
interface AddEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string | null; // if present → edit mode
}
const RolePermissionUI: React.FC<AddEditProjectModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [descriptionValue, setDescriptionValue] = useState<any[]>("");
  const [sections, setSections] = useState<any[]>([]);
  const { data, isLoading } = useGetRoleByIdQuery(projectId!, {
    skip: !projectId,
  });
  useEffect(() => {
    if (!data) return;

    const apiSections = data.data.modules.map((m: any) => ({
      title: m.name,
      permissions:
        m.subModules?.map((s: any) => ({
          id: s.id,
          name: s.name,
          permission: s.permission,
        })) || [],
    }));
    setDescriptionValue(data?.data?.description);
    setSections(apiSections);
  }, [data]);
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();
  const buildUpdatePayload = () => {
    return {
      description: descriptionValue || "",
      modules: sections.map((sec) => ({
        name: sec.title,
        subModules: sec.permissions.map((p) => ({
          name: p.name,
          canRead: p.permission.canRead,
          canCreate: p.permission.canCreate,
          canEdit: p.permission.canEdit,
          canDelete: p.permission.canDelete,
        })),
      })),
    };
  };
  const handleUpdate = async () => {
    const payload = buildUpdatePayload();

    try {
      await updateRole({
        id: projectId,
        payload,
      }).unwrap();

      alert("Role updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };
  const toggleSection = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };
  if (!isOpen) return null;
  const handlePermissionChange = (
    sectionTitle: string,
    subModuleId: string,
    field: string,
    value: boolean
  ) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.title !== sectionTitle
          ? sec
          : {
              ...sec,
              permissions: sec.permissions.map((p) =>
                p.id !== subModuleId
                  ? p
                  : {
                      ...p,
                      permission: { ...p.permission, [field]: value },
                    }
              ),
            }
      )
    );
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <h1 className="text-xl font-bold text-gray-900">
          Update Role Permission
        </h1>
        <p className="text-sm text-gray-500">
          Create a custom role with specific permissions
        </p>

        {/* ROLE NAME */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Role Name *
          </label>
          <input
            type="text"
            value={data?.data?.name}
            className="w-full mt-1 border border-gray-300 rounded-md p-2"
            placeholder="Role Names"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="w-full mt-1 border border-gray-300 rounded-md p-2"
            value={descriptionValue}
            onChange={(e) => {
              setDescriptionValue(e.target.value);
            }}
            placeholder="Enter description"
          ></textarea>
        </div>

        <h2 className="text-md font-semibold text-gray-900 mt-6">
          Permission *
        </h2>

        {/* PERMISSION ACCORDIONS */}
        <div className="space-y-2">
          {sections.map((sec) => (
            <div key={sec.title} className="border rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection(sec.title)}
                className="w-full flex justify-between items-center p-3 bg-gray-100"
              >
                <span>{sec.title}</span>
                <span>{openSection === sec.title ? "−" : "+"}</span>
              </button>

              {openSection === sec.title && (
                <div className="p-4 bg-white border-t">
                  {sec.permissions.length === 0 ? (
                    <p>No permissions available</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2">Section</th>
                          <th className="p-2 text-center">View</th>
                          <th className="p-2 text-center">Add</th>
                          <th className="p-2 text-center">Edit</th>
                          <th className="p-2 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sec.permissions.map((p) => (
                          <tr key={p.id} className="border-b">
                            <td className="p-2">{p.name}</td>

                            {/* view */}
                            <td className="p-2 text-center">
                              <input
                                type="checkbox"
                                checked={p.permission.canRead}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    sec.title,
                                    p.id,
                                    "canRead",
                                    e.target.checked
                                  )
                                }
                              />
                            </td>

                            {/* add */}
                            <td className="p-2 text-center">
                              <input
                                type="checkbox"
                                checked={p.permission.canCreate}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    sec.title,
                                    p.id,
                                    "canCreate",
                                    e.target.checked
                                  )
                                }
                              />
                            </td>

                            {/* edit */}
                            <td className="p-2 text-center">
                              <input
                                type="checkbox"
                                checked={p.permission.canEdit}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    sec.title,
                                    p.id,
                                    "canEdit",
                                    e.target.checked
                                  )
                                }
                              />
                            </td>

                            {/* delete */}
                            <td className="p-2 text-center">
                              <input
                                type="checkbox"
                                checked={p.permission.canDelete}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    sec.title,
                                    p.id,
                                    "canDelete",
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-5">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-purple-700 text-white rounded-md text-sm"
          >
            {updating ? "Updating..." : "Update"}
          </button>
          <button
            className="px-4 py-2 border text-sm rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default RolePermissionUI;
