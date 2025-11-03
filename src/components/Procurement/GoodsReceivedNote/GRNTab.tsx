import React, { useState } from "react";
import { Filter, Search } from "lucide-react";

interface GRN {
  id: number;
  grnNo: string;
  poNo: string;
  supplier: string;
  grnDate: string;
  receivedBy: string;
  quantity: number;
  status: "Approved" | "Partial Approval" | "Pending Inspection";
  remarks: string;
}

const goodsReceivedNote: GRN[] = [
  {
    id: 1,
    grnNo: "GRN-2025-001",
    poNo: "PO-2025-001",
    supplier: "Steel Suppliers LLC",
    grnDate: "2025-02-08",
    receivedBy: "Designer",
    quantity: 5,
    status: "Approved",
    remarks: "All items in good condition",
  },
  {
    id: 2,
    grnNo: "GRN-2025-002",
    poNo: "PO-2025-002",
    supplier: "ElectroPro Trading",
    grnDate: "2025-02-05",
    receivedBy: "Sarah Johnson",
    quantity: 8,
    status: "Partial Approval",
    remarks: "2 items damaged",
  },
  {
    id: 3,
    grnNo: "GRN-2025-003",
    poNo: "PO-2025-003",
    supplier: "HVAC Solutions Inc",
    grnDate: "2025-02-01",
    receivedBy: "Ibrahim",
    quantity: 3,
    status: "Pending Inspection",
    remarks: "Awaiting QC check",
  },
  {
    id: 4,
    grnNo: "GRN-2025-004",
    poNo: "PO-2025-004",
    supplier: "Concrete Mix Co.",
    grnDate: "2025-02-10",
    receivedBy: "Emily Chen",
    quantity: 10,
    status: "Approved",
    remarks: "All materials verified",
  },
  {
    id: 5,
    grnNo: "GRN-2025-005",
    poNo: "PO-2025-005",
    supplier: "BrightLight Supplies",
    grnDate: "2025-02-12",
    receivedBy: "John Carter",
    quantity: 7,
    status: "Partial Approval",
    remarks: "Minor electrical faults found",
  },
  {
    id: 6,
    grnNo: "GRN-2025-006",
    poNo: "PO-2025-006",
    supplier: "PipeLine Corp.",
    grnDate: "2025-02-14",
    receivedBy: "Sophia Turner",
    quantity: 12,
    status: "Approved",
    remarks: "Pipes and fittings meet specifications",
  },
];

const PurchaseRequestTable: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showFilter, setShowFilter] = useState(false);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredGRNs.map((grn) => grn.id) : []);
  };

  const handleDeleteSelected = () => {
    alert(`${selectedIds.length} requests deleted (demo only)`);
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    alert("Exporting selected PRs (demo only)");
  };

  // Filter logic
  const filteredGRNs = goodsReceivedNote.filter((grn) => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      trimmedSearch === "" || grn.grnNo.toLowerCase().includes(trimmedSearch);

    const matchesStatus = filterStatus === "All" || grn.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mt-6 space-y-6">
      {/* ✅ Search + Filter Container */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm border border-gray-200 bg-white p-4 rounded-lg">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search GRNS..."
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
                <div className="mt-3">
                  <label className="text-xs text-gray-600">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md mt-1 p-1.5 text-sm"
                  >
                    <option value="All">All</option>
                    <option value="Approved">Approved</option>
                    <option value="Partial Approval">Partial Approval</option>
                    <option value="Pending Inspection">
                      Pending Inspection
                    </option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-gray-900 font-semibold text-base">
                Lorem Ipsum is simply
              </h2>
              <p className="text-sm text-gray-500">
                Lorem Ipsum is simply dummy text of the printing.
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
            <table className="min-w-full whitespace-nowrap  text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50 whitespace-nowrap">
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredGRNs.length}
                      onChange={(e) => selectAll(e.target.checked)}
                      className="accent-purple-700"
                    />
                  </th>
                  <th className="p-3">GRN No</th>
                  <th className="p-3">PO No</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">GRN Date</th>
                  <th className="p-3">Received By</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredGRNs.map((grn) => (
                  <tr
                    key={grn.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                      selectedIds.includes(grn.id) ? "bg-purple-50" : ""
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(grn.id)}
                        onChange={() => toggleSelect(grn.id)}
                        className="accent-purple-700"
                      />
                    </td>
                    <td className="p-3 text-gray-700">{grn.grnNo}</td>
                    <td className="p-3 text-gray-700">{grn.poNo}</td>
                    <td className="p-3 text-gray-700">{grn.supplier}</td>
                    <td className="p-3 text-gray-700">{grn.grnDate}</td>
                    <td className="p-3 text-gray-700">{grn.receivedBy}</td>
                    <td className="p-3 text-gray-700">{grn.quantity}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          grn.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : grn.status === "Pending Inspection"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {grn.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">{grn.remarks}</td>
                  </tr>
                ))}

                {filteredGRNs.length === 0 && (
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
