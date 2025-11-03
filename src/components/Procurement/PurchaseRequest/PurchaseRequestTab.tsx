import React, { useState } from "react";
import { Filter, Search} from "lucide-react";
import StatusSummaryCard from "./StatusSummaryCard";

interface PurchaseRequest {
  id: number;
  prNumber: string;
  projectName: string;
  requestedBy: string;
  department: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  requestDate: string;
  requiredDate: string;
  quantity: string;
  status: "Approved" | "Pending" | "Urgent";
}

const purchaseRequests: PurchaseRequest[] = [
  {
    id: 1,
    prNumber: "PR-2025-001",
    projectName: "Tower A Construction",
    requestedBy: "Designer",
    department: "Civil",
    priority: "High",
    requestDate: "2025-01-15",
    requiredDate: "2025-01-25",
    quantity: "15 Items",
    status: "Approved",
  },
  {
    id: 2,
    prNumber: "PR-2025-002",
    projectName: "Road Development Phase 2",
    requestedBy: "Sarah Johnson",
    department: "Infrastructure",
    priority: "Medium",
    requestDate: "2025-01-16",
    requiredDate: "2025-02-01",
    quantity: "8 Items",
    status: "Pending",
  },
  {
    id: 3,
    prNumber: "PR-2025-003",
    projectName: "Mall Renovation",
    requestedBy: "Mike Davis",
    department: "Interior",
    priority: "Low",
    requestDate: "2025-01-17",
    requiredDate: "2025-02-15",
    quantity: "22 Items",
    status: "Approved",
  },
  {
    id: 4,
    prNumber: "PR-2025-004",
    projectName: "Bridge Construction",
    requestedBy: "Emily Chen",
    department: "Structural",
    priority: "Urgent",
    requestDate: "2025-01-18",
    requiredDate: "2025-01-28",
    quantity: "12 Items",
    status: "Urgent",
  },
  {
    id: 5,
    prNumber: "PR-2025-005",
    projectName: "City Park Landscape",
    requestedBy: "John Carter",
    department: "Landscape",
    priority: "Medium",
    requestDate: "2025-01-20",
    requiredDate: "2025-02-05",
    quantity: "18 Items",
    status: "Pending",
  },
];

const PurchaseRequestTable: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showFilter, setShowFilter] = useState(false);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredRequests.map((pr) => pr.id) : []);
  };

  const handleDeleteSelected = () => {
    alert(`${selectedIds.length} requests deleted (demo only)`);
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    alert("Exporting selected PRs (demo only)");
  };

  // Filter logic
  const filteredRequests = purchaseRequests.filter((pr) => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      trimmedSearch === "" ||
      pr.projectName.toLowerCase().includes(trimmedSearch) ||
      pr.requestedBy.toLowerCase().includes(trimmedSearch)

    const matchesPriority =
      filterPriority === "All" || pr.priority === filterPriority;
    const matchesStatus = filterStatus === "All" || pr.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="mt-6 space-y-6">
      {/* ✅ Search + Filter Container */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm border border-gray-200 bg-white p-4 rounded-lg">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Project or Requested By..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-[#facf6c] hover:border-[#fe9a00]"
            >
              <Filter size={16} /> Filters
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-20">
                <div>
                  <label className="text-xs text-gray-600">Priority</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full border border-gray-300 rounded-md mt-1 p-1.5 text-sm"
                  >
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div className="mt-3">
                  <label className="text-xs text-gray-600">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md mt-1 p-1.5 text-sm"
                  >
                    <option value="All">All</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📊 Status Summary Cards */}
      <StatusSummaryCard />

      {/* ✅ Table Section */}
      <div className="bg-white border overflow-x-auto  border-gray-200 rounded-xl shadow-sm">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-gray-900 font-semibold text-base">
                Purchase Request List
              </h2>
              <p className="text-sm text-gray-500">
                Manage all purchase requests with filtering and actions.
              </p>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 text-sm justify-end">
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

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="min-w-full text-sm whitespace-nowrap  border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50 whitespace-nowrap">
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredRequests.length}
                      onChange={(e) => selectAll(e.target.checked)}
                      className="accent-purple-700"
                    />
                  </th>
                  <th className="p-3">PR Number</th>
                  <th className="p-3">Project Name</th>
                  <th className="p-3">Requested By</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Request Date</th>
                  <th className="p-3">Required Date</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((pr) => (
                  <tr
                    key={pr.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                      selectedIds.includes(pr.id) ? "bg-purple-50" : ""
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(pr.id)}
                        onChange={() => toggleSelect(pr.id)}
                        className="accent-purple-700"
                      />
                    </td>
                    <td className="p-3 text-gray-700">{pr.prNumber}</td>
                    <td className="p-3 text-gray-700">{pr.projectName}</td>
                    <td className="p-3 text-gray-700">{pr.requestedBy}</td>
                    <td className="p-3 text-gray-700">{pr.department}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          pr.priority === "High"
                            ? "bg-red-100 text-red-600"
                            : pr.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : pr.priority === "Low"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-pink-100 text-pink-600"
                        }`}
                      >
                        {pr.priority}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">{pr.requestDate}</td>
                    <td className="p-3 text-gray-700">{pr.requiredDate}</td>
                    <td className="p-3 text-gray-700">{pr.quantity}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          pr.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : pr.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {pr.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination Section */}
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
    </div>
  );
};

export default PurchaseRequestTable;
