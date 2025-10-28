import ProgressBar from "./ProgressBar";

interface Task {
  id: string;
  name: string;
  dependency: string;
  timeline: string;
  progress: number;
}

const tasks: Task[] = [
  {
    id: "T1",
    name: "Site Preparation",
    dependency: "Depends on: T1",
    timeline: "02/16/2024 → 04/30/2024",
    progress: 100,
  },
  {
    id: "T2",
    name: "Foundation Work",
    dependency: "Depends on: T2",
    timeline: "05/01/2024 → 08/31/2024",
    progress: 100,
  },
  {
    id: "T3",
    name: "Structural Framework",
    dependency: "Depends on: T3",
    timeline: "09/01/2024 → 12/15/2024",
    progress: 75,
  },
  {
    id: "T4",
    name: "Finishing & Interior",
    dependency: "Depends on: T4",
    timeline: "12/16/2024 → 01/30/2025",
    progress: 40,
  },
];

const GanttChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-6 p-6">
      <table className="w-full text-left text-gray-700">
        <thead>
          <tr className="border-b text-gray-500 text-sm">
            <th className="pb-3 font-medium">Task</th>
            <th className="pb-3 font-medium">Dependency</th>
            <th className="pb-3 font-medium">Timeline</th>
            <th className="pb-3 font-medium">Progress</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b hover:bg-gray-50">
              <td className="py-4 flex items-center gap-3">
                <span className="bg-purple-100 text-purple-700 font-medium px-3 py-1 rounded-full text-xs">
                  {task.id}
                </span>
                {task.name}
              </td>
              <td className="py-4 text-sm text-gray-600">{task.dependency}</td>
              <td className="py-4 text-sm text-gray-600">{task.timeline}</td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-40">
                    <ProgressBar progress={task.progress} />
                  </div>
                  <span
                    className={`font-medium ${
                      task.progress === 100 ? "text-green-600" : "text-gray-800"
                    }`}
                  >
                    {task.progress}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GanttChart;
