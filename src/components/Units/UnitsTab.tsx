import React, { useState } from "react";
import { House, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import AddUnits from "./AddUnits";

interface Role {
  id: number;
  name: string;
  description: string;
  users: number;
  amenities: string[];
  buildingNo: string;
  floorNo: string;
  type: string;
  area: string;
  amount: string;
  status: string;
}

const rolesData: Role[] = [
  {
    id: 1,
    buildingNo: "A-101",
    floorNo: "Floor 1",
    name: "Ahmed Hassan",
    description: "Full system access and management capabilities",
    users: 1,
    amenities: ["Parking", "Balcony", "+1"],
    type: "Residential",
    area: "120 m²	",
    amount: "$75,000",
    status: "Sold",
  },
  {
    id: 2,
    buildingNo: "B-205",
    floorNo: "Floor 2",
    name: "-",
    description: "Limited access for staff members",
    users: 1,
    amenities: ["Parking", "Balcony", "+2"],
    type: "Residential",
    area: "85 m²",
    amount: "$85,000",
    status: "Available",
  },
  {
    id: 3,
    buildingNo: "C-301",
    floorNo: "Floor 3",
    name: "-",
    description: "Site management and operational oversight",
    users: 1,
    amenities: ["Loading Bay", "High Ceiling", "+1"],
    type: "Commercial",
    area: "150 m²",
    amount: "$95,000",
    status: "Hold",
  },
  {
    id: 4,
    buildingNo: "D-205",
    floorNo: "Floor 4",
    name: "-",
    description: "Limited access for staff members",
    users: 1,
    amenities: ["Parking", "Balcony", "+1"],
    type: "Commercial",
    area: "220 m²	",
    amount: "$150,000",
    status: "Sold",
  },
];

export const UnitsTab: React.FC = () => {
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
  const [form, setForm] = useState({
    role: "",
    type: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCreateRole = (roleData: any) => {};
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-6">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-gray-900 font-semibold text-base">
              Units Directory
            </h2>
            <p className="text-sm text-gray-500">
              Complete inventory of residential and commercial units
            </p>
          </div>
          <button
            className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-sm px-3 py-2 rounded-md"
            onClick={() => setOpenAddRole(true)}
          >
            <Plus size={16} /> Add Unit
          </button>
        </div>

        {/* Search and Actions */}
        <div className="flex justify-start items-center mb-3 flex-wrap gap-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex items-center gap-3">
            <label className="text-base font-medium text-gray-700 whitespace-nowrap">
              Type
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none w-[150px]"
            >
              <option value="">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-base font-medium text-gray-700 whitespace-nowrap">
              Status
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none w-[150px]"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="hold">Hold</option>
            </select>
          </div>

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
                <th className="p-3">Unit</th>
                <th className="p-3">Type</th>
                <th className="p-3">Area</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Amenities</th>
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
                        <House size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {role.buildingNo}
                        </div>
                        <div className="text-xs text-gray-500">
                          {role.floorNo}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="text-xs font-medium px-2 py-1 border rounded-full bg-white text-black">
                      {role.type}
                    </span>
                  </td>

                  <td className="p-3 text-gray-700">{role.area}</td>
                  <td className="p-3 text-gray-700">{role.amount}</td>
                  <td className="p-3 text-gray-700">{role.name}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        role.status === "Available"
                          ? "bg-[#4b0082] text-white"
                          : "bg-[#e6d6f5] text-[#4b0082]"
                      }`}
                    >
                      {role.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {role.amenities.map((perm, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium px-2 py-1 border rounded-full bg-white text-black"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
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
          <AddUnits
            isOpen={openAddRole}
            onClose={() => setOpenAddRole(false)}
            onCreateRole={handleCreateRole}
          />
        </div>
      </div>
    </div>
  );
};
