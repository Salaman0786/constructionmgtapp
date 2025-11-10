import React, { useState } from "react";
import { Edit, Eye, MoreHorizontal, Search, Trash2 } from "lucide-react";
import StatusSummaryCard from "./StatusSummaryCard";
import PermissionsModal from "./PermissionsModal";

interface RolesAndPermission {
  id: number; // Unique identifier for each role
  roleName: string; // e.g., "Super Admin"
  description: string; // e.g., "Full Access"
  users: number; // Number of users assigned to this role
  modules: number; // Number of modules accessible
  created: string;
}

const rolesAndPermission: RolesAndPermission[] = [
  {
    id: 1,
    roleName: "Super Admin",
    description: "Full Access",
    users: 1,
    modules: 9,
    created: "2024-01-01",
  },
  {
    id: 2,
    roleName: "Project Manager",
    description: "Operational Access",
    users: 2,
    modules: 14,
    created: "2024-01-01",
  },
  {
    id: 3,
    roleName: "Buyers",
    description: "Finance Access Only",
    users: 1,
    modules: 9,
    created: "2024-01-01",
  },
];

const PurchaseRequestTable: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // const [filterPriority, setFilterPriority] = useState<string>("All");
  // const [filterStatus, setFilterStatus] = useState<string>("All");
  // const [showFilter, setShowFilter] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredRequests.map((pr) => pr.id) : []);
  };

  const handleDeleteSelected = () => {
    alert(`${selectedIds.length} requests deleted (demo only)`);
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    alert("Exporting selected PRs (demo only)");
  };

  // Filter logic
  const filteredRequests = rolesAndPermission.filter((rp) => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      trimmedSearch === "" || rp.roleName.toLowerCase().includes(trimmedSearch);

    // const matchesPriority =
    //   filterPriority === "All" || rp.priority === filterPriority;
    // const matchesStatus = filterStatus === "All" || rp.status === filterStatus;

    // return matchesSearch && matchesPriority && matchesStatus;

    return matchesSearch;
  });

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = (action: string, roleName: string) => {
    if (action === "View") {
      setSelectedRole(roleName);
      setIsModalOpen(true);
    }else
    alert(`${action} clicked for ${roleName}`);
    setOpenMenuId(null);
  };

  return (
    <>
      <div className="mt-6 space-y-6">
        {/* ✅ Search + Filter Container */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm border border-gray-200 bg-white p-4 rounded-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Project or Requested By..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Filter Dropdown */}
          {/* <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-[#facf6c] hover:border-[#fe9a00]"
            >
              <Filter size={16} /> Filters
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-20">
                <div>
                  <label className="text-xs text-gray-600">Priority</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full border border-gray-300 rounded-md mt-1 p-1.5 text-sm"
                  >
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div className="mt-3">
                  <label className="text-xs text-gray-600">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md mt-1 p-1.5 text-sm"
                  >
                    <option value="All">All</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div> */}
        </div>

        {/* 📊 Status Summary Cards */}
        <StatusSummaryCard />

        {/* ✅ Table Section */}
        <div className="bg-white border overflow-x-auto  border-gray-200 rounded-xl shadow-sm">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <div>
                <h2 className="text-gray-900 font-semibold text-base">
                  Purchase Request List
                </h2>
                <p className="text-sm text-gray-500">
                  Manage all purchase requests with filtering and actions.
                </p>
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
              <table className="min-w-full border-collapse text-sm text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr className="border-b border-gray-200">
                    <th className="w-10 p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredRequests.length}
                        onChange={(e) => selectAll(e.target.checked)}
                        className="accent-purple-700"
                      />
                    </th>
                    <th className="p-3 font-medium">Role Name</th>
                    <th className="p-3 font-medium">Description</th>
                    <th className="p-3 font-medium text-center">Users</th>
                    <th className="p-3 font-medium text-center">Modules</th>
                    <th className="p-3 font-medium text-center">Created</th>
                    <th className="p-3 font-medium text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((rp) => (
                    <tr
                      key={rp.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-all ${
                        selectedIds.includes(rp.id) ? "bg-purple-50" : ""
                      }`}
                    >
                      <td className="w-10 p-3 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(rp.id)}
                          onChange={() => toggleSelect(rp.id)}
                          className="accent-purple-700"
                        />
                      </td>
                      <td className="p-3 text-gray-700 align-middle">
                        {rp.roleName}
                      </td>
                      <td className="p-3 text-gray-700 align-middle">
                        {rp.description}
                      </td>
                      <td className="p-3 text-gray-700 text-center align-middle">
                        {rp.users}
                      </td>
                      <td className="p-3 text-gray-700 text-center align-middle">
                        {rp.modules}
                      </td>
                      <td className="p-3 text-gray-700 text-center align-middle">
                        {rp.created}
                      </td>

                      {/* ACTION MENU */}
                      <td className="p-3 text-center align-middle relative">
                        <button
                          className="p-2 rounded-full hover:bg-gray-100"
                          onClick={() => toggleMenu(rp.id)}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openMenuId === rp.id && (
                          <div className="absolute right-3 top-10 w-32 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => handleAction("View", rp.roleName)}
                              className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm rounded-md hover:bg-[#facf6c]"
                            >
                              <Eye size={16} className="text-gray-500" /> View
                            </button>
                            <button
                              onClick={() => handleAction("Edit", rp.roleName)}
                              className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm rounded-md hover:bg-[#facf6c]"
                            >
                              <Edit size={16} className="text-gray-500" /> Edit
                            </button>
                            <button
                              onClick={() =>
                                handleAction("Delete", rp.roleName)
                              }
                              className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm rounded-md text-red-600 hover:text-black hover:bg-[#facf6c]"
                            >
                              <Trash2 size={16} className="text-gray-500" />{" "}
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-6 text-gray-500"
                      >
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination Section */}
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
      </div>
      {/* Modal */}
      <PermissionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roleName={selectedRole}
      />
    </>
  );
};

export default PurchaseRequestTable;
