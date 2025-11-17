import React, { useState } from "react";
import { Search, ArrowDownRight, ArrowUpRight, Filter } from "lucide-react";
import StatusSummaryCardStockLedger from "./StatusSummaryCardStockLedger";

interface InventoryItem {
  id: number;
  itemCode: string;
  description: string;
  category: string;
  unit: string;
  openingQty: number;
  inwardQty: number;
  outwardQty: number;
  balanceQty: number;
  unitPrice: number;
  totalValue: number;
}

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    itemCode: "STL-001",
    description: "Reinforcement Steel 16mm",
    category: "Steel",
    unit: "MT",
    openingQty: 50,
    inwardQty: 30,
    outwardQty: 45,
    balanceQty: 35,
    unitPrice: 650,
    totalValue: 22750,
  },
  {
    id: 2,
    itemCode: "CEM-001",
    description: "Portland Cement",
    category: "Cement",
    unit: "Bags",
    openingQty: 500,
    inwardQty: 30,
    outwardQty: 800,
    balanceQty: 700,
    unitPrice: 8.5,
    totalValue: 5950,
  },
  {
    id: 3,
    itemCode: "ELC-012",
    description: "Electrical Cable 2.5mm",
    category: "Electrical",
    unit: "Meters",
    openingQty: 2000,
    inwardQty: 500,
    outwardQty: 1200,
    balanceQty: 1300,
    unitPrice: 1.2,
    totalValue: 1560,
  },
  {
    id: 4,
    itemCode: "PNT-005",
    description: "Acrylic Paint (White)",
    category: "Paint",
    unit: "Liters",
    openingQty: 100,
    inwardQty: 50,
    outwardQty: 80,
    balanceQty: 70,
    unitPrice: 12,
    totalValue: 840,
  },
];
const PurchaseRequestTable: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [filterPriority, setFilterPriority] = useState<string>("All");
  // const [filterStatus, setFilterStatus] = useState<string>("All");
  // const [showFilter, setShowFilter] = useState(false);

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
  const filteredRequests = inventoryData.filter((id) => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      trimmedSearch === "" ||
      id.category.toLowerCase().includes(trimmedSearch) ||
      trimmedSearch === "" ||
      id.itemCode.toLowerCase().includes(trimmedSearch);

    // const matchesPriority =
    //   filterPriority === "All" || rp.priority === filterPriority;
    // const matchesStatus = filterStatus === "All" || rp.status === filterStatus;

    // return matchesSearch && matchesPriority && matchesStatus;

    return matchesSearch;
  });

  return (
    <>
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

          {/* Filter Dropdown */}
          <div className="flex items-center gap-3">
          <div className="relative">
            <button
              // onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-[#facf6c] hover:border-[#fe9a00]"
            >
              <Filter size={16} /> Filters
            </button>

            {/* {showFilter && (
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
            )} */}
          </div>
        </div>
        </div>

        <StatusSummaryCardStockLedger />

        {/* ✅ Table Section */}
        <div className="bg-white border overflow-x-auto  border-gray-200 rounded-xl shadow-sm">
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
              <table className="min-w-full whitespace-nowrap border-collapse text-sm text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr className="border-b border-gray-200">
                    <th className="p-3 text-center font-medium">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === inventoryData.length}
                        onChange={(e) => selectAll(e.target.checked)}
                        className="accent-purple-700"
                      />
                    </th>
                    <th className="p-3 text-center font-medium">Item Code</th>
                    <th className="p-3 text-center font-medium">
                      Item Description
                    </th>
                    <th className="p-3 text-center font-medium">Category</th>
                    <th className="p-3 text-center font-medium">Unit</th>
                    <th className="p-3 text-center font-medium">Opening Qty</th>
                    <th className="p-3 text-center font-medium">Inward Qty</th>
                    <th className="p-3 text-center font-medium">Outward Qty</th>
                    <th className="p-3 text-center font-medium">Balance Qty</th>
                    <th className="p-3 text-center font-medium">Unit Price</th>
                    <th className="p-3 text-center font-medium">Total Value</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-all ${
                        selectedIds.includes(item.id) ? "bg-purple-50" : ""
                      }`}
                    >
                      <td className="p-3 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="accent-purple-700"
                        />
                      </td>

                      <td className="p-3 text-center align-middle">
                        {item.itemCode}
                      </td>
                      <td className="p-3 text-center align-middle">
                        {item.description}
                      </td>
                      <td className="p-3 text-center align-middle">
                        {item.category}
                      </td>
                      <td className="p-3 text-center align-middle">
                        {item.unit}
                      </td>
                      <td className="p-3 text-center align-middle">
                        {item.openingQty}
                      </td>

                      <td className="p-3 text-center align-middle text-green-600">
                        <div className="flex items-center justify-center gap-1">
                          <ArrowUpRight size={14} /> {item.inwardQty}
                        </div>
                      </td>

                      <td className="p-3 text-center align-middle text-red-500">
                        <div className="flex items-center justify-center gap-1">
                          <ArrowDownRight size={14} /> {item.outwardQty}
                        </div>
                      </td>

                      <td className="p-3 text-center align-middle">
                        {item.balanceQty}
                      </td>
                      <td className="p-3 text-center align-middle">
                        ${item.unitPrice}
                      </td>
                      <td className="p-3 text-center align-middle">
                        ${item.totalValue.toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {filteredRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-6 text-gray-500"
                      >
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
    </>
  );
};

export default PurchaseRequestTable;
