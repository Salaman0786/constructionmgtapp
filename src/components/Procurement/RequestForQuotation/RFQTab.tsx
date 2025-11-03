import React, { useState } from "react";
import { Filter, Search } from "lucide-react";

interface RFQ {
  id: number;
  rfqNo: string;
  prNo: string;
  description: string;
  vendors: number;
  quotes: string;
  startDate: string;
  endDate: string;
  status: "Under Evaluation" | "Quotes Received" | "Sent";
}

const rfqList: RFQ[] = [
  {
    id: 1,
    rfqNo: "RFQ-2025-001",
    prNo: "PR-2025-001",
    description: "Structural Steel & Rebar",
    vendors: 5,
    quotes: "4/5",
    startDate: "2025-01-18",
    endDate: "2025-01-25",
    status: "Under Evaluation",
  },
  {
    id: 2,
    rfqNo: "RFQ-2025-002",
    prNo: "PR-2025-002",
    description: "Electrical Cables & Conduits",
    vendors: 6,
    quotes: "6/6",
    startDate: "2025-01-19",
    endDate: "2025-01-28",
    status: "Quotes Received",
  },
  {
    id: 3,
    rfqNo: "RFQ-2025-003",
    prNo: "PR-2025-003",
    description: "HVAC Equipment",
    vendors: 4,
    quotes: "2/4",
    startDate: "2025-01-20",
    endDate: "2025-01-30",
    status: "Sent",
  },
  {
    id: 4,
    rfqNo: "RFQ-2025-004",
    prNo: "PR-2025-004",
    description: "Concrete Mix Supply",
    vendors: 7,
    quotes: "5/7",
    startDate: "2025-01-22",
    endDate: "2025-02-01",
    status: "Quotes Received",
  },
  {
    id: 5,
    rfqNo: "RFQ-2025-005",
    prNo: "PR-2025-005",
    description: "Lighting Equipment",
    vendors: 3,
    quotes: "2/3",
    startDate: "2025-01-25",
    endDate: "2025-02-05",
    status: "Sent",
  },
];

const RequestForQuotationTable: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showFilter, setShowFilter] = useState(false);

  // ✅ Filter + Search Logic
  const filteredRFQs = rfqList.filter((rfq) => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      trimmedSearch === "" ||
      rfq.rfqNo.toLowerCase().includes(trimmedSearch) ||
      rfq.description.toLowerCase().includes(trimmedSearch);
    const matchesStatus = filterStatus === "All" || rfq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredRFQs.map((r) => r.id) : []);
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
            placeholder="Search RFQ..."
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
                <option value="Under Evaluation">Under Evaluation</option>
                <option value="Quotes Received">Quotes Received</option>
                <option value="Sent">Sent</option>
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
              Lorem Ipsum is simply
            </h2>
            <p className="text-sm text-gray-500">
              Lorem Ipsum is simply dummy text of the printing.
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
        <div className="overflow-x-auto border  border-gray-200 rounded-xl">
          <table className="min-w-full text-sm text-left whitespace-nowrap border-collapse">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredRFQs.length}
                    onChange={(e) => selectAll(e.target.checked)}
                    className="accent-purple-700"
                  />
                </th>
                <th className="p-3">RFQ No</th>
                <th className="p-3">PR No</th>
                <th className="p-3">Description</th>
                <th className="p-3">Vendors</th>
                <th className="p-3">Quotes</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRFQs.map((rfq) => (
                <tr
                  key={rfq.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                    selectedIds.includes(rfq.id) ? "bg-purple-50" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(rfq.id)}
                      onChange={() => toggleSelect(rfq.id)}
                      className="accent-purple-700"
                    />
                  </td>
                  <td className="p-3 text-gray-700">{rfq.rfqNo}</td>
                  <td className="p-3 text-gray-700">{rfq.prNo}</td>
                  <td className="p-3 text-gray-700">{rfq.description}</td>
                  <td className="p-3 text-gray-700">{rfq.vendors}</td>
                  <td className="p-3 text-purple-600 font-medium">
                    {rfq.quotes}
                  </td>
                  <td className="p-3 text-gray-700">{rfq.startDate}</td>
                  <td className="p-3 text-gray-700">{rfq.endDate}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        rfq.status === "Under Evaluation"
                          ? "bg-green-100 text-green-700"
                          : rfq.status === "Quotes Received"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {rfq.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredRFQs.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No RFQ records found
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

export default RequestForQuotationTable;
