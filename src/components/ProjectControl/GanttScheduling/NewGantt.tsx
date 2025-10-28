import React from "react";
import { Calendar, Download, Filter } from "lucide-react";

const NewGantt: React.FC = () => {
  return (
    <div className="p-6 bg-white min-h-screen">
      {/* 1️⃣ Heading Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Gantt & Scheduling
          </h1>
          <p className="text-gray-500 text-sm">
            Project timeline with dependencies and progress tracking
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100">
            <Calendar size={16} />
            Today
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-indigo-700">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* 2️⃣ Search + Filters Section */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
        <input
          type="text"
          placeholder="Search projects..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option>PRJ-001 - Residential Complex Phase 1</option>
          <option>PRJ-002 - Office Tower</option>
          <option>PRJ-003 - Shopping Plaza</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* 3️⃣ Table Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-gray-600 text-sm mb-6">
          <strong>Lorem Ipsum</strong> is simply dummy text of the printing.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-gray-600">
                <th className="py-3 px-4 font-medium">Task</th>
                <th className="py-3 px-4 font-medium">Dependency</th>
                <th className="py-3 px-4 font-medium">Timeline</th>
                <th className="py-3 px-4 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                {
                  id: "T1",
                  task: "Site Preparation",
                  dep: "Depends on: T1",
                  time: "02/16/2024 → 04/30/2024",
                  progress: 100,
                },
                {
                  id: "T2",
                  task: "Foundation Work",
                  dep: "Depends on: T2",
                  time: "05/01/2024 → 08/31/2024",
                  progress: 100,
                },
                {
                  id: "T3",
                  task: "Structural Framework",
                  dep: "Depends on: T3",
                  time: "09/01/2024 → 12/15/2024",
                  progress: 75,
                },
                {
                  id: "T4",
                  task: "Finishing & Interior",
                  dep: "Depends on: T4",
                  time: "12/16/2024 → 01/30/2025",
                  progress: 40,
                },
              ].map((row) => (
                <tr key={row.id} className="border-b last:border-none">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">
                      {row.id}
                    </span>
                    {row.task}
                  </td>
                  <td className="py-4 px-4 text-gray-500">{row.dep}</td>
                  <td className="py-4 px-4 text-gray-500">{row.time}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-40 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-700 h-2 rounded-full"
                          style={{ width: `${row.progress}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          row.progress === 100
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                      >
                        {row.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <p>Showing 1 to 4 of 10 results</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
              &lt;
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded-md ${
                  page === 1
                    ? "bg-indigo-600 text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGantt;
