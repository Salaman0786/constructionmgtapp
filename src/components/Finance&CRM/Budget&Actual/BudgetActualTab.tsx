import React, { useEffect, useRef, useState } from "react";
import {
  CreditCard,
  MoreHorizontal,
  Phone,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  phone: string;
  nationality: string;
  email: string;

  amount: string;
  subAmount: string;
  units: string;
  date: string;
  dueDate: string;
  invoiceNo: string;
  paid: string;
  remaining: string;
  percentage: string;
  paymentId: string;
  method: string;
  reference: string;
  category: string;
  budgeted: string;
  actual: string;
  difference: string;
  change: string;
  status: string;
}

const usersData: User[] = [
  {
    id: 1,
    paymentId: "PAY-2024-001",
    invoiceNo: "INV-2024-001",
    name: "Ahmed Hassan",
    method: "Bank Transfer",
    reference: "TXN-BT-001234",
    amount: "USD 15,000",
    remaining: "$0",
    date: "15/01/2024",

    email: "ahmed.hassan@email.com",
    phone: "+251911234567",
    nationality: "American",

    subAmount: "ETB 816,150",
    units: "C-301",

    dueDate: "10/08/2024",
    paid: "$10,000",

    percentage: "40% paid",
    category: "Material Costs",
    budgeted: "$500,000",
    actual: "$485,000",
    difference: "+$15,000",
    change: "3%",
    status: "Under Budget",
  },

  {
    id: 2,
    paymentId: "PAY-2024-002",
    invoiceNo: "INV-2024-002",
    name: "Sarah Johnson",
    method: "Online",
    reference: "TXN-ON-005678",
    amount: "USD 10,000",
    remaining: "$15,000",
    date: "25/09/2024",

    email: "sarah.j@email.com",
    phone: "+1234567890",
    nationality: "American",
    subAmount: "ETB 1,632,300",
    units: "B-205",

    dueDate: "19/03/2024",
    paid: "$0",

    percentage: "0% paid",
    category: "Labor Costs",
    budgeted: "$350,000",
    actual: "$365,000",
    difference: "$-15,000",
    change: "4.3%",
    status: "Over Budget",
  },
  {
    id: 3,
    paymentId: "PAY-2024-003",
    invoiceNo: "INV-2024-003",
    name: "Omar Al-Rashid",
    method: "Check",
    reference: "CHK-001234",
    amount: "USD 5,000",
    remaining: "$25,000",
    date: "02/10/2024",

    email: "omar.rashid@email.com",
    phone: "+966501234567",
    nationality: "Saudi Arabian",

    subAmount: "ETB 1,359,500",
    units: "A-101",

    dueDate: "13/05/2024",
    paid: "$15,000",

    percentage: "100% paid",
    category: "Equipment Rental",
    budgeted: "$120,000",
    actual: "$118,000",
    difference: "+$2,000",
    change: "1.7%",
    status: "Under Budget",
  },
];

export const BudgetActualTab: React.FC = () => {
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
              Detailed Budget Analysis
            </h2>
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
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50">
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
                <th className="p-3">Category</th>
                <th className="p-3">Budgeted</th>
                <th className="p-3">Actual</th>
                <th className="p-3">Difference</th>
                <th className="p-3">Change</th>
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

                  <td className="p-3 text-gray-700">{user.category}</td>
                  <td className="p-3 text-gray-700">{user.budgeted}</td>
                  <td className="p-3 text-gray-700">{user.actual}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.difference.includes("+")
                          ? " text-green-700"
                          : " text-red-700"
                      }`}
                    >
                      {user.difference}
                    </span>
                  </td>
                  <td className="p-3 text-left">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full flex items-center justify-start gap-2 ${
                        user.difference.includes("+")
                          ? " text-green-700"
                          : " text-red-700"
                      }`}
                    >
                      {user.difference.includes("+") ? (
                        <TrendingDown size={15} />
                      ) : (
                        <TrendingUp size={15} />
                      )}{" "}
                      {user.change}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.difference.includes("+")
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 pt-3 sm:px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span className="text-sm sm:text-base">
            Showing 1 to 3 of 10 results
          </span>

          <div>
            <div className="flex items-center space-x-2">
              <button className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                «
              </button>

              <button className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                ‹
              </button>
              <div>...</div>

              <button className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                ›
              </button>

              <button className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
