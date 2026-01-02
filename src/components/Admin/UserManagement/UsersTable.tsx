import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import AddUser from "./AddUser";
import {
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "../../../features/user/api/userApi";
import { formatDateToDDMMYYYY } from "../../../utils/formatDate";
import Loader from "../../common/Loader";
import { showError, showInfo, showSuccess } from "../../../utils/toast";
import EditUser from "./EditUser";
import ConfirmModal from "../../common/ConfirmModal";
import { renderShimmer } from "../../common/tableShimmer";
import useClickOutside from "../../../hooks/useClickOutside";
import { formatToYMD } from "../../../utils/helpers";
import { useSelector } from "react-redux";

export const UsersTable: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const limit = 10;
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [tempStatus, setTempStatus] = useState("");
  const [tempRole, setTempRole] = useState("");
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };
  const userRole = useSelector((state: any) => state.auth.user?.role?.name);

  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const selectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data?.data?.users.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };
  const { data, isLoading, isError, refetch } = useGetUsersQuery({
    page: page,
    limit: 10,
    search: search,
    status: statusFilter,
    role: roleFilter,
  });
  const pagination = data?.pagination;
  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const [filterOpen, setFilterOpen] = useState(false);

  const [singleDeleteConfirmOpen, setSingleDeleteConfirmOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const confirmSingleDelete = async () => {
    try {
      await deleteUser([selectedProject.id]).unwrap();
      showSuccess("User deleted successfully!");
      refetch();
    } catch (err) {
      console.error("Error :", err);
      showError("Delete failed");
    }

    setSingleDeleteConfirmOpen(false);
  };
  const handleNext = () => {
    if (pagination?.hasNextPage) setPage((p) => p + 1);
  };
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = (id: string) => {
    setEditUserId(id);
    setOpenEditModal(true);
    setActiveMenuId(null);
  };

  //close filter when click outside
  useClickOutside(
    filterRef,
    () => {
      setFilterOpen(false);
    },
    [filterBtnRef]
  );

  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus({ id: userId, isActive: !currentStatus }).unwrap();
      refetch();
      showSuccess("Updated status successfully!!");
    } catch (err: any) {
      // Normalize the message: always turn it into a string
      const errorMessage = err?.data?.message;

      let displayMessage: string;

      if (Array.isArray(errorMessage)) {
        // If it's an array → join all messages (you can also take just the first one)
        displayMessage = errorMessage.join(", ");
        // Or just the first one: errorMessage[0]
      } else if (typeof errorMessage === "string") {
        displayMessage = errorMessage;
      } else {
        displayMessage = "Failed to update status!";
      }

      showError(displayMessage);
    }
  };
  const confirmBulkDelete = async () => {
    try {
      await deleteUser(selectedIds).unwrap();
      showSuccess("Selected users deleted successfully!");
      setSelectedIds([]);
      refetch();
    } catch (err) {
      console.error("Error :", err);
      showError("Failed to delete selected projects");
    }
    setBulkDeleteConfirmOpen(false);
  };
  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-gray-900 font-semibold text-base">
            System Users
          </h2>
          <p className="text-sm text-gray-500">
            Manage user accounts and access permissions
          </p>
        </div>
        <button
          onClick={() => {
            setOpenModal(true);
            setSelectedProjectId(null);
          }}
          className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-sm px-3 py-2 rounded-md"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="flex flex-col items-end md:flex-row md:items-center md:justify-between gap-3 my-4">
        <div className="relative w-full md:w-9/10">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search by user name / role / email..."
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to page 1 when searching
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2] outline-none"
          />
        </div>

        <div className=" relative min-w-max">
          <button
            ref={filterBtnRef}
            onClick={() => {
              setTempStatus(statusFilter);
              setTempRole(roleFilter);
              setFilterOpen(!filterOpen);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-[f0f0f0] rounded-lg text-sm font-medium bg-[#4b0082] text-white hover:text-gray-700 hover:bg-[#facf6c] hover:border-[#fe9a00]"
          >
            <Filter size={16} /> Filters
          </button>

          {/* Filter Dropdown */}
          {filterOpen && (
            <div
              ref={filterRef}
              className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-white p-4 rounded-xl border shadow-lg z-50"
            >
              <h3 className="text-sm font-semibold mb-3">Filter Users</h3>

              {/* Status Filter */}
              <div className="mb-3">
                <label className="text-xs text-gray-600">Status</label>
                <select
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm 
          focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Role Filter */}
              {isSuperAdmin && (
                <div>
                  <label className="text-xs text-gray-600">Role</label>
                  <select
                    value={tempRole}
                    onChange={(e) => setTempRole(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm 
          focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  >
                    <option value="">All</option>
                    <option value="USER">User</option>
                    <option value="MANAGER">Manager</option>
                    <option value="INVESTOR">Investor</option>
                  </select>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex justify-between mt-4">
                {/* Reset */}
                <button
                  className="text-sm text-gray-600 hover:underline"
                  onClick={() => {
                    setTempStatus("");
                    setTempRole("");
                  }}
                >
                  Reset
                </button>

                {/* Apply */}
                <button
                  className="bg-[#4b0082] text-white text-sm px-4 py-2 rounded-lg"
                  onClick={() => {
                    setStatusFilter(tempStatus);
                    setRoleFilter(tempRole);
                    setFilterOpen(false);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="pb-6 overflow-x-auto">
          <div className="relative w-full rounded-xl">
            {/* {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 text-sm justify-end">
                <span className="text-gray-600">
                  {selectedIds.length} selected
                </span>

                <button
                  onClick={() => setBulkDeleteConfirmOpen(true)}
                  className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-md m-2"
                >
                  Delete
                </button>
              </div>
            )} */}
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50">
                  {/* <th className="p-3">
                    <input
                      type="checkbox"
                      checked={
                        data?.data?.users.length > 0 &&
                        selectedIds.length === data?.data?.users.length
                      }
                      onChange={(e) => selectAll(e.target.checked)}
                      className="accent-purple-600"
                    />
                  </th> */}
                  <th className="p-3 text-center">S.No.</th>
                  <th className="p-3">User</th>
                  <th className="p-3 text-center">Email</th>
                  <th className="p-3 text-center">Role</th>
                  <th className="p-3 text-center">Status</th>

                  <th className="p-3 text-center">Created</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <>{renderShimmer()}</>
                ) : isError ? (
                  <tr>
                    <td colSpan={12} className="text-center py-6 text-gray-500">
                      No Record Found
                    </td>
                  </tr>
                ) : (
                  data?.data?.users.map((user, index) => {
                    const serialNo =
                      (pagination.page - 1) * pagination.limit + (index + 1);
                    return (
                      <tr
                        key={user.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                          selectedIds.includes(user.id) ? "bg-purple-50" : ""
                        }`}
                      >
                        {/* <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(user.id)}
                            onChange={() => toggleSelect(user.id)}
                            className="accent-purple-700"
                          />
                        </td> */}
                        <td className="p-3 text-center text-[#3A3A3A]  align-middle">
                          {serialNo}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4b0082] text-white font-medium uppercase">
                              {user.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.userName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.fullName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center text-[#3A3A3A]  align-middle">
                          {user.email}
                        </td>
                        <td className="p-3 text-center align-middle">
                          <span className="text-xs font-medium bg-[#4b0082] text-white px-2 py-1 rounded-full ">
                            {user.role.name}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                user.isActive
                                  ? "bg-[#4b0082] text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>

                            {/* Toggle Switch */}
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={user.isActive}
                                onChange={() =>
                                  handleToggleStatus(user.id, user.isActive)
                                }
                                disabled={isUpdating}
                              />
                              <div
                                className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors duration-300 ${
                                  user.isActive ? "bg-[#4b0082]" : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`w-3.5 h-3.5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                                    user.isActive
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  }`}
                                ></div>
                              </div>
                            </label>
                          </div>
                        </td>
                        <td className="p-3 text-center text-[#3A3A3A] whitespace-nowrap align-middle">
                          {formatToYMD(user.createdAt)}
                        </td>

                        {/* Action menu */}
                        <td className="relative px-3 py-4 text-center">
                          <button
                            onClick={() =>
                              setActiveMenuId(
                                activeMenuId === user.id ? null : user.id
                              )
                            }
                            className="p-2 rounded-lg hover:bg-[#facf6c]"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {activeMenuId === user.id && (
                            <div className="absolute px-1 py-1 right-6 top-15  w-28 bg-white border border-gray-200 rounded-md shadow-md z-10">
                              {/* <button
                          onClick={() => handleDelete(user.id)}
                          disabled={isDeleting}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-800 hover:bg-red-50"
                        >
                          <Eye size={16} /> View
                        </button> */}
                              <button
                                onClick={() => handleEdit(user.id)}
                                className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c]"
                              >
                                <Edit size={16} /> Edit
                              </button>
                              {/* <button
                            onClick={() => {
                              setSelectedProject(user);
                              setSelectedProjectId(user.id);
                              setSingleDeleteConfirmOpen(true);
                              setOpenMenuId(null); // 🔥 CLOSE MENU
                            }}
                            disabled={isDeleting}
                            className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg text-red-600 hover:bg-[#facf6c]"
                          >
                            <Trash2 size={16} /> Delete
                          </button> */}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/** Pagination */}

          <div className="px-4 pt-4 sm:px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
        text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft size={18} />
                </button>

                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
        text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="px-2 text-sm font-medium">{page}</span>

                <button
                  onClick={handleNext}
                  disabled={!pagination?.hasNextPage}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
        text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => setPage(pagination?.totalPages || 1)}
                  disabled={!pagination?.hasNextPage}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
        text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddUser
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          refetch();
        }}
      />
      <EditUser
        isOpen={openEditModal}
        userId={editUserId}
        onClose={() => {
          setOpenEditModal(false);
          refetch();
        }}
      />

      <ConfirmModal
        open={singleDeleteConfirmOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedProject?.userName}"?`}
        onConfirm={confirmSingleDelete}
        onCancel={() => setSingleDeleteConfirmOpen(false)}
      />

      {/* Multiple DELETE CONFIRMATION */}
      <ConfirmModal
        open={bulkDeleteConfirmOpen}
        title="Delete Selected Users"
        message={`Are you sure you want to delete ${selectedIds.length} user(s)?`}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  );
};
