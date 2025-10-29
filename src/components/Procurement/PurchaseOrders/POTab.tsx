import React, { useState } from "react";
import {
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

interface PO {
  id: number;
  poNo: string;
  rfqNo: string;
  vendorName: string;
  project: string;
  orderDate: string;
  deliveryDate: string;
  amount: string;
  status: "Issued" | "Partially Received" | "Fully Received"; // restrict to valid options
}

const poList: PO[] = [
  {
    id: 1,
    poNo: "PO-2025-001",
    rfqNo: "RFQ-2025-001",
    vendorName: "Steel Suppliers LLC",
    project: "Residential Complex Phase 1",
    orderDate: "2025-01-20",
    deliveryDate: "2025-02-10",
    amount: "$125,000",
    status: "Issued",
  },
  {
    id: 2,
    poNo: "PO-2025-002",
    rfqNo: "RFQ-2025-002",
    vendorName: "ElectroPro Trading",
    project: "Commercial Plaza",
    orderDate: "2025-01-22",
    deliveryDate: "2025-02-05",
    amount: "$87,500",
    status: "Partially Received",
  },
  {
    id: 3,
    poNo: "PO-2025-003",
    rfqNo: "RFQ-2025-003",
    vendorName: "HVAC Solutions Inc",
    project: "Infrastructure Upgrade",
    orderDate: "2025-01-18",
    deliveryDate: "2025-02-01",
    amount: "$215,000",
    status: "Fully Received",
  },
  {
    id: 4,
    poNo: "PO-2025-004",
    rfqNo: "RFQ-2025-004",
    vendorName: "Concrete Mix Co.",
    project: "Bridge Renovation",
    orderDate: "2025-01-25",
    deliveryDate: "2025-02-15",
    amount: "$178,000",
    status: "Issued",
  },
  {
    id: 5,
    poNo: "PO-2025-005",
    rfqNo: "RFQ-2025-005",
    vendorName: "BrightLight Supplies",
    project: "Mall Expansion",
    orderDate: "2025-01-28",
    deliveryDate: "2025-02-18",
    amount: "$92,300",
    status: "Partially Received",
  }
];

const PurchaseOrderTable: React.FC = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showFilter, setShowFilter] = useState(false);

  // ✅ Filter + Search Logic
  const filteredPOs = poList.filter((po) => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      trimmedSearch === "" ||
      po.poNo.toLowerCase().includes(trimmedSearch) ||
      po.vendorName.toLowerCase().includes(trimmedSearch) ||
      po.project.toLowerCase().includes(trimmedSearch);
    const matchesStatus = filterStatus === "All" || po.status === filterStatus;
    return matchesSearch && matchesStatus;
  });


  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredPOs.map((r) => r.id) : []);
  };

  const handleDeleteSelected = () => {
    alert(`${selectedIds.length} RFQs deleted (demo only)`);
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    alert(`Exporting ${selectedIds.length} RFQs (demo only)`);
  };

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAction = (action: string, poNo: string) => {
    alert(`${action} clicked for ${poNo}`);
    setOpenMenuId(null);
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
                <option value="Partially Received">Partially Received</option>
                <option value="Fully Received">Fully Received</option>
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
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full whitespace-nowrap  text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredPOs.length}
                    onChange={(e) => selectAll(e.target.checked)}
                    className="accent-purple-700"
                  />
                </th>
                <th className="p-3">PO No</th>
                <th className="p-3">RFQ No</th>
                <th className="p-3">Vendor Name</th>
                <th className="p-3">Project</th>
                <th className="p-3">Order Date</th>
                <th className="p-3">Delivery Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPOs.map((po) => (
                <tr
                  key={po.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                    selectedIds.includes(po.id) ? "bg-purple-50" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(po.id)}
                      onChange={() => toggleSelect(po.id)}
                      className="accent-purple-700"
                    />
                  </td>
                  <td className="p-3 text-gray-700">{po.poNo}</td>
                  <td className="p-3 text-gray-700">{po.rfqNo}</td>
                  <td className="p-3 text-gray-700">{po.vendorName}</td>
                  <td className="p-3 text-gray-700">{po.project}</td>
                  <td className="p-3 text-gray-700 font-medium">
                    {po.orderDate}
                  </td>
                  <td className="p-3 text-gray-700">{po.deliveryDate}</td>
                  <td className="p-3 text-gray-700">{po.amount}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        po.status === "Fully Received"
                          ? "bg-green-100 text-green-700"
                          : po.status === "Partially Received"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  {/* ACTION MENU */}
                  <td className="px-4 py-3 text-center relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      onClick={() => toggleMenu(po.id)}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {openMenuId === po.id && (
                      <div className="absolute right-4 mt-1 w-32 py-1 px-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleAction("View", po.poNo)}
                          className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c] hover:border-[#fe9a00]"
                        >
                          <Eye size={16} className="text-gray-500" /> View
                        </button>
                        <button
                          onClick={() => handleAction("Edit", po.poNo)}
                          className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg hover:bg-[#facf6c] hover:border-[#fe9a00]"
                        >
                          <Edit size={16} className="text-gray-500" /> Edit
                        </button>
                        <button
                          onClick={() => handleAction("Delete", po.poNo)}
                          className="flex items-center gap-2 w-full px-2 py-1 text-left text-sm rounded-lg text-red-600 hover:text-black hover:bg-[#facf6c] hover:border-[#fe9a00]"
                        >
                          <Trash2 size={16} className="text-gray-500" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredPOs.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No PO records found
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

export default PurchaseOrderTable;
