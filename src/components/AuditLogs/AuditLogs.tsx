import { useEffect, useRef, useState } from "react";
import {
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  UserPlus,
  UserMinus,
  Inbox,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { useGetAuditLogsQuery } from "../../features/auditLogs/auditLogsApi";
import AuditLogShimmer from "./AuditLogShimmer";
import { formatLabel } from "../../utils/helpers";
import useClickOutside from "../../hooks/useClickOutside";

/* ================= TYPES (MATCH API) ================= */

type AuditChange = {
  field: string;
  from: string | number | null;
  to: string | number | null;
};

type AuditLog = {
  id: string;
  actorRole: string;
  actionType:
    | "LOGIN"
    | "LOGOUT"
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "STATUS_CHANGE"
    | "ASSIGN"
    | "UNASSIGN";
  entityType: string;
  entityName?: string;
  title: string | null;
  description: string;
  changes?: AuditChange[];
  createdAt: string;
  user: {
    fullName: string;
    email: string;
    role: {
      name: string;
    };
  };
};

/* ================= ACTION CONFIG ================= */

const defaultAction = {
  icon: Pencil,
  bg: "bg-gray-100",
  text: "text-gray-600",
};

const actionConfig = {
  LOGIN: {
    icon: LogIn,
    bg: "bg-indigo-100",
    text: "text-indigo-600",
  },
  LOGOUT: {
    icon: LogOut,
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
  STATUS_CHANGE: {
    icon: RefreshCw,
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  CREATE: {
    icon: Plus,
    bg: "bg-green-100",
    text: "text-green-600",
  },
  UPDATE: {
    icon: Pencil,
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  DELETE: {
    icon: Trash2,
    bg: "bg-red-100",
    text: "text-red-600",
  },
  ASSIGN: {
    icon: UserPlus,
    bg: "bg-emerald-100",
    text: "text-emerald-600",
  },
  UNASSIGN: {
    icon: UserMinus,
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
} as const;

/* ================= COMPONENT ================= */

export default function AuditLogThreadERPResponsive() {
  const [page, setPage] = useState(1);
  const [allLogs, setAllLogs] = useState<AuditLog[]>([]);
  const [actionTypeFilter, setActionTypeFilter] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);
  const [tempActionType, setTempActionType] = useState("");
  const [tempEntityType, setTempEntityType] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const isFilterApplied = Boolean(actionTypeFilter || entityTypeFilter);

  const limit = 10;

  const { data, isLoading, isFetching, isError } = useGetAuditLogsQuery({
    page,
    limit,
    actionType: actionTypeFilter,
    entityType: entityTypeFilter,
  });

  const isUpdate = (log: AuditLog) =>
    log.actionType === "UPDATE" && log.changes?.length;

  const isDelete = (log: AuditLog) =>
    log.actionType === "DELETE" && log.changes?.length;

  const getAddedUsers = (log: AuditLog) =>
    log.changes?.find((c) => c.field === "assignedUsers.added")?.to ?? [];

  const getRemovedUsers = (log: AuditLog) =>
    log.changes?.find((c) => c.field === "assignedUsers.removed")?.to ?? [];

  const hasNextPage = data?.pagination?.hasNextPage;
  const [openId, setOpenId] = useState<string | null>(null);
  const isEndReached =
    !isLoading && !isFetching && allLogs.length > 0 && hasNextPage === false;

  const isNoLogsYet =
    !isFilterApplied &&
    !isLoading &&
    !isFetching &&
    !isError &&
    allLogs.length === 0;

  const isNoResultsAfterFilter =
    isFilterApplied &&
    !isLoading &&
    !isFetching &&
    !isError &&
    allLogs.length === 0;

  const clearFilters = () => {
    //Force shimmer regardless of cache
    setIsFilterLoading(true);
    setActionTypeFilter("");
    setEntityTypeFilter("");

    setPage(1);
    setAllLogs([]);
  };

  useEffect(() => {
    if (!data?.logs) return;

    if (page === 1) {
      // Fresh load → replace everything
      setAllLogs(data.logs);
    } else {
      setAllLogs((prev) => {
        const existingIds = new Set(prev.map((l) => l.id));

        const newUniqueLogs = data.logs.filter(
          (log) => !existingIds.has(log.id)
        );

        return [...prev, ...newUniqueLogs];
      });
    }
    // 🔑 stop shimmer ONLY when response is applied
    setIsFilterLoading(false);
  }, [data?.logs, page]);

  //close filter when click outside
  useClickOutside(
    filterRef,
    () => {
      setFilterOpen(false);
    },
    [filterBtnRef]
  );
  const applyFilters = () => {
    setIsFilterLoading(true);
    setActionTypeFilter(tempActionType);
    setEntityTypeFilter(tempEntityType);

    setPage(1);
    setAllLogs([]);

    setFilterOpen(false);
  };

  useEffect(() => {
    if (!hasNextPage || isFetching) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMoreRef.current) {
          isLoadingMoreRef.current = true;
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      isLoadingMoreRef.current = false;
    };
  }, [hasNextPage, isFetching]);

  function toWords(str: string) {
    return str.split(/(?=[A-Z])/).join(" ");
  }

  return (
    <div className="space-y-6 bg-white min-h-screen">
      
      {/* Header */}
      <div className="flex flex-row justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Audit Logs</h1>
          <p className="text-sm text-gray-500">Full System Activity Tracking</p>
        </div>

        <div className="relative min-w-max">
          <button
            ref={filterBtnRef}
            onClick={() => {
              setTempActionType(actionTypeFilter);
              setTempEntityType(entityTypeFilter);

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
              <h3 className="text-sm font-semibold mb-3">Filter Logs</h3>

              <div className="mt-2">
                <label className="text-xs text-gray-600">Action Type</label>
                <select
                  value={tempActionType}
                  onChange={(e) => setTempActionType(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm 
    focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                >
                  <option value="">All</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGOUT">Logout</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="STATUS_CHANGE">Status Change</option>
                  <option value="ASSIGN">Assign</option>
                  <option value="UNASSIGN">Unassign</option>
                </select>
              </div>

              <div className="mt-2">
                <label className="text-xs text-gray-600">Entity Type</label>
                <select
                  value={tempEntityType}
                  onChange={(e) => setTempEntityType(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm 
    focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                >
                  <option value="">All</option>
                  <option value="Project">Project</option>
                  <option value="ProjectUser">Project User</option>

                  <option value="Task">Task</option>
                  <option value="UserTask">User Task</option>

                  <option value="SiteDiary">Site Diary</option>
                  <option value="UserSiteDiary">User Site Diary</option>
                  <option value="User">User</option>
                  <option value="Auth">Auth</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className="text-sm text-gray-600 hover:underline"
                  onClick={() => {
                    setTempActionType("");
                    setTempEntityType("");
                  }}
                >
                  Reset
                </button>

                <button
                  className="bg-[#4b0082] text-white text-sm px-4 py-2 rounded-lg"
                  onClick={applyFilters}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Thread wrapper */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 sm:left-5 top-0 bottom-0 w-px bg-gray-300" />

        <div className="space-y-4 sm:space-y-6">
          {isLoading || (isFetching && page === 1) || isFilterLoading ? (
            <AuditLogShimmer count={6} />
          ) : (
            allLogs.map((log: AuditLog) => {
              const isOpen = openId === log.id;
              const action =
                actionConfig[log.actionType as keyof typeof actionConfig] ??
                defaultAction;

              const ActionIcon = action.icon;
              return (
                <div key={log.id} className="relative pl-10 sm:pl-14">
                  {/* Action Icon */}
                  <div
                    className={`absolute left-0.5 sm:left-2 top-5
                  w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center
                  ${action.bg}`}
                  >
                    <ActionIcon size={12} className={action.text} />
                  </div>

                  {/* Card */}
                  <div
                    className="bg-white border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() => setOpenId(isOpen ? null : log.id)}
                  >
                    <div className="p-3 sm:p-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-800 leading-snug">
                            {log.title ?? log.description}
                          </p>

                          <p className="text-xs text-gray-500 flex flex-wrap items-center gap-1">
                            <span>by</span>
                            <span className="font-medium text-gray-700">
                              {log.user.fullName}
                            </span>
                            <span className="text-gray-500">
                              ({formatLabel(log.user.role.name)})
                            </span>
                            <span className="mx-1 text-gray-300">•</span>
                            <time>
                              {new Date(log.createdAt).toLocaleString()}
                            </time>
                          </p>
                        </div>

                        <span
                          className=" inline-flex items-center gap-1 mt-2
    self-start sm:self-auto
    text-[11px] font-medium
    px-2.5 py-1
    rounded-full
    bg-slate-100 text-slate-600
    border border-slate-200
    whitespace-nowrap"
                        >
                          {toWords(log.entityType)}
                        </span>
                      </div>
                    </div>

                    {/* Expanded */}
                    {isOpen && (
                      <div className="border-t bg-white px-4 py-4 space-y-5">
                        {/* Description */}
                        <div className="pl-3 border-l-2 border-gray-200">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                            Description
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {log.description}
                          </p>
                        </div>

                        {/* UPDATE CHANGES */}
                        {isUpdate(log) && (
                          <div className="pl-3 border-l-2 border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                              Field Changes
                            </p>

                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse text-sm">
                                <thead>
                                  <tr className="text-left text-gray-400">
                                    <th className="py-2 pr-4 font-medium">
                                      Field
                                    </th>
                                    <th className="py-2 pr-4 font-medium">
                                      Old
                                    </th>
                                    <th className="py-2 font-medium">New</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {log.changes.map((change) => (
                                    <tr
                                      key={change.field}
                                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                                    >
                                      <td className="py-2 pr-4 font-medium text-gray-700 capitalize">
                                        {change.field}
                                      </td>

                                      <td className="py-2 pr-4 text-gray-500">
                                        {change.from ?? "—"}
                                      </td>

                                      <td className="py-2 font-medium text-gray-900">
                                        {change.to ?? "—"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {(log.actionType === "ASSIGN" ||
                          log.actionType === "UNASSIGN") && (
                          <div className="space-y-6">
                            {/* USERS ADDED */}
                            {getAddedUsers(log).length > 0 && (
                              <div className="pl-3 border-l-2 border-emerald-200">
                                <p className="text-xs font-semibold text-emerald-600 uppercase mb-2">
                                  Users Added
                                </p>

                                <ul className="space-y-2">
                                  {getAddedUsers(log).map((user: any) => (
                                    <li
                                      key={user.id}
                                      className="flex items-start gap-2 sm:gap-3 text-sm"
                                    >
                                      <span className="mt-1 w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-400" />

                                      <div className="min-w-0">
                                        <p className="font-medium text-gray-800 truncate -mt-1">
                                          {user.fullName}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate sm:break-all">
                                          {user.email}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* USERS REMOVED */}
                            {getRemovedUsers(log).length > 0 && (
                              <div className="pl-3 border-l-2 border-orange-200">
                                <p className="text-xs font-semibold text-orange-600 uppercase mb-2">
                                  Users Removed
                                </p>

                                <ul className="space-y-2">
                                  {getRemovedUsers(log).map((user: any) => (
                                    <li
                                      key={user.id}
                                      className="flex items-start gap-2 sm:gap-3 text-sm"
                                    >
                                      <span className="mt-1 w-1.5 h-1.5 shrink-0 rounded-full bg-orange-400" />

                                      <div className="min-w-0">
                                        <p className="font-medium text-gray-800 -mt-1 truncate">
                                          {user.fullName}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate sm:break-all">
                                          {user.email}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {isDelete(log) && (
                          <div className="pl-3 border-l-2 border-red-200">
                            <p className="text-xs font-semibold text-red-500 uppercase mb-2">
                              Deleted {toWords(log.entityType)}
                            </p>

                            <ul className="space-y-1">
                              {log.changes!.map((change: any, idx) => (
                                <li key={idx} className="text-sm flex gap-2">
                                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2" />
                                  <span className="font-medium">
                                    {change.from?.message ??
                                      change.from?.fullName ??
                                      change.from?.title ??
                                      change.from?.name ??
                                      "Unknown"}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            {log?.metadata?.count && (
                              <p className="mt-2 text-xs text-gray-400">
                                {log?.metadata?.count}{" "}
                                {log?.metadata?.count > 1
                                  ? "item(s) deleted"
                                  : "item deleted"}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* EMPTY STATE */}

      {/* EMPTY STATES */}
      {isNoResultsAfterFilter && (
        <div className="py-20 flex flex-col items-center text-center text-gray-400 animate-fadeIn">
          <Filter size={28} className="mb-4 text-indigo-400" />

          <p className="text-sm font-medium text-gray-700">
            No results match your filters
          </p>

          <p className="mt-1 text-xs text-gray-400 max-w-xs">
            Try adjusting or clearing filters to see more activity.
          </p>

          <button
            onClick={clearFilters}
            className="mt-5 text-xs font-medium text-indigo-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {isNoLogsYet && (
        <div className="py-20 flex flex-col items-center text-center text-gray-400 animate-fadeIn">
          <Inbox size={28} className="mb-4" />

          <p className="text-sm font-medium text-gray-600">No audit logs yet</p>

          <p className="mt-1 text-xs text-gray-400 max-w-xs">
            System activity will appear here once actions are performed.
          </p>
        </div>
      )}

      {isError && !isLoading && !isFetching && (
        <div className="py-20 flex flex-col items-center text-center text-gray-400 animate-fadeIn">
          <AlertTriangle size={28} className="mb-4 text-red-400" />

          <p className="text-sm font-medium text-gray-600">
            Unable to load audit logs
          </p>

          <p className="mt-1 text-xs text-gray-400 max-w-xs">
            Something went wrong while fetching system activity.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 text-xs font-medium text-gray-600 hover:text-gray-800 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* END MESSAGE */}
      {isEndReached && (
        <div className="py-5 text-center text-xs text-gray-400">
          You’ve reached the end of the audit logs
        </div>
      )}
      {/* SENTINEL */}
      <div ref={loadMoreRef} />
      {/* LOADING NEXT PAGE */}
      {isFetching && data?.logs?.length > 0 && <AuditLogShimmer count={2} />}
    </div>
  );
}
