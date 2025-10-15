import React, { useEffect, useRef, useState } from "react";
import { File, Mail, MoreHorizontal, Phone, Plus, Trash2 } from "lucide-react";
import AddVendors from "./AddVentors";

interface User {
  id: number;
  name: string;
  phone: string;
  nationality: string;
  email: string;
  status: string;

  contracts: string;

  type: string;
  vendor: string;
  tax: string;
  totalValue: string;
}

const usersData: User[] = [
  {
    id: 1,
    vendor: "Prime Steel Works",
    name: "Mohammed Ali",
    email: "ahmed.hassan@email.com",
    phone: "+251911234567",
    nationality: "American",
    status: "Active",
    totalValue: "$120,000",
    contracts: "8",
    type: "Contractor",
    tax: "TIN-0098765432",
  },
  {
    id: 2,
    vendor: "Elite Electrical Services",
    name: "Sarah Gebre",
    email: "omar.rashid@email.com",
    phone: "+966501234567",
    nationality: "Saudi Arabian",
    status: "Active",
    totalValue: "$95,000",
    contracts: "12",
    type: "Service Provider",
    tax: "TIN-0054321098",
  },
  {
    id: 3,
    vendor: "Addis Construction Materials Ltd",
    name: "Bekele Tadesse",
    email: "sarah.j@email.com",
    phone: "+1234567890",
    nationality: "American",
    status: "Active",
    totalValue: "$85,000",
    contracts: "15	",
    type: "Supplier",
    tax: "TIN-0012345678",
  },
];

export const VendorsTab: React.FC = () => {
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
              Vendor Directory
            </h2>
            <p className="text-sm text-gray-500">
              Complete list of suppliers, contractors, and service providers
            </p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-sm px-3 py-2 rounded-md"
          >
            <Plus size={16} /> Add Vendor
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
                <th className="p-3">Vendor Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Tax ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Contracts</th>
                <th className="p-3">Total Value</th>
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
                        {user.vendor.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.vendor}
                        </div>
                        <div className="text-xs text-gray-500">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#e6d6f5] text-[#4b0082]">
                      {user.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex-col items-center  gap-2">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-700">
                          <Mail size={12} />
                        </div>
                        <div className="text-xs text-gray-700">
                          {user.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-700">
                          <Phone size={12} />
                        </div>
                        <div className="text-xs text-gray-700">
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-gray-700">
                        <File size={12} />
                      </div>
                      <div className="text-xs text-gray-700"> {user.tax} </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.status === "Inactive"
                          ? "bg-[#e6d6f5] text-[#4b0082]" // light background, dark text
                          : "bg-[#4b0082] text-white" // solid indigo background
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="p-3 text-gray-700">{user.contracts}</td>
                  <td className="p-3 text-gray-700">{user.totalValue}</td>
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
        <AddVendors isOpen={openModal} onClose={() => setOpenModal(false)} />
      </div>
    </div>
  );
};
