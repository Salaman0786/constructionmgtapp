import React from "react";
import { DocumentShimmer } from "./CommonShimmer";
import { formatLabel, formatToYMD } from "../../utils/helpers";

interface ApiTask {
  id: string;
  title: string;
  taskCode: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
}

interface Props {
  tasks?: ApiTask[];
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  TODO: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-green-100 text-green-700",
};

const formatStatus = (status: string) => {
  switch (status) {
    case "TODO":
      return "To Do";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Completed";
    default:
      return status;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const MyTasks: React.FC<Props> = ({ tasks, isLoading }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">My Tasks</h2>
      <p className="text-sm text-gray-500 mb-4">Latest assigned tasks</p>

      {/* ✅ Stable Height */}
      <div className={`space-y-5 min-h-[200px] flex flex-col ${
          !isLoading && (!tasks|| tasks.length === 0)
            ? "justify-center"
            : "justify-start"
        }`}>
        {isLoading ? (
          [...Array(5)].map((_, i) => <DocumentShimmer key={i} />)
        ) : tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col border border-gray-100 rounded-xl p-3 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-800">
                  {formatLabel(task.title)}
                </h3>

                <div className="flex items-center gap-2">
                  {/* Status Badge */}
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      statusColors[task.status]
                    }`}
                  >
                    {formatStatus(task.status)}
                  </span>

                  {/* Date */}
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    {formatToYMD(task.createdAt)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-1">{task.taskCode}</p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
