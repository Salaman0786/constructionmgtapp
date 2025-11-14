import React, { useEffect, useRef, useState } from "react";
import { Eye, MoreHorizontal, Plus, SquarePen, Trash2 } from "lucide-react";
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

export const UsersTable: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const { data, isLoading, isError, refetch } = useGetUsersQuery({
    page: 1,
    limit: 10,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { data: userDetails, isLoading: userDetailsLoading } =
    useGetUserByIdQuery(editUserId!, {
      skip: !editUserId,
    });

  const pagination = data?.pagination;
  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const handleDelete = async (userId: string) => {
    setDeleteId(userId);
    setOpenConfirm(true);
    setActiveMenuId(null);
  };
  const handleConfirmDelete = async (userId: string) => {
    if (!deleteId) return;
    try {
      await deleteUser(userId).unwrap();
      showInfo("User deleted successfully!");
      refetch();
    } catch (error) {
      showError(error?.data?.message || "Failed to delete user:");
    } finally {
      setOpenConfirm(false);
      setDeleteId(null);
    }
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

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleEdit = (id: string) => {
    setEditUserId(id);
    setOpenEditModal(true);
    setActiveMenuId(null);
  };

  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus({ id: userId, isActive: !currentStatus }).unwrap();
      refetch();
      showSuccess("Updated status successfully!!");
    } catch (error) {
      showError("Failed to update status:");
    }
  };

  return (
    <div className="p-6">
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
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-sm px-3 py-2 rounded-md"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50">
              <th className="p-3">
                <input type="checkbox" className="accent-purple-700" />
              </th>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Login</th>
              <th className="p-3">Created</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={12} className="py-10">
                  <div className="flex justify-center items-center w-full">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : (
              data?.data?.users.map((user) => (
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
                  <td className="p-3 text-gray-700">{user.email}</td>
                  <td className="p-3">
                    <span className="text-xs font-medium bg-[#4b0082] text-white px-2 py-1 rounded-full">
                      {user.role.name}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
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
                              user.isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                      </label>
                    </div>
                  </td>
                  <td className="p-3 text-gray-700">
                    {formatDateToDDMMYYYY(user.role.updatedAt)}
                  </td>
                  <td className="p-3 text-gray-700">
                    {formatDateToDDMMYYYY(user.role.createdAt)}
                  </td>

                  {/* Action menu */}
                  <td className="relative p-3 text-center">
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
                      <div className="absolute right-0 top-8 w-28 bg-white border border-gray-200 rounded-md shadow-md z-10">
                        {/* <button
                          onClick={() => handleDelete(user.id)}
                          disabled={isDeleting}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-800 hover:bg-red-50"
                        >
                          <Eye size={16} /> View
                        </button> */}
                        <button
                          onClick={() => handleEdit(user.id)}
                          disabled={userDetailsLoading}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-orange-600 hover:bg-red-50"
                        >
                          <SquarePen size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={isDeleting}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 sm:px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span className="text-sm sm:text-base">
            {pagination ? (
              <>
                Showing{" "}
                {pagination.total > 0
                  ? `${(pagination.page - 1) * pagination.limit + 1}`
                  : "0"}{" "}
                to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} results
              </>
            ) : (
              "Loading..."
            )}
          </span>

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
        userDetails={userDetails?.data?.data}
        userId={editUserId}
        onClose={() => {
          setOpenEditModal(false);
          refetch();
        }}
      />
      <ConfirmModal
        open={openConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenConfirm(false)}
        title="Delete User?"
      />
    </div>
  );
};
