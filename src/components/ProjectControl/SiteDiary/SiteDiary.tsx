import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Users,
  Plus,
  Calendar,
} from "lucide-react";

import AddEditSiteDiary from "./AddEditSiteDiary";
import ConfirmModal from "../Project/DeleteModal";
import ViewSiteDiaryModal from "./ViewSiteDiaryModal";

import {
  useGetSiteDiariesQuery,
  useDeleteSiteDiariesMutation,
  useGetSiteDiaryProjectsQuery,
} from "../../../features/siteDiary/api/siteDiaryApi";

import { getTwoWordPreview, formatToYMD } from "../../../utils/helpers";
import { renderShimmer } from "../../common/tableShimmer";
import { showError, showSuccess } from "../../../utils/toast";
import { renderWeatherBadge } from "./WeatherBadge";
import AccessDenied from "../../common/AccessDenied";
import useClickOutside from "../../../hooks/useClickOutside";
import { useActionMenuOutside } from "../../../hooks/useActionMenuOutside";

const SiteDiary: React.FC = () => {
  /* -----------------------------------
     Pagination + Filters
  -----------------------------------*/
  const [page, setPage] = useState(1);
  const limit = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilterId, setProjectFilterId] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);

  // TEMPORARY fields (added)
  const [tempProjectFilterId, setTempProjectFilterId] = useState("");
  const [tempProjectSearch, setTempProjectSearch] = useState("");
  const [tempStartDateFilter, setTempStartDateFilter] = useState("");
  const [tempEndDateFilter, setTempEndDateFilter] = useState("");

  // adjusting menu
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  /* -----------------------------------
     UI — Add/Edit + View
  -----------------------------------*/
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  /* -----------------------------------
     Project dropdown (same as add modal)
  -----------------------------------*/
  const dropdownRef = useRef<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const { data: projectData, refetch: refetchProjects } =
    useGetSiteDiaryProjectsQuery();
  const allProjects = projectData?.data?.projects || [];

  const filteredProjects = allProjects.filter((p: any) => {
    if (!tempProjectSearch.trim()) return true;

    return (
      p.name.toLowerCase().includes(tempProjectSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(tempProjectSearch.toLowerCase())
    );
  });

  // CLOSE DROPDOWN ON CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -----------------------------------
     Fetch diaries (RTK Query)
  -----------------------------------*/
  const { data, isLoading, refetch, error } = useGetSiteDiariesQuery({
    page,
    limit,
    search: searchQuery, // search → project.name + weather
    projectId: projectFilterId, // Filter by ID
    startDate: startDateFilter,
    endDate: endDateFilter,
  });

  const diaries = data?.data?.siteDiaryList || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;

  /* -----------------------------------
     Delete Logic
  -----------------------------------*/
  const [deleteDiaries] = useDeleteSiteDiariesMutation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedForDelete, setSelectedForDelete] = useState<any>(null);
  const [singleDeleteConfirmOpen, setSingleDeleteConfirmOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const openSingleDelete = (row: any) => {
    setSelectedForDelete(row);
    setSingleDeleteConfirmOpen(true);
  };

  const confirmSingleDelete = async () => {
    try {
      await deleteDiaries([selectedForDelete.id]).unwrap();
      showSuccess("Entry deleted");
      setSelectedIds((prev) => prev.filter((x) => x !== selectedForDelete.id));
      refetch();
    } catch (err) {
      showError(err?.data?.message || "Something went wrong");
      setOpenMenuId(null);
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

  //close Action modal when click outside
  useActionMenuOutside({
    buttonSelector: "[data-user-menu-btn]",
    menuSelector: "[data-user-menu]",
    onOutsideClick: () => setOpenMenuId(null),
    enabled: !!openMenuId, //only active when menu is open
  });

  const confirmBulkDelete = async () => {
    try {
      await deleteDiaries(selectedIds).unwrap();
      showSuccess("Selected entries deleted");
      setSelectedIds([]);
      refetch();
    } catch (err) {
      showError(err?.data?.message || "Something went wrong");
      setOpenMenuId(null);
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

  /* -----------------------------------
     Export CSV
  -----------------------------------*/
  const handleExportSelected = () => {
    const rows = diaries.filter((d) => selectedIds.includes(d.id));
    if (rows.length === 0) return showError("No entries selected");

    const header =
      "Date,Weather,Project,Manpower,Equipment,Work Done,Issues,Reported By,Created At";

    const csv = rows
      .map(
        (d) =>
          `${formatToYMD(d.date)},${d.weather},${d.project?.name || "—"},${
            d.manpower
          },${d.equipment},${(d.workDone || "").replace(/,/g, " ")},${(
            d.issues || ""
          ).replace(/,/g, " ")},${
            d.reportedByUser?.fullName || "—"
          },${formatToYMD(d.createdAt)}`
      )
      .join("\n");

    const finalCSV = "data:text/csv;charset=utf-8," + header + "\n" + csv;
    const link = document.createElement("a");
    link.href = encodeURI(finalCSV);
    link.download = "site-diary-export.csv";
    link.click();
  };

  /* -----------------------------------
     UI Handlers
  -----------------------------------*/
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectAll = (checked: boolean) =>
    setSelectedIds(checked ? diaries.map((d) => d.id) : []);

  /* -----------------------------------
     Handle view Permission
  -----------------------------------*/

  const permissionErrorMessage = (error as any)?.data?.message;

  // ONLY READ permission check
  const noReadAccess = /READ access/i.test(permissionErrorMessage || "");

  // Block page if READ access is denied
  if (noReadAccess) {
    return (
      <AccessDenied
        title="Access Denied"
        message={
          permissionErrorMessage ||
          "You do not have READ access to Site Diary (DPR)."
        }
      />
    );
  }

  /* -----------------------------------
     SEARCH + FILTER SECTION
  -----------------------------------*/
  return (
    <div className="bg-white min-h-screen space-y-6">
      {/* 1️⃣ Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Site Diary (DPR)
          </h1>
          <p className="text-sm text-gray-500">Daily progress reports</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedDiaryId(null);
              setOpenAddEdit(true);
            }}
            className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-xs sm:text-sm px-3 py-2 rounded-md"
          >
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-end md:items-center md:justify-between gap-5 shadow p-4 rounded-lg border border-gray-200">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search DPR by weather / project / description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2] outline-none"
            onChange={(e) => {
              setPage(1);
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        {/* FILTER BUTTON */}
        <div className="relative">
          <button
            ref={filterBtnRef}
            className="flex items-center gap-2 px-4 py-2 border  border-[f0f0f0]  rounded-lg text-sm font-medium bg-[#4b0082] text-white hover:text-gray-700 hover:bg-[#facf6c] hover:border-[#fe9a00]"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={16} />
            Filters
          </button>

          {filterOpen && (
            <div
              ref={filterRef}
              className="absolute  right-0 mt-2 w-64 max-w-[90vw] bg-white p-4 rounded-xl border shadow-lg z-10000"
            >
              <h3 className="text-sm font-semibold mb-3">Filter DPR</h3>

              {/* PROJECT DROPDOWN */}
              <div className="relative mb-3" ref={dropdownRef}>
                <label className="text-xs text-gray-600">Project</label>

                <input
                  type="text"
                  value={tempProjectSearch}
                  title={tempProjectSearch}
                  placeholder="Search project..."
                  onFocus={() => {
                    refetchProjects();
                    setShowDropdown(true);
                  }}
                  onChange={(e) => {
                    setTempProjectSearch(e.target.value.trimStart());
                    setShowDropdown(true);
                  }}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 pr-10 text-sm 
       focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                />

                {/* CLEAR BUTTON */}
                {tempProjectSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setTempProjectSearch("");
                      setTempProjectFilterId("");
                    }}
                    className="absolute right-3 top-12 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}

                {/* DROPDOWN */}
                {showDropdown && (
                  <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-56 overflow-y-auto shadow-lg z-50">
                    {filteredProjects.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        No results found
                      </div>
                    )}

                    {filteredProjects.map((p, index) => (
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

              {/* DATE FILTERS */}
              <div className="grid grid-cols-1 mb-3">
                <label className="text-xs text-gray-600">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={tempStartDateFilter}
                    onChange={(e) => setTempStartDateFilter(e.target.value)}
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

              <div className="grid grid-cols-1">
                <label className="text-xs text-gray-600">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={tempEndDateFilter}
                    onChange={(e) => setTempEndDateFilter(e.target.value)}
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

              <div className="flex justify-between mt-4">
                {/* RESET BUTTON */}
                <button
                  className="text-sm text-gray-600 hover:underline"
                  onClick={() => {
                    // RESET ONLY TEMP FILTERS
                    setTempProjectFilterId("");
                    setTempProjectSearch("");
                    setTempStartDateFilter("");
                    setTempEndDateFilter("");
                  }}
                >
                  Reset
                </button>

                {/* APPLY BUTTON */}
                <button
                  className="bg-[#4b0082] text-white px-4 py-2 rounded-lg text-sm"
                  onClick={() => {
                    // APPLY TEMP → MAIN
                    setProjectFilterId(tempProjectFilterId);
                    setProjectSearch(tempProjectSearch);
                    setStartDateFilter(tempStartDateFilter);
                    setEndDateFilter(tempEndDateFilter);

                    setFilterOpen(false);
                    setPage(1);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3️⃣ Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-gray-900 font-semibold text-base">
                Project DPR Tracking Table
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
                <button
                  onClick={handleExportSelected}
                  className="bg-[#4b0082] text-white hover:text-gray-700 hover:bg-[#facf6c]  border hover:border-[#fe9a00] px-3 py-1.5 rounded-md"
                >
                  Export
                </button>

                <button
                  onClick={() => setBulkDeleteConfirmOpen(true)}
                  className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-md"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50 whitespace-nowrap">
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={
                        diaries.length > 0 &&
                        selectedIds.length === diaries.length
                      }
                      onChange={(e) => selectAll(e.target.checked)}
                      className="accent-purple-700"
                    />
                  </th>
                  <th className="p-3 text-center">S. No.</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Weather</th>
                  <th className="p-3 text-center">Manpower</th>
                  <th className="p-3 text-center">Project</th>
                  <th className="p-3 text-center">Description</th>
                  <th className="p-3 text-center">Reported By</th>
                  {/* <th className="p-3 text-center">Created At</th> */}
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  renderShimmer()
                ) : diaries.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500">
                      No entries Found
                    </td>
                  </tr>
                ) : (
                  diaries.map((d, idx) => {
                    // serial number
                    const serial = (page - 1) * limit + idx + 1;
                    return (
                      <tr
                        key={d.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                          selectedIds.includes(d.id) ? "bg-purple-50" : ""
                        }`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(d.id)}
                            onChange={() => toggleSelect(d.id)}
                            className="accent-purple-700"
                          />
                        </td>
                        <td className="p-3  text-center text-[#3A3A3A] align-middle">
                          {serial}
                        </td>
                        <td className="p-3 whitespace-nowrap  text-center text-[#3A3A3A] align-middle">
                          {d.date ? formatToYMD(d.date) : "—"}
                        </td>
                        <td className="p-3 text-center whitespace-nowrap text-[#3A3A3A] align-middle">
                          {renderWeatherBadge(d.weather)}
                        </td>

                        <td className="p-3  text-center text-[#3A3A3A] align-middle">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium`}
                          >
                            <Users size={14} /> {d.manpower}
                          </span>
                        </td>
                        <td
                          className="p-3  text-center text-[#3A3A3A] align-middle"
                          title={d.project?.name}
                        >
                          {getTwoWordPreview(d.project?.name) ?? "-"}
                        </td>

                        {/* <td className="p-3  text-center align-middle">
                          {d.equipment}
                        </td> */}
                        <td
                          className="p-3  text-center text-[#3A3A3A] align-middle"
                          title={d.workDone}
                        >
                          {/* {d.workDone.length > 40
                            ? d.workDone.slice(0, 40) + "..."
                            : d.workDone} */}
                          {getTwoWordPreview(d.workDone)}
                        </td>
                        {/* <td className="p-3 text-center">
                          {d.createdAt
                            ? formatDateToDDMMYYYY(d.createdAt)
                            : "—"}
                        </td> */}
                        <td className="p-3  text-center text-[#3A3A3A] align-middle">
                          {d.reportedByUser?.fullName || "—"}
                        </td>

                        {/* ACTION MENU */}
                        <td className="px-4 py-3 text-center">
                          <button
                            data-user-menu-btn
                            className="p-2 rounded-lg hover:bg-[#facf6c]"
                            onClick={(e) => {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              setOpenMenuId(openMenuId === d.id ? null : d.id);
                              setMenuPosition({
                                top: rect.bottom + 6,
                                left: rect.right - 140,
                              });
                            }}
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          {openMenuId === d.id && (
                            <div
                              data-user-menu
                              className="fixed w-36 py-1 px-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]"
                              style={{
                                top: menuPosition.top,
                                left: menuPosition.left,
                              }}
                            >
                              <button
                                className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c]"
                                onClick={() => {
                                  setSelectedDiaryId(d.id);
                                  setViewOpen(true);
                                  setOpenMenuId(null);
                                }}
                              >
                                <Eye size={14} /> View
                              </button>

                              <>
                                <button
                                  className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c]"
                                  onClick={() => {
                                    setSelectedDiaryId(d.id);
                                    setOpenAddEdit(true);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  <Edit size={14} /> Edit
                                </button>

                                <button
                                  className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg text-red-600 hover:bg-[#facf6c]"
                                  onClick={() => openSingleDelete(d)}
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </>
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
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
                  text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft size={18} />
                </button>

                {/* Prev */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
                  text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Last Page */}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 
                  text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add/Edit modal */}
      <AddEditSiteDiary
        isOpen={openAddEdit}
        onClose={() => {
          setOpenAddEdit(false);
          setSelectedDiaryId(null);
        }}
        diaryId={selectedDiaryId}
      />

      {/* View modal (you said you have one) */}
      <ViewSiteDiaryModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        diaryId={selectedDiaryId}
      />

      {/* Confirm modals */}
      <ConfirmModal
        open={singleDeleteConfirmOpen}
        title="Delete Entry"
        message="Are you sure you want to delete this entry?"
        onConfirm={confirmSingleDelete}
        onCancel={() => setSingleDeleteConfirmOpen(false)}
      />
      <ConfirmModal
        open={bulkDeleteConfirmOpen}
        title="Delete Selected DPRs"
        message={`Are you sure you want to delete ${selectedIds.length} DPR(s)?`}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default SiteDiary;
