import React, { useRef } from "react";
import {
  Search,
  Filter,
  Sun,
  CloudRain,
  CloudSun,
  Users,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import AddSiteDiary from "./AddSiteDiary";
const SiteDiary: React.FC = () => {
  const data = [
    {
      id: 1,
      date: "2024-10-18",
      weather: {
        icon: <Sun size={16} className="text-yellow-500" />,
        label: "Sunny",
        color: "bg-yellow-100 text-yellow-700",
      },
      manpower: 45,
      tasks: 8,
      description:
        "Foundation excavation completed for Block A. Reinforcement bar placement started.",
      reportedBy: "Ahmed Ali",
    },
    {
      id: 2,
      date: "2024-10-17",
      weather: {
        icon: <CloudSun size={16} className="text-blue-500" />,
        label: "Partly Cloudy",
        color: "bg-blue-100 text-blue-700",
      },
      manpower: 38,
      tasks: 6,
      description:
        "Concrete pouring for foundation - 120 CUM completed. Quality testing samples taken.",
      reportedBy: "Ahmed Ali",
    },
    {
      id: 3,
      date: "2024-10-16",
      weather: {
        icon: <CloudRain size={16} className="text-gray-500" />,
        label: "Rainy",
        color: "bg-gray-100 text-gray-700",
      },
      manpower: 32,
      tasks: 6,
      description:
        "Limited work due to rain. Focus on covered area finishing work.",
      reportedBy: "Ahmed Ali",
    },
  ];
  const [users, setUsers] = useState(data);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Close delete popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    setActiveMenuId(null);
  };
  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? users.map((u) => u.id) : []);
  };

  const handleDeleteSelected = () => {
    setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    setSelectedIds([]);
  };

  const handleExportSelected = () => {
    const selectedUsers = users.filter((u) => selectedIds.includes(u.id));
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Email,Role,Status,Last Login,Created"]
        .concat(
          selectedUsers.map(
            (u) =>
              `${u.name},${u.email},${u.role},${u.status},${u.lastLogin},${u.created}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_users.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleToggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };
  return (
    <div className="bg-white min-h-screen space-y-6">
      {/* 1️⃣ Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Site Diary (DPR)
          </h1>
          <p className="text-sm text-gray-500">
            Daily Progress Reports and site activity log
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-xs sm:text-sm px-3 py-2 rounded-md"
          >
            + New Entry
          </button>
        </div>
      </div>

      {/* 2️⃣ Search & Controls Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow p-4 rounded-lg border border-[f0f0f0]">
        <div className="relative w-full md:w-1/2">
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

      {/* 3️⃣ Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="mb-3">
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-end gap-2 text-sm">
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

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr className="border-b border-gray-200 text-left text-gray-700 bg-gray-50 whitespace-nowrap">
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === users.length}
                      onChange={() =>
                        setSelectedIds(
                          selectedIds.length === users.length
                            ? []
                            : users.map((u) => u.id)
                        )
                      }
                      className="accent-purple-700"
                    />
                  </th>
                  <th className="p-3 min-w-[100px]">Date</th>
                  <th className="p-3 min-w-[132px]">Weather</th>
                  <th className="p-3">Manpower</th>
                  <th className="p-3">Tasks Completed</th>
                  <th className="p-3 min-w-[300px]">Description</th>
                  <th className="p-3">Reported By</th>
                </tr>
              </thead>
              <tbody>
                {users.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                      selectedIds.includes(row.id) ? "bg-purple-50" : ""
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleSelect(row.id)}
                        className="accent-purple-700"
                      />
                    </td>
                    <td className="p-3 min-w-[100px]">{row.date}</td>
                    <td className="p-3 min-w-[132px]">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${row.weather.color}`}
                      >
                        {row.weather.icon} {row.weather.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium`}
                      >
                        <Users size={14} /> {row.manpower}
                      </span>
                    </td>

                    <td className="p-3">
                      {" "}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium `}
                      >
                        <CheckCircle size={14} /> {row.tasks}
                      </span>
                    </td>
                    <td className="p-3">{row.description}</td>
                    <td className="p-3">{row.reportedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 pt-3 sm:px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span className="text-sm sm:text-base">
              Showing 1 to 4 of 10 results
            </span>

            <div>
              <div className="flex items-center space-x-2 ">
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
      <AddSiteDiary isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default SiteDiary;
