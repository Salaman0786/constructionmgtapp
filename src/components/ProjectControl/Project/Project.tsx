import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Filter,
  Search,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Eye,
  Trash2,
  Edit,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import AddProject from "./AddProject";
import {
  useGetProjectsQuery,
  useDeleteProjectsMutation,
} from "../../../features/projectControll/projectsApi";
import { useSelector } from "react-redux";
import { renderShimmer } from "../../common/tableShimmer";
import { getTwoWordPreview } from "../../../utils/helpers";
import { formatToYMD } from "../../../utils/helpers";
import { showError, showSuccess } from "../../../utils/toast";
import ViewProjectDetailsModal from "./ViewProjectDetailsModal";
import ConfirmModal from "./DeleteModal";
import { StatusBadge } from "./StatusBadge";
import AccessDenied from "../../common/AccessDenied";
import useClickOutside from "../../../hooks/useClickOutside";
import { useActionMenuOutside } from "../../../hooks/useActionMenuOutside";

interface Project {
  id: string;
  name: string;
  country: string;
  city: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
  status: string;
  budgetBaseline: number;
  currency: string;
  createdAt: string;
}

const Project: React.FC = () => {
  const userRole = useSelector((state: any) => state.auth.user?.role?.name);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [singleDeleteConfirmOpen, setSingleDeleteConfirmOpen] = useState(false);
  // Store selected project for deleting
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  //actual filters applied to table
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // adjusting action menu
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // temporary values inside popup
  const [tempStart, setTempStart] = useState("");
  const [tempEnd, setTempEnd] = useState("");
  const [tempStatus, setTempStatus] = useState("");

  //close filter when click outside
  useClickOutside(
    filterRef,
    () => {
      setFilterOpen(false);
    },
    [filterBtnRef]
  );

  //close Action modal when click outside
  useActionMenuOutside({
    buttonSelector: "[data-user-menu-btn]",
    menuSelector: "[data-user-menu]",
    onOutsideClick: () => setOpenMenuId(null),
    enabled: !!openMenuId, //only active when menu is open
  });

  //pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // RTK Query GET API
  const { data, isLoading, isError, error, refetch } = useGetProjectsQuery({
    page,
    limit,
    search: searchQuery,
    status: statusFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
  });

  const [deleteProjects] = useDeleteProjectsMutation();

  /*
  This function is called when user clicks the “Delete” button in the modal.
  We send projectId + reason to API.
*/
  const confirmSingleDelete = async () => {
    try {
      await deleteProjects([selectedProject.id]).unwrap();
      showSuccess("Project deleted successfully!");
    } catch (err) {
      console.error("Error :", err);
      showError("Delete failed");
    }

    setSingleDeleteConfirmOpen(false);
  };

  //pagination
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;

  const goToFirst = () => setPage(1);
  const goToLast = () => setPage(totalPages);
  const goToPrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  // Extract projects from API
  const projects: Project[] = data?.data?.projects || [];

  // Error handling
  if (isError) {
    console.error("Error :", (error as any)?.data?.message);
  }

  // Select / Deselect
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProjects.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  //handle mutiple delete
  const confirmBulkDelete = async () => {
    try {
      await deleteProjects(selectedIds).unwrap();
      showSuccess("Selected projects deleted successfully!");
      setSelectedIds([]);
    } catch (err) {
      console.error("Error :", err);
      showError("Failed to delete selected projects");
    }
    setBulkDeleteConfirmOpen(false);
  };

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => setOpenMenuId(null);
    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", closeMenu);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  //handle csv export
  const handleExportSelected = () => {
    const selectedProjects = filteredProjects.filter((p) =>
      selectedIds.includes(p.id)
    );

    if (selectedProjects.length === 0) {
      showError("No projects selected for export");
      return;
    }

    const csvHeader =
      "Project Code,Project Name,City,Country,Assigned To,Start Date,End Date,Status,Budget,Currency,Created At";

    const csvRows = selectedProjects
      .map(
        (p) =>
          `${p.code},${p.name},${p.city},${p.country},${
            p.manager?.fullName || "—"
          },${formatToYMD(p.startDate)},${formatToYMD(p.endDate)},${p.status},${
            p.budgetBaseline
          },${p.currency},${formatToYMD(p.createdAt)}`
      )
      .join("\n");

    const csvContent =
      "data:text/csv;charset=utf-8," + csvHeader + "\n" + csvRows;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_projects.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Search filter
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();

    // SEARCH FILTER
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q) ||
      p.manager?.fullName?.toLowerCase().includes(q);

    // START DATE FILTER
    const matchesStart =
      !startDateFilter || new Date(p.startDate) >= new Date(startDateFilter);

    // END DATE FILTER
    const matchesEnd =
      !endDateFilter || new Date(p.endDate) <= new Date(endDateFilter);

    // STATUS FILTER
    const matchesStatus = !statusFilter || p.status === statusFilter;

    return matchesSearch && matchesStart && matchesEnd && matchesStatus;
  });

  //handle project view permission

  const permissionErrorMessage = (error as any)?.data?.message;

  // ONLY READ permission check
  const noReadAccess = /READ access/i.test(permissionErrorMessage || "");

  // Block entire page if READ denied
  if (noReadAccess) {
    return (
      <AccessDenied
        title="Access Denied"
        message={
          permissionErrorMessage || "You do not have READ access to Projects."
        }
      />
    );
  }

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Project</h1>
          <p className="text-sm text-gray-500">
            Manage construction projects and track progress
          </p>
        </div>

        {userRole === "SUPER_ADMIN" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedProjectId(null); // VERY IMPORTANT (forces create mode)
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1 bg-[#4b0082] text-white text-xs sm:text-sm px-3 py-2 rounded-md"
            >
              <Plus size={18} /> Create Project
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row items-end md:items-center md:justify-between gap-5 shadow p-4 rounded-lg border border-gray-200">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by project name / code / manager..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2] outline-none"
            onChange={(e) => {
              setPage(1);
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        {/* Make ONLY this wrapper relative */}
        <div className="relative min-w-max">
          <button
            ref={filterBtnRef}
            onClick={() => {
              setTempStart(startDateFilter);
              setTempEnd(endDateFilter);
              setTempStatus(statusFilter);
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
                    value={tempStart}
                    onChange={(e) => setTempStart(e.target.value)}
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
                    value={tempEnd}
                    onChange={(e) => setTempEnd(e.target.value)}
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
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
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
                  onClick={() => {
                    setTempStart("");
                    setTempEnd("");
                    setTempStatus("");
                  }}
                >
                  Reset
                </button>

                <button
                  className="bg-[#4b0082] text-white text-sm px-4 py-2 rounded-lg"
                  onClick={() => {
                    setStartDateFilter(tempStart);
                    setEndDateFilter(tempEnd);
                    setStatusFilter(tempStatus);
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

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-gray-900 font-semibold text-base">
              Project Tracking Table
            </h2>
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 text-sm justify-end">
              <span className="text-gray-600">
                {selectedIds.length} selected
              </span>

              <button
                onClick={handleExportSelected}
                className="bg-[#4b0082] text-white hover:text-gray-700 hover:bg-[#facf6c]  border hover:border-[#fe9a00] px-3 py-1.5 rounded-md"
              >
                Export
              </button>

              {userRole === "SUPER_ADMIN" && (
                <button
                  onClick={() => setBulkDeleteConfirmOpen(true)}
                  className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-md"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        <div className="w-full overflow-x-auto border border-gray-200 rounded-xl">
          <table className="table-auto w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50 whitespace-nowrap">
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      filteredProjects.length > 0 &&
                      selectedIds.length === filteredProjects.length
                    }
                    onChange={(e) => selectAll(e.target.checked)}
                    className="accent-purple-600"
                  />
                </th>
                <th className="p-3 text-center">S.No.</th>
                <th className="p-3 text-center">Project ID</th>
                <th className="p-3 text-center">Project Name</th>
                <th className="p-3 text-center">Country</th>
                {/* <th className="p-3 text-center">City</th> */}
                <th className="p-3 text-center">Assigned To</th>
                <th className="p-3 text-center">Start Date</th>
                <th className="p-3 text-center">End Date</th>
                <th className="p-3 text-center">Status</th>
                {userRole == "USER" ? (
                  ""
                ) : (
                  <th className="p-3 text-center">Budget</th>
                )}
                {/* <th className="p-3 text-center">Currency</th>
                <th className="p-3 text-center">Created At</th> */}
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                renderShimmer()
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-6 text-gray-500">
                    No Projects Found
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => (
                  <tr
                    key={project.id}
                    className={`border-b hover:bg-gray-50 ${
                      selectedIds.includes(project.id) ? "bg-purple-50" : ""
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(project.id)}
                        onChange={() => toggleSelect(project.id)}
                        className="accent-purple-600"
                      />
                    </td>
                    <td className="p-3 text-center text-[#3A3A3A]  align-middle">
                      {(page - 1) * limit + index + 1}
                    </td>

                    <td className="p-3  text-center whitespace-nowrap text-[#3A3A3A]  align-middle">
                      {project.code}
                    </td>
                    <td
                      className="p-3 text-center  text-[#3A3A3A]  align-middle"
                      title={project.name}
                    >
                      {getTwoWordPreview(project.name)}
                    </td>
                    <td className="p-3  text-center text-[#3A3A3A]  align-middle">
                      {project.country}
                    </td>
                    {/* <td className="p-3  text-center text-[#3A3A3A]  align-middle">
                      {project.city}
                    </td> */}
                    <td className="p-3  text-center text-[#3A3A3A]  align-middle">
                      {project.manager?.fullName || "—"}
                    </td>
                    <td className="p-3  text-center whitespace-nowrap text-[#3A3A3A]  align-middle">
                      {formatToYMD(project.startDate)}
                    </td>
                    <td className="p-3  text-center whitespace-nowrap text-[#3A3A3A] align-middle">
                      {formatToYMD(project.endDate)}
                    </td>
                    <td className="p-3 text-center align-middle">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full">
                        <StatusBadge status={project.status} />
                      </span>
                    </td>
                    {userRole == "USER" ? (
                      ""
                    ) : (
                      <td className="p-3  text-center text-[#3A3A3A]  align-middle">
                        {project.budgetBaseline}
                      </td>
                    )}
                    {/* <td className="p-3  text-center text-[#3A3A3A]  align-middle">
                      {project.currency}
                    </td>
                    <td className="p-3  text-center text-[#3A3A3A]  align-middle">
                      {formatToYMD(project.createdAt)}
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
                          toggleMenu(project.id);
                        }}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenuId === project.id && (
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
                              setSelectedProjectId(project.id);
                              setViewModalOpen(true);
                              setOpenMenuId(null); // 🔥 CLOSE MENU
                            }}
                            className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c]"
                          >
                            <Eye size={16} /> View
                          </button>

                          {(userRole === "SUPER_ADMIN" ||
                            userRole === "MANAGER") && (
                            <button
                              onClick={() => {
                                setSelectedProjectId(project.id); // send id to modal
                                setIsModalOpen(true);
                                setOpenMenuId(null); // 🔥 CLOSE MENU
                              }}
                              className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c]"
                            >
                              <Edit size={16} /> Edit
                            </button>
                          )}

                          {userRole === "SUPER_ADMIN" && (
                            <button
                              onClick={() => {
                                setSelectedProject(project);
                                setSelectedProjectId(project.id);
                                setSingleDeleteConfirmOpen(true);
                                setOpenMenuId(null); // 🔥 CLOSE MENU
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
                ))
              )}
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

        <AddProject
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProjectId(null); // reset mode
          }}
          projectId={selectedProjectId}
        />
      </div>

      {/* SINGLE DELETE CONFIRMATION */}
      <ConfirmModal
        open={singleDeleteConfirmOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.name}"?`}
        onConfirm={confirmSingleDelete}
        onCancel={() => setSingleDeleteConfirmOpen(false)}
      />

      <ViewProjectDetailsModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        projectId={selectedProjectId}
      />

      {/* Multiple DELETE CONFIRMATION */}
      <ConfirmModal
        open={bulkDeleteConfirmOpen}
        title="Delete Selected Projects"
        message={`Are you sure you want to delete ${selectedIds.length} project(s)?`}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default Project;
