import React from "react";

interface Task {
  title: string;
  subtitle: string;
  priority: "High" | "Medium" | "Low";
  due: string;
}

const tasks: Task[] = [
  {
    title: "Review BOQ for Phase 2",
    subtitle: "Residential Complex",
    priority: "High",
    due: "Today",
  },
  {
    title: "Approve material PR #13",
    subtitle: "Commercial Plaza",
    priority: "Medium",
    due: "Tomorrow",
  },
  {
    title: "Site inspection report",
    subtitle: "Infrastructure Upgrade",
    priority: "High",
    due: "Today",
  },
  {
    title: "Update project schedule",
    subtitle: "Parking Structure",
    priority: "Low",
    due: "Next Week",
  },
];

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-purple-100 text-purple-600",
  Low: "bg-yellow-100 text-yellow-600",
};

const MyTasks: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">My Tasks</h2>
      <p className="text-sm text-gray-500 mb-4">
        Current projects and milestones
      </p>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex flex-col border border-gray-100 rounded-xl p-3 hover:shadow-sm transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-800">
                {task.title}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    priorityColors[task.priority]
                  }`}
                >
                  {task.priority}
                </span>
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  {task.due}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{task.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
