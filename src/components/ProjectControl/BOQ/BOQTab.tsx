import React, { useEffect, useRef, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleDollarSign,
  CreditCard,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import AddInvestors from "../../Finance&CRM/Investors/AddInvestors";
import AddBOQ from "./AddBOQ";
import useClickOutside from "../../../hooks/useClickOutside";
import { useSelector } from "react-redux";

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
  const userRole = useSelector((state: any) => state.auth.user?.role?.name);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const data = { pagination: { totalPages: "2", total: "20" } };
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;

  const goToFirst = () => setPage(1);
  const goToLast = () => setPage(totalPages);
  const goToPrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  useClickOutside(
    filterRef,
    () => {
      setFilterOpen(false);
    },
    [filterBtnRef]
  );
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
    <div>
      {/* 2️⃣ Search & Controls Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow p-4 rounded-lg border border-[f0f0f0] mt-6">
        <div className="relative w-full md:w-9/10">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search BOQ..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </div>

        {/* <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Filter size={16} /> Filters
          </button>
        </div> */}
        <div className="relative min-w-max">
          <button
            ref={filterBtnRef}
            onClick={() => {
              // setTempStart(startDateFilter);
              // setTempEnd(endDateFilter);
              // setTempStatus(statusFilter);
              setFilterOpen(!filterOpen);
            }}
            className="flex items-center gap-2 px-4 py-2 border  border-[f0f0f0]  rounded-lg text-sm font-medium bg-[#4b0082] text-white hover:text-gray-700 hover:bg-[#facf6c] hover:border-[#fe9a00]"
          >
            <Filter size={16} /> Filters
          </button>

          {filterOpen && (
            <div
              ref={filterRef}
              className="absolute  right-0 mt-2 w-64 max-w-[90vw] bg-white p-4 rounded-xl border shadow-lg z-10000"
            >
              <h3 className="text-sm font-semibold mb-3">Filter Projects</h3>

              {/* GRID ROW: Start & End date */}
              <div className="grid grid-cols-1 gap-1">
                {/* Start Date */}
                <label className="text-xs text-gray-600">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    // value={tempStart}
                    // onChange={(e) => setTempStart(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm 
               focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                  />
                  <Calendar
                    size={16}
                    onClick={(e) =>
                      (
                        e.currentTarget
                          .previousElementSibling as HTMLInputElement
                      )?.showPicker?.()
                    }
                    className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 mt-2 gap-1">
                {/* End Date */}

                <label className="text-xs text-gray-600">End Date</label>

                <div className="relative">
                  <input
                    type="date"
                    // value={tempEnd}
                    // onChange={(e) => setTempEnd(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 pr-10 text-sm 
        focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                  />

                  <Calendar
                    size={16}
                    onClick={(e) =>
                      (
                        e.currentTarget
                          .previousElementSibling as HTMLInputElement
                      )?.showPicker?.()
                    }
                    className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Status Below */}
              <div className="mt-2">
                <label className="text-xs text-gray-600">Status</label>
                <select
                  // value={tempStatus}
                  // onChange={(e) => setTempStatus(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm 
               focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                >
                  <option value="">All</option>
                  <option value="PLANNING">Planning</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className="text-sm text-gray-600 hover:underline"
                  // onClick={() => {
                  //   setTempStart("");
                  //   setTempEnd("");
                  //   setTempStatus("");
                  // }}
                >
                  Reset
                </button>

                <button
                  className="bg-[#4b0082] text-white text-sm px-4 py-2 rounded-lg"
                  // onClick={() => {
                  //   setStartDateFilter(tempStart);
                  //   setEndDateFilter(tempEnd);
                  //   setStatusFilter(tempStatus);
                  //   setFilterOpen(false);
                  // }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-6">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-gray-900 font-semibold text-base">
                BOQ Master & Tracking Table
              </h2>
              {/* <p className="text-sm text-gray-500">
                Comprehensive management of quantities, costs, and progress
              </p> */}
            </div>
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 text-sm justify-end">
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
                <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50 whitespace-nowrap">
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
                  <th className="p-3">Action</th>
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
                    {/* <td className="relative p-3 text-center">
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
                    </td> */}
                    <td className="px-4 py-3 text-center">
                      <button
                        data-user-menu-btn
                        className="p-2 rounded-lg hover:bg-[#facf6c]"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMenuPosition({
                            top: rect.bottom + 6,
                            left: rect.right - 140,
                          });
                          setActiveMenuId(
                            activeMenuId === user.id ? null : user.id
                          );
                        }}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {activeMenuId === user.id && (
                        <div
                          data-user-menu
                          className="fixed w-36 py-1 px-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]"
                          style={{
                            top: menuPosition.top,
                            left: menuPosition.left,
                          }}
                        >
                          <button
                            onClick={() => {
                              // setSelectedProjectId(project.id);
                              // setViewModalOpen(true);
                              // setOpenMenuId(null); // 🔥 CLOSE MENU
                            }}
                            className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c]"
                          >
                            <Eye size={16} /> View
                          </button>

                          {(userRole === "SUPER_ADMIN" ||
                            userRole === "MANAGER") && (
                            <button
                              onClick={() => {
                                // setSelectedProjectId(project.id); // send id to modal
                                // setIsModalOpen(true);
                                // setOpenMenuId(null); // 🔥 CLOSE MENU
                              }}
                              className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c]"
                            >
                              <Edit size={16} /> Edit
                            </button>
                          )}

                          {userRole === "SUPER_ADMIN" && (
                            <button
                              onClick={() => {
                                // setSelectedProject(project);
                                // setSelectedProjectId(project.id);
                                // setSingleDeleteConfirmOpen(true);
                                // setOpenMenuId(null); // 🔥 CLOSE MENU
                              }}
                              className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg text-red-600 hover:bg-[#facf6c]"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 pt-3 sm:px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span className="text-sm sm:text-base">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalItems)} of {totalItems} results
            </span>

            <div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToFirst}
                  disabled={page === 1}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
        text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft size={18} />
                </button>

                <button
                  onClick={goToPrev}
                  disabled={page === 1}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
        text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="px-2 text-sm font-medium">
                  Page {page} of {totalPages}
                </div>

                <button
                  onClick={goToNext}
                  disabled={page === totalPages}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
        text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={goToLast}
                  disabled={page === totalPages}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
        text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
