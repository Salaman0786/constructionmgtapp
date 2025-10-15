import React, { useEffect, useRef, useState } from "react";

import AddUser from "../../AdminPanel/AddUser";

interface User {
  id: number;
  name: string;
  role: string;
  email: string;

  position: string;
  lastLogin: string;
  created: string;
  invoiceNo: string;
  totalAmount: string;
  paidAmount: string;
  outstanding: string;
  dayOverdue: string;
  item: string;
  itemValue: string;
  category: string;
  stock: string;
  avgCost: string;
  totalValue: string;
  status: string;
}

const usersData: User[] = [
  {
    id: 1,
    item: "CEM-001",
    itemValue: "Portland Cement (50kg)",
    category: "Construction Materials",
    stock: "85",
    avgCost: "$12.50",
    totalValue: "	$1,062.5",
    status: "In Stock",
    name: "Ahmed Hassan",
    invoiceNo: "INV-2024-001",
    totalAmount: "$30,000",
    paidAmount: "$0",
    outstanding: "$0",
    dayOverdue: "-",

    email: "admin@addisababa.com",
    role: "Admin",
    position: "System Administrator",
    lastLogin: "05/10/2024",
    created: "01/01/2024",
  },
  {
    id: 2,
    item: "STL-012",
    itemValue: "Steel Rebar 12mm",
    category: "Construction Materials",
    stock: "	250",
    avgCost: "$8.75",
    totalValue: "$2,187.5",
    status: "Low Stock",
    name: "Sarah Johnson",
    invoiceNo: "INV-2024-002",
    totalAmount: "$25,000",
    paidAmount: "$10,000",
    outstanding: "$15,000",
    dayOverdue: "-",

    email: "manager@addisababa.com",
    role: "Manager",

    position: "Site Manager",
    lastLogin: "04/10/2024",
    created: "15/02/2024",
  },
  {
    id: 3,
    item: "CEM-002",
    itemValue: "Portland Cement (50kg)",
    category: "Electrical",
    stock: "85",
    avgCost: "$12.50",
    totalValue: "	$1,062.5",
    status: "Low Stock",
    name: "Ahmed Hassan",
    invoiceNo: "INV-2024-001",
    totalAmount: "$30,000",
    paidAmount: "$0",
    outstanding: "$0",
    dayOverdue: "5",
    email: "accountant@addisababa.com",
    role: "Staff",

    position: "Chief Accountant",
    lastLogin: "03/10/2024",
    created: "01/03/2024",
  },
];

export const InventoryTable: React.FC = () => {
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
    <div className="py-6">
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
              <th className="p-3">Item</th>
              <th className="p-3">Item Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Current Stock</th>
              <th className="p-3">Avg Cost</th>
              <th className="p-3">Total Value</th>
              <th className="p-3">Status</th>
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
                <td className="p-3 text-gray-700">{user.item}</td>
                <td className="p-3 text-gray-700">{user.itemValue}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 border rounded-md ">
                      {user.category}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-gray-700">{user.stock}</td>
                <td className="p-3 text-gray-700">{user.avgCost}</td>
                <td className="p-3 text-gray-700">{user.totalValue}</td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.status === "In Stock"
                          ? "bg-[#4b0082] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
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
