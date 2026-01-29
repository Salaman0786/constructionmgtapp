import React, { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { useSelector } from "react-redux";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { renderShimmer } from "../../common/tableShimmer";
import useClickOutside from "../../../hooks/useClickOutside";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "../../../features/user/api/userApi";
import { formatToYMD } from "../../../utils/helpers";
import { showError, showSuccess } from "../../../utils/toast";
interface UserRole {
  id: string;
  name: string;
}

interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

interface UsersResponse {
  data: {
    users: User[];
  };
  pagination: Pagination;
}

interface RootState {
  auth: {
    user?: {
      role?: {
        name?: string;
      };
    };
  };
}

export const UsersTable: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [tempStatus, setTempStatus] = useState<string>("");
  const [tempRole, setTempRole] = useState<string>("");

  const filterRef = useRef<HTMLDivElement | null>(null);
  const filterBtnRef = useRef<HTMLButtonElement | null>(null);

  const userRole = useSelector(
    (state: RootState) => state.auth.user?.role?.name,
  );
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const { data, isLoading, isError, refetch } = useGetUsersQuery({
    page,
    limit: 10,
    search,
    status: statusFilter,
    role: roleFilter,
  }) as {
    data?: UsersResponse;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };

  const pagination = data?.pagination;

  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  useClickOutside(filterRef, () => setFilterOpen(false), [filterBtnRef]);

  const handleToggleStatus = async (
    userId: string,
    currentStatus: boolean,
  ): Promise<void> => {
    try {
      await updateUserStatus({
        id: userId,
        isActive: !currentStatus,
      }).unwrap();
      showSuccess("Updated status successfully!");
      refetch();
    } catch (err: any) {
      const msg = err?.data?.message ?? "Failed to update status!";
      showError(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  const handleEdit = (id: string): void => {
    setEditUserId(id);
    setOpenEditModal(true);
    setActiveMenuId(null);
  };

  const handlePrev = (): void => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = (): void => {
    if (pagination?.hasNextPage) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <div>
          <h2 className="text-gray-900 font-semibold text-base">
            System Users
          </h2>
          <p className="text-sm text-gray-500">
            Manage user accounts and access permissions
          </p>
        </div>

        <button
          onClick={() => setOpenAddModal(true)}
          className="flex items-center gap-1 bg-[#4b0082] text-white text-sm px-3 py-2 rounded-md"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:justify-between gap-3">
        <div className="relative w-full md:w-9/10">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by user name / role / email..."
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-[#5b00b2]"
          />
        </div>

        <div className="relative">
          <button
            ref={filterBtnRef}
            onClick={() => {
              setTempStatus(statusFilter);
              setTempRole(roleFilter);
              setFilterOpen((p) => !p);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[#4b0082] text-white"
          >
            <Filter size={16} /> Filters
          </button>

          {filterOpen && (
            <div
              ref={filterRef}
              className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg p-4 z-50"
            >
              <h3 className="text-sm font-semibold mb-3">Filter Users</h3>

              <div className="mb-3">
                <label className="text-xs text-gray-600">Status</label>
                <select
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {isSuperAdmin && (
                <div>
                  <label className="text-xs text-gray-600">Role</label>
                  <select
                    value={tempRole}
                    onChange={(e) => setTempRole(e.target.value)}
                    className="w-full mt-1 border rounded-md p-2 text-sm"
                  >
                    <option value="">All</option>
                    <option value="USER">User</option>
                    <option value="MANAGER">Manager</option>
                    <option value="INVESTOR">Investor</option>
                  </select>
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setTempStatus("");
                    setTempRole("");
                  }}
                  className="text-sm text-gray-600"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setStatusFilter(tempStatus);
                    setRoleFilter(tempRole);
                    setFilterOpen(false);
                  }}
                  className="bg-[#4b0082] text-white text-sm px-4 py-2 rounded-lg"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
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
                <td colSpan={7} className="text-center py-6">
                  No Record Found
                </td>
              </tr>
            ) : (
              data?.data.users.map((user, index) => {
                const serial =
                  (pagination!.page - 1) * pagination!.limit + index + 1;

                return (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-center">{serial}</td>

                    <td className="p-3">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-[#4b0082] text-white flex items-center justify-center rounded-full">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.userName}</div>
                          <div className="text-xs text-gray-500">
                            {user.fullName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center">{user.email}</td>

                    <td className="p-3 text-center">
                      <span className="text-xs bg-[#4b0082] text-white px-2 py-1 rounded-full">
                        {user.role.name}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <label className="inline-flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            user.isActive
                              ? "bg-[#4b0082] text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                        <input
                          type="checkbox"
                          checked={user.isActive}
                          onChange={() =>
                            handleToggleStatus(user.id, user.isActive)
                          }
                          disabled={isUpdating}
                        />
                      </label>
                    </td>

                    <td className="p-3 text-center">
                      {formatToYMD(user.createdAt)}
                    </td>

                    <td className="p-3 text-center relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId === user.id ? null : user.id,
                          )
                        }
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {activeMenuId === user.id && (
                        <div className="absolute right-6 top-10 bg-white border rounded-md shadow-md z-10">
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full"
                          >
                            <Edit size={16} /> Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination && (
          <div className="px-4 py-4 flex justify-between items-center">
            <span className="text-sm">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total}
            </span>

            <div className="flex gap-2">
              <button onClick={() => setPage(1)} disabled={page === 1}>
                <ChevronsLeft size={18} />
              </button>
              <button onClick={handlePrev} disabled={page === 1}>
                <ChevronLeft size={18} />
              </button>
              <span className="px-2">{page}</span>
              <button onClick={handleNext} disabled={!pagination.hasNextPage}>
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => setPage(pagination.totalPages)}
                disabled={!pagination.hasNextPage}
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AddUser
        isOpen={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
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
    </div>
  );
};
