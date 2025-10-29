import React, { useState } from "react";
import { Plus, Filter, Upload, Trash2, Search } from "lucide-react";
import AddProject from "./AddProject";

interface Project {
  id: string;
  name: string;
  assignedTo: string;
  status: string;
  progress: number;
  budget: string;
  cost: string;
  startDate: string;
  endDate: string;
}

const initialProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "Residential Complex Phase 1",
    assignedTo: "Designer",
    status: "Active",
    progress: 43,
    budget: "$5,000,000",
    cost: "$2,150,000",
    startDate: "2024-01-15",
    endDate: "2025-06-30",
  },
  {
    id: "PRJ-002",
    name: "Commercial Plaza Development",
    assignedTo: "Hassan",
    status: "Active",
    progress: 20,
    budget: "$8,500,000",
    cost: "$1,700,000",
    startDate: "2024-03-01",
    endDate: "2025-12-31",
  },
  {
    id: "PRJ-003",
    name: "Infrastructure Upgrade - Block A",
    assignedTo: "Ahmed Ali",
    status: "Active",
    progress: 79,
    budget: "$1,200,000",
    cost: "$2,150,000",
    startDate: "2023-11-01",
    endDate: "2024-08-30",
  },
  {
    id: "PRJ-004",
    name: "Parking Structure",
    assignedTo: "Sara",
    status: "Planning",
    progress: 0,
    budget: "$2,100,000",
    cost: "$2,150,000",
    startDate: "2024-06-01",
    endDate: "2025-03-31",
  },
];

const Project: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Select / Deselect
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const selectAll = (checked: boolean) => {
    setSelectedIds(checked ? projects.map((p) => p.id) : []);
  };

  // ✅ Delete Selected Projects
  const handleDeleteSelected = () => {
    setProjects((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  // ✅ Export Selected to CSV
  const handleExportSelected = () => {
    const selectedProjects = projects.filter((p) => selectedIds.includes(p.id));
    if (selectedProjects.length === 0) return;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Project ID,Project Name,Assigned To,Status,Progress,Budget,Cost,Start Date,End Date",
        ...selectedProjects.map(
          (p) =>
            `${p.id},${p.name},${p.assignedTo},${p.status},${p.progress}%,${p.budget},${p.cost},${p.startDate},${p.endDate}`
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_projects.csv");
    document.body.appendChild(link);
    link.click();
  };

  // ✅ Filter projects by search
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Project</h1>
          <p className="text-sm text-gray-500">
            Manage construction projects and track progress
          </p>
        </div>
        <button
          className="flex items-center gap-1 bg-[#4b0082] text-white text-xs sm:text-sm px-3 py-2 rounded-md hover:bg-purple-800"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} /> Create Project
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow p-4 rounded-lg border border-[f0f0f0] mt-6">
        <div className="relative w-full md:w-9/10">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search Project..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        {/* Export/Delete Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {selectedIds.length} item(s) selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleExportSelected}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                <Upload size={16} /> Export Selected
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
              >
                <Trash2 size={16} /> Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr className="whitespace-nowrap">
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === projects.length}
                    onChange={(e) => selectAll(e.target.checked)}
                    className="accent-purple-600"
                  />
                </th>
                <th className="p-3">Project ID</th>
                <th className="p-3">Project Name</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Status</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Cost</th>
                <th className="p-3 w-[">Start Date</th>
                <th className="p-3">End Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className={`border-b hover:bg-gray-50 ${
                    selectedIds.includes(project.id) ? "bg-purple-50" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(project.id)}
                      onChange={() => toggleSelect(project.id)}
                      className="accent-purple-600"
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-700">
                    {project.id}
                  </td>
                  <td className="p-3">{project.name}</td>
                  <td className="p-3">{project.assignedTo}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        project.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            project.progress > 0
                              ? "bg-purple-600"
                              : "bg-gray-300"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-600 text-xs">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3">{project.budget}</td>
                  <td className="p-3">{project.cost}</td>
                  <td className="p-3">{project.startDate}</td>
                  <td className="p-3">{project.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
        <AddProject
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Project;
