import React from "react";
import {
  Search,
  Filter,
  DollarSign,
  Download,
  TrendingUp,
  TrendingDown,
  TriangleAlert,
  Dock,
} from "lucide-react";
import BudgetUtilization from "./BudgetUtilization";
import { BudgetActualTab } from "./BudgetActualTab";

const BudgetActual: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* ===== 1️⃣ Header Section ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Budget vs Actual
          </h1>
          <p className="text-sm text-gray-500">
            Budget tracking with variance analysis
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-[#4b0082] focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Current Period</option>
            <option>Year to Date</option>
            <option>By Project</option>
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
            <p className="text-base  text-gray-500">Total Budgeted</p>
            <h4 className="text-lg font-semibold text-gray-800">$1,500,000</h4>
          </div>
          <div className="bg-green-100 p-2 rounded-lg">
            <DollarSign className="text-green-600" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-gray-500">Total Actual</p>
            <h4 className="text-lg font-semibold text-gray-800">$1,510,000</h4>
          </div>
          <div className="bg-red-100 p-2 rounded-lg">
            <Dock className="text-purple-600" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-gray-500">Variance</p>
            <h4 className="text-lg font-semibold text-red-600">$-10,000</h4>
          </div>
          <div className="bg-purple-100 p-2 rounded-full">
            <TriangleAlert className="text-red-600" />
          </div>
        </div>
      </div>
      <BudgetUtilization percentage={100.7} />
      {/*  Expected Inflows & Outflows */}
      <BudgetActualTab />
    </div>
  );
};

export default BudgetActual;
