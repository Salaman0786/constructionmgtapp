import React, { useState } from "react";
import { Edit, MoreHorizontal } from "lucide-react";
import StatusSummaryCard from "./StatusSummaryCard";

import { useGetRolesQuery } from "../../../features/role/api/roleApi";
import { formatDateToDDMMYYYY } from "../../../utils/formatDate";
import { renderShimmer } from "../../common/tableShimmer";
import RolePermissionUI from "./RolePermissionUI";

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
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: rolesData,
    isLoading,
    isError,
    refetch,
  } = useGetRolesQuery({ page, limit });
  const roles = rolesData?.data?.roles || [];
  const [filterPriority, setFilterPriority] = useState<string>("All");
  // const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showFilter, setShowFilter] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
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

    return matchesSearch;
  });

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = (action: string, roleName: string) => {
    if (action === "View") {
      setSelectedRole(roleName);
      setIsModalOpen(true);
    } else alert(`${action} clicked for ${roleName}`);
    setOpenMenuId(null);
  };
  const pagination = rolesData?.pagination;
  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const handleNext = () => {
    if (pagination?.hasNextPage) setPage((p) => p + 1);
  };
  return (
    <>
      <div className="mt-6 space-y-6">
        {/* ✅ Search + Filter Container */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm border border-gray-200 bg-white p-4 rounded-lg">
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

          
          <div className="flex items-center gap-3">
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
                      // value={filterStatus}
                      // onChange={(e) => setFilterStatus(e.target.value)}
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
          </div>
        </div> */}

        <StatusSummaryCard />

        {/* ✅ Table Section */}
        <div className="bg-white border overflow-x-auto  border-gray-200 rounded-xl shadow-sm">
          <div className="p-6">
            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="min-w-full border-collapse text-sm text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr className="border-b border-gray-200">
                    <th className="w-10 p-3 text-center">
                      <input
                        type="checkbox"
                        // checked={selectedIds.length === filteredRequests.length}
                        //  onChange={(e) => selectAll(e.target.checked)}
                        className="accent-purple-700"
                      />
                    </th>
                    <th className="p-3">Role Name</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Users</th>
                    <th className="p-3 text-center">Modules</th>
                    <th className="p-3 text-center">Created</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    // <tr>
                    //   <td colSpan={12} className="py-10">
                    //     <div className="flex justify-center items-center w-full">
                    //       <Loader />
                    //     </div>
                    //   </td>
                    // </tr>
                    <>{renderShimmer()}</>
                  ) : (
                    roles.map((rp, index) => (
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
                          {rp.name}
                        </td>
                        <td className="p-3 text-gray-700 align-middle">
                          {rp.description}
                        </td>
                        <td className="p-3 text-gray-700 text-center align-middle">
                          {rp.userCount}
                        </td>
                        <td className="p-3 text-gray-700 text-center align-middle">
                          {rp.moduleCount}
                        </td>
                        <td className="p-3 text-gray-700 text-center align-middle">
                          {formatDateToDDMMYYYY(rp.createdAt)}
                        </td>

                        {/* ACTION MENU */}
                        <td className="p-3 text-center align-middle relative">
                          <button
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={(e) => {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              setMenuPosition({
                                top: rect.bottom + 6,
                                left: rect.right - 140,
                              });
                              toggleMenu(rp.id);
                            }}
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openMenuId === rp.id && (
                            <div
                              className="fixed w-36 py-1 px-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]"
                              style={{
                                top: menuPosition.top,
                                left: menuPosition.left,
                              }}
                            >
                              {/* <button
                                onClick={() =>
                                  handleAction("View", rp.roleName)
                                }
                                className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm rounded-md hover:bg-[#facf6c]"
                              >
                                <Eye size={16} className="text-gray-500" /> View
                              </button> */}
                              <button
                                onClick={() => {
                                  setSelectedProjectId(rp.id);
                                  setIsModalOpen(true);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm rounded-md hover:bg-[#facf6c]"
                              >
                                <Edit size={16} className="text-gray-500" />{" "}
                                Edit
                              </button>
                              {/* <button
                                onClick={() =>
                                  handleAction("Delete", rp.roleName)
                                }
                                className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm rounded-md text-red-600 hover:text-black hover:bg-[#facf6c]"
                              >
                                <Trash2 size={16} className="text-gray-500" />{" "}
                                Delete
                              </button> */}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination Section */}
            <div className="px-4 pt-3 sm:px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span className="text-sm sm:text-base">
                {pagination && (
                  <>
                    Showing{" "}
                    {pagination.total > 0
                      ? `${(pagination.page - 1) * pagination.limit + 1}`
                      : "0"}{" "}
                    to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} results
                  </>
                )}
              </span>

              {pagination && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                  >
                    «
                  </button>

                  <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                  >
                    ‹
                  </button>

                  <span className="px-2 text-sm font-medium">{page}</span>

                  <button
                    onClick={handleNext}
                    disabled={!pagination?.hasNextPage}
                    className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                  >
                    ›
                  </button>

                  <button
                    onClick={() => setPage(pagination?.totalPages || 1)}
                    disabled={!pagination?.hasNextPage}
                    className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                  >
                    »
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <RolePermissionUI
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProjectId(null); // reset mode
        }}
        projectId={selectedProjectId}
      />
    </>
  );
};

export default PurchaseRequestTable;
