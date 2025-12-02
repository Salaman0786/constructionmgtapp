import React from "react";
import { calculateProgress, formatLabel } from "../../utils/helpers";
import { ProjectShimmer } from "./ActiveProjectShimmer";
import { StatusBadge } from "../ProjectControl/Project/StatusBadge";
/* ---------------- TYPES ---------------- */

interface ApiProject {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "ONGOING" | "PLANNING" | "COMPLETED";
}

interface Props {
  projects?: ApiProject[];
  isLoading?: boolean;
}

/* ---------------- COLORS ---------------- */

const barColors: Record<string, string> = {
  Planning: "bg-blue-500",
  Ongoing: "bg-green-500",
  Completed: "bg-purple-500",
  "On Hold": "bg-yellow-500",
  DEFAULT: "bg-gray-500",
};

/* ---------------- COMPONENT ---------------- */

const ActiveProjectsTimeline: React.FC<Props> = ({ projects, isLoading }) => {
 
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Active Projects Timeline
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Current projects and milestones
      </p>

      <div
        className={`space-y-5 min-h-[200px] flex flex-col ${
          !isLoading && (!projects || projects.length === 0)
            ? "justify-center"
            : "justify-start"
        }`}
      >
        {isLoading ? (
          [...Array(5)].map((_, i) => <ProjectShimmer key={i} />)
        ) : projects && projects.length > 0 ? (
          projects.map((project) => {
            const progress = calculateProgress(
              project.startDate,
              project.endDate
            );

            const uiStatus = formatLabel(project.status);

            return (
              <div key={project.id}>
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-800">
                    {formatLabel(project.name)}
                  </h3>
                  <span className="text-xs font-medium px-3 py-1 rounded-full">
                    <StatusBadge status={project.status} />
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColors[uiStatus]} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Footer */}
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    Due:{" "}
                    {new Date(project.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-700 font-medium">
                    {progress}%
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          /* ✅ Empty State (height preserved) */
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            No active projects found
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveProjectsTimeline;
