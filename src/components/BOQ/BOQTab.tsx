import React, { useEffect, useRef, useState } from "react";
import {
  CircleDollarSign,
  CreditCard,
  MoreHorizontal,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import AddInvestors from "../Investors/AddInvestors";
import AddBOQ from "./AddBOQ";

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
  date: string;
  dueDate: string;
  invoiceNo: string;
  paid: string;
  remaining: string;
  percentage: string;
  expensesId: string;
  method: string;
  reference: string;
  item: string;
  details: string;
  company: string;

  memo: string;
  category: string;
  description: string;
  uom: string;
  qty: string;
  rate: string;
  est: string;
  qtyUsed: string;
  balance: string;
  cost: string;
  variance: string;
  vendor: string;
  remarks: string;
}

const usersData: User[] = [
  {
    id: 1,
    category: "Civil",
    description: "Excavation",
    uom: "m³",
    qty: "200",
    rate: "$50",
    est: "$10,000",
    qtyUsed: "180",
    balance: "20",
    cost: "$9,000",
    variance: "$1,000",
    vendor: "ABC Supplies",
    remarks: "Normal Progress",
    expensesId: "EXP-2024-001",
    item: "Labor",
    details: "Construction crew wages - Week 38",
    company: "Construction Team Alpha",

    amount: "USD 8,500",
    memo: "Weekly payroll for main construction team",
    status: "Paid",
    date: "18/01/2024",
    reference: "TXN-BT-001234",
    method: "Bank Transfer",
    remaining: "$0",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    phone: "+251911234567",
    nationality: "American",

    subAmount: "ETB 816,150",
    units: "C-301",
    invoiceNo: "INV-2024-001",
    dueDate: "10/08/2024",
    paid: "$10,000",

    percentage: "40% paid",
  },

  {
    id: 2,
    category: "Concrete",
    description: "RCC M20",
    uom: "m³",
    qty: "300",
    rate: "$120",
    est: "$36,000",
    qtyUsed: "310",
    balance: "-10",
    cost: "$37,000",
    variance: "$1,200",
    vendor: "XYZ Cement",
    remarks: "Overused",
    expensesId: "EXP-2024-002",
    item: "Materials",
    details: "Cement and steel reinforcement",
    company: "Addis Construction Materials Ltd",

    amount: "USD 12,500",
    memo: "Materials for foundation work Block B",
    status: "Approved",
    date: "15/01/2024",
    invoiceNo: "INV-2024-002",
    name: "Sarah Johnson",
    method: "Online",
    reference: "TXN-ON-005678",

    remaining: "$15,000",

    email: "sarah.j@email.com",
    phone: "+1234567890",
    nationality: "American",
    subAmount: "ETB 1,632,300",
    units: "B-205",

    dueDate: "19/03/2024",
    paid: "$0",

    percentage: "0% paid",
  },
  {
    id: 3,
    category: "Civil",
    description: "Excavation",
    uom: "m³",
    qty: "200",
    rate: "$50",
    est: "$10,000",
    qtyUsed: "180",
    balance: "20",
    cost: "$9,000",
    variance: "$1,000",
    vendor: "ABC Supplies",
    remarks: "Normal Progress",
    expensesId: "EXP-2024-003",
    item: "Admin",
    details: "Office supplies and utilities",
    company: "",

    amount: "USD 850",
    memo: "Monthly office operational expenses",
    status: "Pending",
    date: "15/05/2024",
    invoiceNo: "INV-2024-003",
    name: "Omar Al-Rashid",
    method: "Check",
    reference: "CHK-001234",
    remaining: "$25,000",
    email: "omar.rashid@email.com",
    phone: "+966501234567",
    nationality: "Saudi Arabian",

    subAmount: "ETB 1,359,500",
    units: "A-101",

    dueDate: "13/05/2024",
    paid: "$15,000",

    percentage: "100% paid",
  },
];

export const BOQTab: React.FC = () => {
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
              BOQ Master & Tracking Table
            </h2>
            <p className="text-sm text-gray-500">
              Comprehensive management of quantities, costs, and progress
            </p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-sm px-3 py-2 rounded-md"
          >
            <Plus size={16} /> Add BOQ Items
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
                <th className="p-3">Item Category</th>
                <th className="p-3">Item Description</th>
                <th className="p-3">UOM</th>
                <th className="p-3">Qty (Est.)</th>
                <th className="p-3">Rate</th>
                <th className="p-3">Est. Amount</th>
                <th className="p-3">Qty Used</th>
                <th className="p-3">Balance</th>
                <th className="p-3">Actual Cost</th>
                <th className="p-3">Variance</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Remarks</th>
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
                  <td className="p-3 text-gray-700">{user.category}</td>
                  <td className="p-3 text-gray-700">{user.description}</td>
                  <td className="p-3 text-gray-700">{user.uom}</td>
                  <td className="p-3 text-gray-700">{user.qty}</td>
                  <td className="p-3 text-gray-700">{user.rate}</td>
                  <td className="p-3 text-gray-700">{user.est}</td>
                  <td className="p-3 text-gray-700">{user.qtyUsed}</td>
                  <td className="p-3 text-gray-700">{user.balance}</td>
                  <td className="p-3 text-gray-700">{user.cost}</td>
                  <td className="p-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-200 text-gray-500">
                      {user.variance}
                    </span>
                  </td>

                  <td className="p-3 text-gray-700">{user.vendor}</td>
                  <td className="p-3 text-gray-700">{user.remarks}</td>
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
        <AddBOQ isOpen={openModal} onClose={() => setOpenModal(false)} />
      </div>
    </div>
  );
};
