import { useState } from "react";
import { Calendar, Download, Filter } from "lucide-react";
import Pagination from "./Pagination";
import GanttChart from "./GanttChart";

const GanttScheduling = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Gantt & Scheduling
          </h1>
          <p className="text-sm text-gray-500">
            Project timeline with dependencies and progress tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-100">
            <Calendar size={16} /> Today
          </button>
          <button className="flex items-center gap-2 bg-purple-700 text-white rounded-md px-4 py-2 text-sm hover:bg-purple-800">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Search projects..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-60 focus:ring-2 focus:ring-purple-600 outline-none"
          />
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64 focus:ring-2 focus:ring-purple-600 outline-none">
            <option>PRJ-001 - Residential Complex Phase 1</option>
          </select>
          <button className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-100">
            <Filter size={16} /> Filters
          </button>
        </div>

        <p className="text-gray-500 text-sm mb-3">
          Lorem Ipsum is simply dummy text of the printing.
        </p>

        <GanttChart />
        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default GanttScheduling;
