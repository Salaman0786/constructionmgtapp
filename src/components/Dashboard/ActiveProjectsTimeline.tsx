import React from "react";

interface Project {
  name: string;
  due: string;
  progress: number;
  status: "On Track" | "At Risk" | "Planning";
}

const statusColors: Record<Project["status"], string> = {
  "On Track": "bg-purple-100 text-purple-700",
  "At Risk": "bg-red-100 text-red-600",
  Planning: "bg-purple-200 text-purple-800",
};

const barColors: Record<Project["status"], string> = {
  "On Track": "bg-purple-700",
  "At Risk": "bg-red-500",
  Planning: "bg-purple-400",
};

const ActiveProjectsTimeline: React.FC = () => {
  const projects: Project[] = [
    {
      name: "Residential Complex Phase 1",
      due: "Jun 2025",
      progress: 43,
      status: "On Track",
    },
    {
      name: "Commercial Plaza Development",
      due: "Dec 2025",
      progress: 20,
      status: "On Track",
    },
    {
      name: "Infrastructure Upgrade - Block A",
      due: "Aug 2024",
      progress: 79,
      status: "At Risk",
    },
    {
      name: "Parking Structure",
      due: "Mar 2025",
      progress: 0,
      status: "Planning",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Active Projects Timeline
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Current projects and milestones
      </p>

      <div className="space-y-5">
        {projects.map((project, index) => (
          <div key={index}>
            {/* Header Row */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-800">
                {project.name}
              </h3>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  statusColors[project.status]
                }`}
              >
                {project.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColors[project.status]}`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">Due: {project.due}</p>
              <p className="text-xs text-gray-700 font-medium">
                {project.progress}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveProjectsTimeline;
