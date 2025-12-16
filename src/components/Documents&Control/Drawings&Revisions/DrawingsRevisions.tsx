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
  File,
  Files,
} from "lucide-react";

import { useSelector } from "react-redux";
import { renderShimmer } from "../../common/tableShimmer";
import { formatToYMD, getTwoWordPreview } from "../../../utils/helpers";
import { showError, showSuccess } from "../../../utils/toast";

import AddDrawings from "./AddDrawings";

import {
  useDeleteDrawingsMutation,
  useGetDrawingsProjectsQuery,
  useGetDrawingsQuery,
} from "../../../features/drawings&controls/api/drawingsApi";
import ConfirmModal from "../../common/ConfirmModal";
import ViewDrawings from "./ViewDrawings";
import AccessDenied from "../../common/AccessDenied";
import useClickOutside from "../../../hooks/useClickOutside";

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

const DrawingsRevisions: React.FC = () => {
  const userRole = useSelector((state: any) => state.auth.user?.role?.name);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);

  const [categoryFilter, setCategoryFilter] = useState("");
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
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
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [tempProjectSearch, setTempProjectSearch] = useState("");
  const [tempCategory, setTempCategory] = useState("");
  // temporary values inside popup
  const [tempStart, setTempStart] = useState("");
  const [tempEnd, setTempEnd] = useState("");
  const [tempStatus, setTempStatus] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [projectFilter, setProjectFilter] = useState("");
  const [tempProjectFilterId, setTempProjectFilterId] = useState("");
  //pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setHighlightIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // RTK Query GET API
  const { data, isLoading, isError, error, refetch } = useGetDrawingsQuery({
    page,
    limit,
    search: searchQuery,
    category: categoryFilter,
    projectId: projectFilter,
  });

  const [deleteDrawings, { isLoading: isDeleting }] =
    useDeleteDrawingsMutation();
  /*
  This function is called when user clicks the “Delete” button in the modal.
  We send projectId + reason to API.
*/
  const confirmSingleDelete = async () => {
    try {
      await deleteDrawings([selectedProject.id]).unwrap();
      showSuccess("Drawing deleted successfully!");
      refetch();
    } catch (err) {
      showError(err.data.message || "Delete failed");
    }

    setSingleDeleteConfirmOpen(false);
  };

  //close filter when click outside
  useClickOutside(
    filterRef,
    () => {
      setFilterOpen(false);
    },
    [filterBtnRef]
  );

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
      setSelectedIds(data?.data?.drawing.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  //status color mapping
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "bg-blue-100 text-blue-600"; // Planning = Blue
      case "ONGOING":
        return "bg-green-100 text-green-600"; // Active = Green
      case "COMPLETED":
        return "bg-purple-100 text-purple-700"; // Completed = Purple
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-600"; // On Hold = Yellow
      default:
        return "bg-gray-100 text-gray-600"; // fallback
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  //handle mutiple delete
  const confirmBulkDelete = async () => {
    try {
      await deleteDrawings(selectedIds).unwrap();
      showSuccess("Selected drawings deleted successfully!");
      setSelectedIds([]);
      refetch();
    } catch (err) {
      console.error("Error :", err);
      showError(err.data.message || "Failed to delete selected drawings");
    }
    setBulkDeleteConfirmOpen(false);
  };

  //handle csv export
  const handleExportSelected = () => {
    const selectedProjects = data?.data?.drawing.filter((p) =>
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

  const {
    data: projectsData,
    isLoading: isManagersLoading,
    refetch: refetchProjects,
  } = useGetDrawingsProjectsQuery(undefined);

  const allProjects = projectsData?.data?.projects || [];
  const filteredProjects = allProjects.filter((p: any) =>
    `${p.code} ${p.name}`
      .toLowerCase()
      .includes(tempProjectSearch.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      setOpenMenuId(null);
    };

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  //handle drawing view permission

  const permissionErrorMessage = (error as any)?.data?.message;

  // ONLY READ permission check
  const noReadAccess = /READ access/i.test(permissionErrorMessage || "");

  // Block entire page if READ denied
  if (noReadAccess) {
    return (
      <AccessDenied
        title="Access Denied"
        message={
          permissionErrorMessage ||
          "You do not have READ access to Drawings & Revisions."
        }
      />
    );
  }

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Drawings & Revisions
          </h1>
          <p className="text-sm text-gray-500">
            Document control with version tags
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedProjectId(null); // VERY IMPORTANT (forces create mode)
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1 bg-[#4b0082] text-white text-xs sm:text-sm px-3 py-2 rounded-md"
          >
            <Plus size={18} /> Add Drawing
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row items-end md:items-center md:justify-between gap-3 shadow p-4 rounded-lg border border-[f0f0f0] mt-6">
        <div className="relative w-full md:w-9/10">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by drawing name / id ..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5b00b2] focus:border-[#5b00b2] outline-none"
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
              className="absolute right-0 mt-2 w-72 bg-white p-4 rounded-xl border shadow-lg z-50"
            >
              <h3 className="text-sm font-semibold mb-3">Filter Drawings</h3>

              {/* ✅ SEARCHABLE PROJECT FILTER */}
              <div className="relative mb-4" ref={dropdownRef}>
                <label className="text-xs text-gray-600">Project</label>

                <input
                  type="text"
                  value={tempProjectSearch}
                  placeholder="Search project by code or name..."
                  onFocus={() => {
                    refetchProjects();
                    setShowDropdown(true);
                  }}
                  onChange={(e) => {
                    setTempProjectSearch(e.target.value.trimStart());
                    setShowDropdown(true);
                  }}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                />

                {tempProjectSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setTempProjectSearch("");
                      setTempProjectFilterId("");
                    }}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}

                {showDropdown && (
                  <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-56 overflow-y-auto shadow-lg z-50">
                    {filteredProjects.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        No results found
                      </div>
                    )}

                    {filteredProjects.map((p: any, index: number) => (
                      <div
                        key={p.id}
                        onMouseEnter={() => setHighlightIndex(index)}
                        onClick={() => {
                          setTempProjectFilterId(p.id);
                          setTempProjectSearch(`${p.code} — ${p.name}`);
                          setShowDropdown(false);
                        }}
                        className={`px-4 py-2 cursor-pointer text-sm ${
                          highlightIndex === index
                            ? "bg-[#f4e8ff] text-[#5b00b2] border-l-4 border-[#5b00b2]"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium">{p.code}</div>
                        <div className="text-xs text-gray-500">{p.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ✅ CATEGORY FILTER */}
              <div>
                <label className="text-xs text-gray-600">Discipline</label>
                <select
                  value={tempCategory}
                  onChange={(e) => setTempCategory(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm"
                >
                  <option value="">All</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Structural">Structural</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>

              {/* ✅ ACTION BUTTONS */}
              <div className="flex justify-between mt-4">
                <button
                  className="text-sm text-gray-600 hover:underline"
                  onClick={() => {
                    setTempProjectSearch("");
                    setTempProjectFilterId("");
                    setTempCategory("");
                  }}
                >
                  Reset
                </button>

                <button
                  className="bg-[#4b0082] text-white text-sm px-4 py-2 rounded-lg"
                  onClick={() => {
                    setProjectFilter(tempProjectFilterId);
                    setCategoryFilter(tempCategory);
                    setPage(1);
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
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-gray-900 font-semibold text-base">
              Drawing Revision
            </h2>
            {/* <p className="text-sm text-gray-500">
                Comprehensive management of quantities, costs, and progress
              </p> */}
          </div>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 text-sm justify-end">
              <span className="text-gray-600">
                {selectedIds.length} selected
              </span>

              {/* <button
                onClick={handleExportSelected}
                className="bg-[#4b0082] text-white hover:text-gray-700 hover:bg-[#facf6c]  border hover:border-[#fe9a00] px-3 py-1.5 rounded-md"
              >
                Export
              </button> */}

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
        {/* When loading → shimmer */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50 whitespace-nowrap">
                <th className="p-3 text-center align-middle">
                  <input
                    type="checkbox"
                    checked={
                      data?.data?.drawing.length > 0 &&
                      selectedIds.length === data?.data?.drawing.length
                    }
                    onChange={(e) => selectAll(e.target.checked)}
                    className="accent-purple-600"
                  />
                </th>
                <th className="p-3 text-center">S.No.</th>
                <th className="p-3 text-center">Drawing ID</th>
                <th className="p-3 text-center">Drawing Name</th>
                <th className="p-3 text-center">Project</th>
                <th className="p-3 text-center">Discipline</th>
                <th className="p-3 text-center">Revision</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                renderShimmer()
              ) : data?.data?.drawing?.length === 0 || isError ? (
                <tr>
                  <td colSpan={12} className="text-center py-6 text-gray-500">
                    No Record Found
                  </td>
                </tr>
              ) : (
                data?.data?.drawing.map((project, index) => (
                  <tr
                    key={project.id}
                    className={`border-b hover:bg-gray-50 ${
                      selectedIds.includes(project.id) ? "bg-purple-50" : ""
                    }`}
                  >
                    <td className="p-3 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(project.id)}
                        onChange={() => toggleSelect(project.id)}
                        className="accent-purple-600"
                      />
                    </td>
                    <td className="p-3  text-[#3A3A3A]  text-center align-middle">
                      {(pagination.page - 1) * pagination.limit + (index + 1)}
                    </td>
                    <td className="p-3 text-[#3A3A3A]  text-center align-middle">
                      {project.drawingCode}
                    </td>
                    <td
                      className="p-3 text-[#3A3A3A]  text-center align-middle "
                      // full name on hover
                    >
                      <div className="flex text-[#3A3A3A] items-center justify-center gap-1">
                        {project.drawingName}
                        <Files size={18} className="text-gray-400" />
                      </div>
                    </td>
                    <td
                      className="p-3 text-center text-[#3A3A3A]  align-middle"
                      title={project.project?.name}
                    >
                      {getTwoWordPreview(project.project?.name || "-")}
                    </td>
                    <td className="p-3 text-center text-[#3A3A3A]  align-middle">
                      {project.discipline}
                    </td>
                    <td className="p-3 text-center text-[#3A3A3A]  align-middle">
                      {project.revision}
                    </td>
                    <td className="p-3 text-center text-[#3A3A3A]  whitespace-nowrap align-middle">
                      {formatToYMD(project.date)}
                    </td>
                    {/* ACTION MENU */}
                    <td className="px-4 py-3 text-center relative">
                      <button
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
                            className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c] hover:border-[#fe9a00]"
                          >
                            <Eye size={16} className="text-gray-500" /> View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProjectId(project.id); // send id to modal
                              setIsModalOpen(true);
                              setOpenMenuId(null); // 🔥 CLOSE MENU
                            }}
                            className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c] hover:border-[#fe9a00]"
                          >
                            <Edit size={16} className="text-gray-500" /> Edit
                          </button>

                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setSingleDeleteConfirmOpen(true);
                              setOpenMenuId(null);
                            }}
                            disabled={isDeleting}
                            className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg text-red-600 hover:text-black hover:bg-[#facf6c] hover:border-[#fe9a00]"
                          >
                            <Trash2 size={16} className="text-gray-500" />{" "}
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 pt-3 sm:px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Showing text */}
          <span className="text-sm sm:text-base">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, totalItems)} of {totalItems} results
          </span>

          {/* Buttons */}
          <div>
            <div className="flex items-center space-x-2">
              {/* First Page */}
              <button
                onClick={goToFirst}
                disabled={page === 1}
                className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
        text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsLeft size={18} />
              </button>

              {/* Prev */}
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

              {/* Next */}
              <button
                onClick={goToNext}
                disabled={page === totalPages}
                className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
        text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>

              {/* Last Page */}
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

        <AddDrawings
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProjectId(null);
            refetch();
          }}
          projectId={selectedProjectId}
        />
        <ViewDrawings
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedProjectId(null);
            refetch();
          }}
          projectId={selectedProjectId}
        />
      </div>

      {/* SINGLE DELETE CONFIRMATION */}
      <ConfirmModal
        open={singleDeleteConfirmOpen}
        title="Delete Drawing"
        message={`Are you sure you want to delete "${selectedProject?.drawingName}"?`}
        onConfirm={confirmSingleDelete}
        onCancel={() => {
          setSingleDeleteConfirmOpen(false);
        }}
      />

      {/* Multiple DELETE CONFIRMATION */}
      <ConfirmModal
        open={bulkDeleteConfirmOpen}
        title="Delete Selected Drawings"
        message={`Are you sure you want to delete ${selectedIds.length} drawing(s)?`}
        onConfirm={confirmBulkDelete}
        onCancel={() => {
          setBulkDeleteConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default DrawingsRevisions;
