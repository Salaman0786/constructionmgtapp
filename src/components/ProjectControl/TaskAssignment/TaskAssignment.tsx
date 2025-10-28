import React, { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  assigneeInitials: string;
  priority: "High" | "Medium" | "Low";
  code: string;
  date: string;
  progress: number;
}

const initialData = {
  todo: [
    {
      id: "1",
      title: "Prepare site safety audit report",
      project: "Construction Project Alpha",
      assignee: "John Smith",
      assigneeInitials: "JS",
      priority: "High",
      code: "PRJ-001",
      date: "Jan 25",
      progress: 0,
    },
    {
      id: "2",
      title: "Review contractor proposals",
      project: "Infrastructure Development",
      assignee: "Sarah Johnson",
      assigneeInitials: "SJ",
      priority: "Medium",
      code: "PRJ-002",
      date: "Jan 28",
      progress: 15,
    },
  ],
  inProgress: [
    {
      id: "3",
      title: "Update project timeline documentation",
      project: "Building Renovation",
      assignee: "Mike Chen",
      assigneeInitials: "MC",
      priority: "High",
      code: "PRJ-003",
      date: "Jan 22",
      progress: 65,
    },
    {
      id: "4",
      title: "Coordinate with suppliers",
      project: "Construction Project Alpha",
      assignee: "Emily Davis",
      assigneeInitials: "ED",
      priority: "Low",
      code: "PRJ-004",
      date: "Jan 24",
      progress: 40,
    },
  ],
  done: [
    {
      id: "5",
      title: "Complete budget approval forms",
      project: "Building Renovation",
      assignee: "Lisa Anderson",
      assigneeInitials: "LA",
      priority: "High",
      code: "PRJ-005",
      date: "Jan 20",
      progress: 100,
    },
    {
      id: "6",
      title: "Submit environmental compliance report",
      project: "Construction Project Alpha",
      assignee: "Tom Brown",
      assigneeInitials: "TB",
      priority: "Medium",
      code: "PRJ-006",
      date: "Jan 20",
      progress: 100,
    },
  ],
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-600";
    case "Medium":
      return "bg-yellow-100 text-yellow-600";
    case "Low":
      return "bg-blue-100 text-blue-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const TaskCard: React.FC<{ task: Task; index: number }> = ({ task, index }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided) => (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4"
      >
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <p className="text-sm text-gray-500 mb-3">{task.project}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
              {task.assigneeInitials}
            </div>
            <span className="text-sm text-gray-700">{task.assignee}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Calendar size={15} />
            <span>{task.date}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
          <span className="text-gray-400">{task.code}</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              task.progress === 100 ? "bg-green-500" : "bg-purple-400"
            }`}
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>
    )}
  </Draggable>
);

const TaskAssignment: React.FC = () => {
  const [columns, setColumns] = useState(initialData);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const startCol = source.droppableId as keyof typeof columns;
    const endCol = destination.droppableId as keyof typeof columns;

    const startTasks = Array.from(columns[startCol]);
    const [movedTask] = startTasks.splice(source.index, 1);

    if (startCol === endCol) {
      startTasks.splice(destination.index, 0, movedTask);
      setColumns((prev) => ({ ...prev, [startCol]: startTasks }));
    } else {
      const endTasks = Array.from(columns[endCol]);
      endTasks.splice(destination.index, 0, movedTask);
      setColumns((prev) => ({
        ...prev,
        [startCol]: startTasks,
        [endCol]: endTasks,
      }));
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Task Assignment</h1>
          <p className="text-sm text-gray-500">
            Kanban board for project task management
          </p>
        </div>
        <button className="flex items-center gap-1 bg-[#4b0082] hover:[#4b0089] text-white text-xs sm:text-sm px-3 py-2 rounded-md">
          + Add Task
        </button>
      </div>

      {/* Search & Filter */}
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

      {/* Kanban Columns with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {Object.entries(columns).map(([colId, tasks]) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white p-2 rounded-2xl min-h-[400px]"
                >
                  <h2 className="font-semibold text-gray-700 mb-2 capitalize">
                    {colId === "todo"
                      ? "To Do"
                      : colId === "inProgress"
                      ? "In Progress"
                      : "Done"}{" "}
                    <span className="text-sm text-gray-400">
                      ({tasks.length} Active Tasks)
                    </span>
                  </h2>

                  {tasks.map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskAssignment;
