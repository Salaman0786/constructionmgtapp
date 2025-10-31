import React from "react";
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import CashFlowChart from "./CashFlowChart";

const CashFlowProjection: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* ===== 1️⃣ Header Section ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Cash Flow Projection
          </h1>
          <p className="text-sm text-gray-500">
            Weekly/monthly cash inflow and outflow planning
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-[#4b0082] focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Weekly View</option>
            <option>Monthly View</option>
            <option>Quarterly View</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#4b0082] text-white rounded-lg hover:bg-purple-700">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow p-4 rounded-lg border border-[f0f0f0]">
        <div className="relative w-full md:w-9/10">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search Diary (DPR)..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col items-start gap-3">
            <p className="text-base  text-gray-500">
              Total Inflow (Next 4 Months)
            </p>
            <h4 className="text-lg font-semibold text-gray-800">$2,050,000</h4>
          </div>
          <div className="bg-green-100 p-2 rounded-lg">
            <TrendingUp className="text-green-600" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-gray-500">
              Total Outflow (Next 4 Months)
            </p>
            <h4 className="text-lg font-semibold text-gray-800">$1,790,000</h4>
          </div>
          <div className="bg-red-100 p-2 rounded-lg">
            <TrendingDown className="text-red-600" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-gray-500">Net Cash Flow</p>
            <h4 className="text-lg font-semibold text-gray-800">$260,000</h4>
          </div>
          <div className="bg-purple-100 p-2 rounded-full">
            <DollarSign className="text-purple-600" />
          </div>
        </div>
      </div>

      <CashFlowChart />

      {/*  Expected Inflows & Outflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Expected Inflows
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Client Payments</span>{" "}
              <span className="font-medium">$1,500,000</span>
            </li>
            <li className="flex justify-between">
              <span>Investor Funding</span>{" "}
              <span className="font-medium">$450,000</span>
            </li>
            <li className="flex justify-between">
              <span>Other Income</span>{" "}
              <span className="font-medium">$100,000</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Expected Outflows
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Material Purchases</span>{" "}
              <span className="font-medium">$950,000</span>
            </li>
            <li className="flex justify-between">
              <span>Contractor Payments</span>{" "}
              <span className="font-medium">$650,000</span>
            </li>
            <li className="flex justify-between">
              <span>Operating Expenses</span>{" "}
              <span className="font-medium">$190,000</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CashFlowProjection;
