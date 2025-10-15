import React, { useState } from "react";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  Box,
  House,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import AddUnits from "../Units/AddUnits";

interface Role {
  id: number;
  name: string;
  description: string;
  users: number;
  amenities: string[];
  floorNo: string;
  type: string;
  area: string;
  amount: string;
  status: string;
  itemValue: string;
  category: string;
  stock: string;
  stockSub: string;
  cost: string;
  lastUpdate: string;
  refNo: string;
  refValue: string;
  quantity: string;
  details: string;
  date: string;
  processedBy: string;
  finalValue: string;
}

const rolesData: Role[] = [
  {
    id: 1,
    refNo: "ISS-2024-001",
    refValue: "issue",
    quantity: "50 Bags",
    itemValue: "Portland Cement (50kg)",
    cost: "",
    details: "Foundation Block A",
    date: "30/09/2024",
    processedBy: "Site Manager",
    finalValue: "negative",
    stock: "85 Bags",
    stockSub: "Min: 100 Bags",
    status: "Low Stock",
    category: "Construction Materials",
    amount: "$75,000",
    lastUpdate: "01/10/2024",
    floorNo: "Floor 1",
    name: "Ahmed Hassan",
    description: "Full system access and management capabilities",
    users: 1,
    amenities: ["Parking", "Balcony", "+1"],
    type: "Residential",
    area: "120 m²	",
  },
  {
    id: 2,
    refNo: "ISS-2024-002",
    refValue: "issue",
    quantity: "75 Meters",
    itemValue: "PVC Pipe 20mm",
    cost: "",
    details: "Plumbing installation Unit A-101",
    date: "30/09/2024",
    processedBy: "Plumbing Contractor",
    finalValue: "positive",
    category: "Construction Materials",
    stock: "250 Pieces",
    stockSub: "Min: 200 Pieces",
    status: "In Stock",
    amount: "$2,187.5",
    lastUpdate: "28/09/2024",
    floorNo: "Floor 2",
    name: "-",
    description: "Limited access for staff members",
    users: 1,
    amenities: ["Parking", "Balcony", "+2"],
    type: "Residential",
    area: "85 m²",
  },
  {
    id: 3,
    refNo: "GRN-2024-001",
    refValue: "GRN",
    quantity: "100 Bags",
    itemValue: "Portland Cement (50kg)",
    cost: "$12.50",
    details: "Addis Construction Materials Ltd",
    date: "	28/09/2024",
    processedBy: "Admin User",
    finalValue: "negative",
    category: "Electrical",
    stock: "150 Meters",
    stockSub: "Min: 200 Meters",
    status: "Low Stock",
    amount: "$337.5",
    lastUpdate: "30/09/2024",
    floorNo: "Floor 3",
    name: "-",
    description: "Site management and operational oversight",
    users: 1,
    amenities: ["Loading Bay", "High Ceiling", "+1"],
    type: "Commercial",
    area: "150 m²",
  },
  {
    id: 4,
    refNo: "ISS-2024-001",
    refValue: "issue",
    quantity: "50 Bags",
    itemValue: "Portland Cement (50kg)",
    cost: "$12.50",
    details: "Foundation Block A",
    date: "30/09/2024",
    processedBy: "Site Manager",
    finalValue: "positive",
    category: "Plumbing",
    stock: "0 Meters",
    stockSub: "Min: 50 Meters",
    status: "Out of Stock",
    amount: "$0",
    lastUpdate: "25/09/2024",
    floorNo: "Floor 4",
    name: "-",
    description: "Limited access for staff members",
    users: 1,
    amenities: ["Parking", "Balcony", "+1"],
    type: "Commercial",
    area: "220 m²	",
  },
];

export const TransactionInventory: React.FC = () => {
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
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-gray-900 font-semibold text-base">
            Stock Movements
          </h2>
          <p className="text-sm text-gray-500">
            Complete history of stock receipts and issues
          </p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex justify-start items-center mb-3 flex-wrap gap-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {/* <div className="flex items-center gap-3">
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
        </div> */}

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
              <th className="p-3">Reference</th>
              <th className="p-3">Item</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Cost/Details</th>
              <th className="p-3">Date</th>
              <th className="p-3">Processed By</th>
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
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        role.finalValue === "negative"
                          ? "bg-red-200 text-red-500"
                          : "bg-green-200 text-green-500"
                      }   font-medium uppercase`}
                    >
                      {role.finalValue === "negative" ? (
                        <ArrowDownLeft size={16} />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {role.refNo}
                      </div>
                      <div className="text-xs text-gray-500">
                        {role.refValue}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-3 text-gray-700">{role.itemValue}</td>
                <td className="p-3 text-gray-700">{role.quantity}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-medium text-gray-900">
                        {role.cost}
                      </div>
                      <div className="text-xs text-gray-500">
                        {role.details}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-gray-700">{role.date}</td>
                <td className="p-3 text-gray-700">{role.processedBy}</td>
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
  );
};
