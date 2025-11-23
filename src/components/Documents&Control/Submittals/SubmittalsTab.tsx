import React, { useEffect, useState } from "react";
import {
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";

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
const submittalData: SubmittalRecord[] = [
  {
    id: 1,
    submittalNo: "SUB-2025-001",
    title: "Structural Steel Shop Drawings",
    category: "Material",
    linkedDrawing: "View",
    department: "Structural",
    date: "2025-01-15",
    status: "Approved",
  },
  {
    id: 2,
    submittalNo: "SUB-2025-002",
    title: "HVAC System Layout",
    category: "Drawing",
    linkedDrawing: "View",
    department: "MEP",
    date: "2025-01-16",
    status: "Submitted",
  },
  {
    id: 3,
    submittalNo: "SUB-2025-003",
    title: "Concrete Mix Design",
    category: "Material",
    linkedDrawing: "View",
    department: "Civil",
    date: "2025-01-14",
    status: "Rejected",
  },
];

const SubmittalTable: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  // adjusting action menu
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? submittalData.map((s) => s.id) : []);
  };

  const handleDeleteSelected = () => {
    alert(`${selectedIds.length} RFQs deleted (demo only)`);
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    alert(`Exporting ${selectedIds.length} RFQs (demo only)`);
  };

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => setOpenMenuId(null);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="mt-6 space-y-5">
      {/*  Search Bar Outside */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm border border-gray-200 bg-white p-4 rounded-lg">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Submittal by submittal number / title / department..."
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </div>

        <div className="relative">
          <button
            // onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-[#facf6c] hover:border-[#fe9a00]"
          >
            <Filter size={16} /> Filters
          </button>

          {/* {showFilter && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-20">
              <label className="text-xs text-gray-600">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md mt-1 p-1.5 text-sm"
              >
                <option value="All">All</option>
                <option value="Issued">Issued</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          )} */}
        </div>
      </div>

      {/* RFQ Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-5">
        {/*  Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-gray-800 font-semibold text-base">
              Pending & Completed Submittals Record
            </h2>
            <p className="text-sm text-gray-500">
              Monitor submittals with categories, statuses, linked drawings, and
              approval history
            </p>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">
                {selectedIds.length} item(s) selected
              </span>
              <button
                onClick={handleExportSelected}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-md"
              >
                Export
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-md"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/*  Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full whitespace-nowrap  text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === submittalData.length}
                    onChange={(e) => selectAll(e.target.checked)}
                    className="accent-purple-700"
                  />
                </th>
                <th className="p-3 text-center">S.NO.</th>
                <th className="p-3 text-center">Submittal Number</th>
                <th className="p-3 text-center">Title</th>
                <th className="p-3 text-center">Category</th>
                <th className="p-3 text-center">Linked Drawing</th>
                <th className="p-3 text-center">Department</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Actions</th>
                {/* <th className="p-3 text-center">Status</th> */}
              </tr>
            </thead>
            <tbody>
              {submittalData.map((mi) => (
                <tr
                  key={mi.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                    selectedIds.includes(mi.id) ? "bg-purple-50" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(mi.id)}
                      onChange={() => toggleSelect(mi.id)}
                      className="accent-purple-700 text-center align-middle"
                    />
                  </td>
                  <td className="p-3 text-center text-[#3A3A3A] align-middle">
                    1
                  </td>

                  <td className="p-3 text-center text-[#3A3A3A] align-middle">
                    {mi.submittalNo}
                  </td>
                  <td className="p-3 text-center text-[#3A3A3A] align-middle">
                    {mi.title}
                  </td>
                  <td className="p-3 text-center text-[#3A3A3A] align-middle">
                    {mi.category}
                  </td>
                  <td className="p-3 text-[#4B0082] text-center align-middle">
                    {mi.linkedDrawing}
                  </td>
                  <td className="p-3 text-center text-[#3A3A3A] align-middle">
                    {mi.department}
                  </td>
                  <td className="p-3 text-[#3A3A3A] text-center align-middle">
                    {mi.date}
                  </td>
                  {/* <td className="p-3 text-center align-middle">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full
                       ${
                         mi.status === "Issued"
                           ? "bg-green-100 text-green-700"
                           : mi.status === "Acknowledged"
                           ? "bg-green-100 text-green-700"
                           : mi.status === "Pending"
                           ? "bg-yellow-100 text-yellow-700"
                           : mi.status === "Rejected"
                           ? "bg-red-100 text-red-700"
                           : "bg-gray-100 text-gray-700"
                       }`}
                    >
                      {mi.status}
                    </span>
                  </td> */}
                  {/* ACTION MENU */}
                  <td className="px-4 py-3 text-center">
                    <button
                      className="p-2 rounded-lg hover:bg-[#facf6c]"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuPosition({
                          top: rect.bottom + 6,
                          left: rect.right - 140,
                        });
                        toggleMenu(mi.id);
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {openMenuId === mi.id && (
                      <div
                        className="fixed w-36 py-1 px-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]"
                        style={{
                          top: menuPosition.top,
                          left: menuPosition.left,
                        }}
                      >
                        <button className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c]">
                          <Eye size={16} /> View
                        </button>

                        <button className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c]">
                          <Edit size={16} /> Edit
                        </button>

                        <button className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg text-red-600 hover:bg-[#facf6c]">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {submittalData.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No MI records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/*  Pagination */}
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
  );
};

export default SubmittalTable;
