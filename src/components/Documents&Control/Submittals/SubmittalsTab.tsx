import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  Files,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  useDeleteSubmittalsMutation,
  useGetSubmittalsQuery,
} from "../../../features/submittals/api/submittalApi";
import { showError, showSuccess } from "../../../utils/toast";
import AddModalSubmittals from "./AddModalSubmittal";
import { renderShimmer } from "../../common/tableShimmer";
import AddDrawings from "../Drawings&Revisions/AddDrawings";
import ViewDrawings from "../Drawings&Revisions/ViewDrawings";
import ConfirmModal from "../../common/ConfirmModal";
import AddModalSubmittal from "./AddModalSubmittal";
import ViewSubmittals from "./ViewSubmittals";
export interface SubmittalRecord {
  id: number;
  submittalNo: string;
  title: string;
  category: string;
  linkedDrawing: string;
  department: string;
  date: string;
  status: "Approved" | "Submitted" | "Rejected" | "Draft";
}

const SubmittalTable: React.FC = () => {
  // adjusting action menu

  const handleDeleteSelected = () => {
    alert(`${selectedIds.length} RFQs deleted (demo only)`);
    setSelectedIds([]);
  };

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => setOpenMenuId(null);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userRole = useSelector((state: any) => state.auth.user?.role?.name);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
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
  // temporary values inside popup
  const [tempStart, setTempStart] = useState("");
  const [tempEnd, setTempEnd] = useState("");
  const [tempStatus, setTempStatus] = useState("");
  const [disciplineValue, setDisciplineValue] = useState("");

  //pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // RTK Query GET API
  const { data, isLoading, isError, error, refetch } = useGetSubmittalsQuery({
    page,
    limit,
    discipline: disciplineValue,
    search: searchQuery,
    status: statusFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
  });

  const [deleteSubmittals, { isLoading: isDeleting }] =
    useDeleteSubmittalsMutation();
  /*
  This function is called when user clicks the “Delete” button in the modal.
  We send projectId + reason to API.
*/
  const confirmSingleDelete = async () => {
    try {
      await deleteSubmittals([selectedProject.id]).unwrap();
      showSuccess("Drawing deleted successfully!");
      refetch();
    } catch (err) {
      showError(err.data.message || "Delete failed");
    }

    setSingleDeleteConfirmOpen(false);
  };
  const [drawingFinalId, setDrawingFinalId] = useState("");
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  //pagination
  console.log(drawingFinalId, "finalId");

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
      await deleteSubmittals(selectedIds).unwrap();
      showSuccess("Selected drawings deleted successfully!");
      setSelectedIds([]);
      refetch();
    } catch (err) {
      console.error("Error :", err);
      showError(err.data.message || "Failed to delete selected drawings");
    }
    setBulkDeleteConfirmOpen(false);
  };

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Submittals </h1>
          <p className="text-sm text-gray-500">
            Track submittal approvals and reviews
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
              <Plus size={18} /> Add Submittal
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow p-4 rounded-lg border border-[f0f0f0] mt-6">
        <div className="relative w-full md:w-9/10">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by submittal name / code / manager..."
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
            <div className="absolute  right-0 mt-2 w-64 max-w-[90vw] bg-white p-4 rounded-xl border shadow-lg z-50">
              <h3 className="text-sm font-semibold mb-3">Filter Projects</h3>

              {/* GRID ROW: Start & End date */}
              <div className="grid grid-cols-2 gap-3">
                {/* Start Date */}
                <div>
                  <label className="text-xs text-gray-600">Start Date</label>
                  <input
                    type="date"
                    value={tempStart}
                    onChange={(e) => setTempStart(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
    focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="text-xs text-gray-600">End Date</label>
                  <input
                    type="date"
                    value={tempEnd}
                    onChange={(e) => setTempEnd(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
    focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                  />
                </div>
              </div>

              {/* Status Below */}
              <div className="mt-3">
                <label className="text-xs text-gray-600">Status</label>
                <select
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
    focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
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
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-gray-900 font-semibold text-base">
              Pending & Completed Submittals Record
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
        <div className="overflow-x-auto whitespace-nowrap border border-gray-200 rounded-xl">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50 whitespace-nowrap">
                <th className="p-3 text-center align-middle">
                  <input
                    type="checkbox"
                    checked={
                      data?.data?.submittals.length > 0 &&
                      selectedIds.length === data?.data?.submittals.length
                    }
                    onChange={(e) => selectAll(e.target.checked)}
                    className="accent-purple-600"
                  />
                </th>
                <th className="p-3 text-center">S.No.</th>
                <th className="p-3 text-center">Submittal Number</th>
                <th className="p-3 text-center">Title</th>
                <th className="p-3 text-center">Project</th>
                <th className="p-3 text-center">Category</th>
                <th className="p-3 text-center">Linked Drawing</th>
                <th className="p-3 text-center">Department</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                renderShimmer()
              ) : data?.data?.drawing?.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-6 text-gray-500">
                    No Projects Found
                  </td>
                </tr>
              ) : (
                data?.data?.submittals.map((project, index) => (
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
                    <td className="p-3  text-center align-middle">
                      {index + 1}
                    </td>
                    <td className="p-3  text-center align-middle">
                      {project.submittalCode}
                    </td>
                    <td
                      className="p-3  text-center align-middle"
                      // full name on hover
                    >
                      {project.title}
                      {/* <Files size={18} className="text-gray-400" /> */}
                    </td>
                    <td className="p-3 text-center align-middle">
                      {project.project.name}
                    </td>
                    <td className="p-3 text-center align-middle">
                      {project.category}
                    </td>
                    <td className="p-3 flex justify-center items-center">
                      {project.linkedDrawingId && (
                        <Eye
                          className="text-center align-middle cursor-pointer hover:text-blue-400"
                          onClick={() => {
                            setIsDrawingOpen(true);
                            setDrawingFinalId(project.linkedDrawingId);
                          }}
                        />
                      )}
                    </td>
                    <td className="p-3 text-center align-middle">
                      {project.department}
                    </td>
                    <td className="p-3 text-center align-middle">
                      {project.date.split("T")[0]}
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
                          {userRole === "SUPER_ADMIN" && (
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

        <AddModalSubmittal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProjectId(null);
            refetch();
          }}
          projectId={selectedProjectId}
        />
        <ViewDrawings
          isOpen={isDrawingOpen}
          onClose={() => {
            setIsDrawingOpen(false);
            setDrawingFinalId("");
            refetch();
          }}
          projectId={drawingFinalId}
        />
        <ViewSubmittals
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
        title="Delete Submittal"
        message={`Are you sure you want to delete ${selectedProject?.title}?`}
        onConfirm={confirmSingleDelete}
        onCancel={() => {
          setSingleDeleteConfirmOpen(false);
        }}
      />

      {/* Multiple DELETE CONFIRMATION */}
      <ConfirmModal
        open={bulkDeleteConfirmOpen}
        title="Delete Selected Submittals"
        message={`Are you sure you want to delete ${selectedIds.length} submittal(s)?`}
        onConfirm={confirmBulkDelete}
        onCancel={() => {
          setBulkDeleteConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default SubmittalTable;
