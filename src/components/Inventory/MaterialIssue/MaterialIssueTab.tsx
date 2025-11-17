import React, { useState } from "react";
import { Filter, Search } from "lucide-react";

export interface MaterialIssue {
  id: number;
  issueNo: string;
  projectName: string;
  issuedTo: string;
  issueDate: string;
  quantity: number; // e.g. 8
  amountUSD: number;
  status: "Issued" | "Acknowledged" | "Pending" | "Rejected";
}

const materialIssueData: MaterialIssue[] = [
  {
    id: 1,
    issueNo: "MI-2025-001",
    projectName: "Residential Complex Phase 1",
    issuedTo: "Designer",
    issueDate: "2025-01-20",
    quantity: 8,
    amountUSD: 12500,
    status: "Issued",
  },
  {
    id: 2,
    issueNo: "MI-2025-002",
    projectName: "Commercial Plaza",
    issuedTo: "Ahmed Ali",
    issueDate: "2025-01-22",
    quantity: 5,
    amountUSD: 8750,
    status: "Acknowledged",
  },
];

const MaterialIssueTable: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showFilter, setShowFilter] = useState(false);

  // ✅ Filter + Search Logic
  const filteredMIs = materialIssueData.filter((mi) => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      trimmedSearch === "" ||
      mi.issueNo.toLowerCase().includes(trimmedSearch) ||
      mi.projectName.toLowerCase().includes(trimmedSearch);
    const matchesStatus = filterStatus === "All" || mi.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredMIs.map((r) => r.id) : []);
  };

  const handleDeleteSelected = () => {
    alert(`${selectedIds.length} RFQs deleted (demo only)`);
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    alert(`Exporting ${selectedIds.length} RFQs (demo only)`);
  };

  return (
    <div className="mt-6 space-y-5">
      {/* 🔍 Search Bar Outside */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm border border-gray-200 bg-white p-4 rounded-lg">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Purchase order by PO NO, Vendor Name, Project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-[#facf6c] hover:border-[#fe9a00]"
          >
            <Filter size={16} /> Filters
          </button>

          {showFilter && (
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
          )}
        </div>
      </div>

      {/* 📋 RFQ Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-5">
        {/* 📝 Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-gray-800 font-semibold text-base">
              Issued Material Details
            </h2>
            <p className="text-sm text-gray-500">
              Overview of materials distributed to different sites
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
                Export Selected
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-md"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* 📊 Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full whitespace-nowrap  text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredMIs.length}
                    onChange={(e) => selectAll(e.target.checked)}
                    className="accent-purple-700"
                  />
                </th>
                <th className="p-3 text-center">Issue No</th>
                <th className="p-3 text-center">Project / Site Name</th>
                <th className="p-3 text-center">Issued To</th>
                <th className="p-3 text-center">Issue Date</th>
                <th className="p-3 text-center">Quantity</th>
                <th className="p-3 text-center">Amount(USD)</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMIs.map((mi) => (
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
                  <td className="p-3 text-gray-700 text-center align-middle">
                    {mi.issueNo}
                  </td>
                  <td className="p-3 text-gray-700 text-center align-middle">
                    {mi.projectName}
                  </td>
                  <td className="p-3 text-gray-700 text-center align-middle">
                    {mi.issuedTo}
                  </td>
                  <td className="p-3 text-gray-700 text-center align-middle">
                    {mi.issueDate}
                  </td>
                  <td className="p-3 text-gray-700 font-medium text-center align-middle">
                    {mi.quantity}
                  </td>
                  <td className="p-3 text-gray-700 text-center align-middle">
                    {mi.amountUSD}
                  </td>
                  <td className="p-3 text-center align-middle">
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
                  </td>
                </tr>
              ))}

              {filteredMIs.length === 0 && (
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

        {/* 📄 Pagination */}
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

export default MaterialIssueTable;
