import React, { useEffect, useState } from "react";
import {
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "../../../features/role/api/roleApi";
import { showError, showSuccess } from "../../../utils/toast";
import { X } from "lucide-react";
import Loader from "../../common/Loader";
import { RequiredLabel } from "../../common/RequiredLabel";

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
  const isEdit = Boolean(projectId);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [descriptionValue, setDescriptionValue] = useState<any[]>("");
  const [sections, setSections] = useState<any[]>([]);
  const { data, isLoading, refetch } = useGetRoleByIdQuery(projectId!, {
    skip: !isEdit,
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

      showSuccess("Role updated successfully!");
      refetch();
      onClose();
    } catch (err) {
      showError(err.data.message || "Failed to update role");
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
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Update Role Permission
            </h1>
            <p className="text-sm text-gray-500">
              Create a custom role with specific permissions
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            {/* ROLE NAME */}
            <div className="mt-3">
              <RequiredLabel label="Role Name" />
              <input
                type="text"
                value={data?.data?.name}
                className="w-full mt-1 border border-gray-300 rounded-md p-2"
                placeholder="Role Names"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mt-3">
              <RequiredLabel label="Description" />
              <textarea
                className="w-full mt-1 border border-gray-300 rounded-md p-2"
                value={descriptionValue}
                onChange={(e) => {
                  setDescriptionValue(e.target.value);
                }}
                placeholder="Enter description"
              ></textarea>
            </div>

            <h2 className="my-2">
              <RequiredLabel label="Permission" />
            </h2>

            {/* PERMISSION ACCORDIONS */}
            <div className="space-y-2">
              {sections.map((sec) => (
                <div
                  key={sec.title}
                  className="border rounded-xl overflow-hidden"
                >
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
        )}
      </div>
    </div>
  );
};
export default RolePermissionUI;
