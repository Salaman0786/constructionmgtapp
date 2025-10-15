import React, { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Phone, Plus, Trash2 } from "lucide-react";
import AddInvestors from "../Investors/AddInvestors";

interface User {
  id: number;
  name: string;
  phone: string;
  nationality: string;
  email: string;
  status: string;
  amount: string;
  subAmount: string;
  units: string;
  issueDate: string;
  dueDate: string;
  invoiceNo: string;
  paid: string;
  remaining: string;
  percentage: string;
}

const usersData: User[] = [
  {
    id: 1,
    invoiceNo: "INV-2024-001",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    phone: "+251911234567",
    nationality: "American",
    status: "PAID",
    amount: "USD 15,000",
    subAmount: "ETB 816,150",
    units: "C-301",
    issueDate: "15/01/2024",
    dueDate: "10/08/2024",
    paid: "$10,000",
    remaining: " $15,000",
    percentage: "40% paid",
  },
  {
    id: 2,
    invoiceNo: "INV-2024-002",
    name: "Omar Al-Rashid",
    email: "omar.rashid@email.com",
    phone: "+966501234567",
    nationality: "Saudi Arabian",
    status: "PARTIAL",
    amount: "USD 25,000",
    subAmount: "ETB 1,359,500",
    units: "A-101",
    issueDate: "28/01/2024",
    dueDate: "13/05/2024",
    paid: "$15,000",
    remaining: "$0",
    percentage: "100% paid",
  },
  {
    id: 3,
    invoiceNo: "INV-2024-003",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1234567890",
    nationality: "American",
    status: "ISSUED",
    amount: "	USD 30,000",
    subAmount: "ETB 1,632,300",
    units: "B-205",
    issueDate: "01/02/2024",
    dueDate: "19/03/2024",
    paid: "$0",
    remaining: "$30,000",
    percentage: "0% paid",
  },
];

export const InvoicesTab: React.FC = () => {
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-6">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-gray-900 font-semibold text-base">
              Invoice Registry
            </h2>
            <p className="text-sm text-gray-500">
              Complete list of all invoices with payment status and FX rates
            </p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-sm px-3 py-2 rounded-md"
          >
            <Plus size={16} /> Add Invoice
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
                <th className="p-3">Invoice</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Paid/Remaining</th>
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
                          {user.invoiceNo}
                        </div>
                        <div className="text-xs text-gray-500">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-700">{user.units}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.amount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.subAmount}
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.status === "PARTIAL"
                          ? "bg-[#e6d6f5] text-[#4b0082]" // light background, dark text
                          : "bg-[#4b0082] text-white" // solid indigo background
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="p-3 text-gray-700">{user.issueDate}</td>
                  <td className="p-3 text-gray-700">{user.dueDate}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.paid} / {user.remaining}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.percentage}
                      </div>
                    </div>
                  </td>

                  {/* Action menu */}
                  <td className="relative p-3 text-right">
                    <button
                      onClick={() =>
                        setActiveMenuId(
                          activeMenuId === user.id ? null : user.id
                        )
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
        <AddInvestors isOpen={openModal} onClose={() => setOpenModal(false)} />
      </div>
    </div>
  );
};
