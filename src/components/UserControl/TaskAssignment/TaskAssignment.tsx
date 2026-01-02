import React, { useEffect, useRef, useState } from "react";
import { Search, Filter, Calendar, Trash2, AlertTriangle } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import AddTaskModal from "./AddTaskModal";

import {
  useGetTodoTasksQuery,
  useGetInProgressTasksQuery,
  useGetDoneTasksQuery,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "../../../features/userTaskAssignment/api/userTaskAssignmentApi";
import { TaskSkeleton } from "./BoxShimmer";
import { useGetProjectsQuery } from "../../../features/userTaskAssignment/api/userTaskAssignmentApi";
import { useSelector } from "react-redux";
import ConfirmModal from "../../common/ConfirmModal";
import { showError, showSuccess } from "../../../utils/toast";
import AccessDenied from "../../common/AccessDenied";
import useClickOutside from "../../../hooks/useClickOutside";

/* ================= TYPES ================= */

interface Project {
  id: string;
  name: string;
  code: string;
}

interface User {
  fullName: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate: string;
  taskCode: string;
  project?: Project;
  assignedTo?: User;
}

type ColumnMap = {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
};

const TaskAssignment: React.FC = () => {
  const [localColumns, setLocalColumns] = useState<ColumnMap>({
    todo: [],
    inProgress: [],
    done: [],
  });

  const userRole = useSelector((state: any) => state.auth.user?.role?.name);

  //delete task
  const [deleteTask] = useDeleteTaskMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [singleDeleteConfirmOpen, setSingleDeleteConfirmOpen] = useState(false);

  // ==============================
  // PAGE STATE FOR EACH COLUMN
  // ==============================
  const [todoPage, setTodoPage] = useState(1);
  const [progressPage, setProgressPage] = useState(1);
  const [donePage, setDonePage] = useState(1);

  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);

  // FILTER STATES
  const [projectFilter, setProjectFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // SEARCH
  const [search, setSearch] = useState("");

  // TEMP states used inside Filter Modal
  const [tempProject, setTempProject] = useState("");
  const [tempPriority, setTempPriority] = useState("");
  const [tempStart, setTempStart] = useState("");
  const [tempEnd, setTempEnd] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Project dropdown states
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState(null);
  const [showProjectDD, setShowProjectDD] = useState(false);
  const [projectHighlight, setProjectHighlight] = useState(-1);

  // Dropdown ref
  const projectDropdownRef = useRef(null);

  const limit = 5;

  // ==============================
  // API CALLS FOR all project
  // ==============================
  const {
    data: allProjects = [],
    isLoading: loadingProjects,
    refetch: refetchProjects,
  } = useGetProjectsQuery();

  // ==============================
  // API CALLS FOR EACH COLUMN
  // ==============================
  const {
    data: todoData,
    isLoading: loadingTodo,
    error: todoError,
  } = useGetTodoTasksQuery({
    page: todoPage,
    limit,
    projectId: projectFilter,
    priority: priorityFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    search,
  });

  const {
    data: progressData,
    isLoading: loadingProgress,
    error: progressError,
  } = useGetInProgressTasksQuery({
    page: progressPage,
    limit,
    projectId: projectFilter,
    priority: priorityFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    search,
  });

  const {
    data: doneData,
    isLoading: loadingDone,
    error: doneError,
  } = useGetDoneTasksQuery({
    page: donePage,
    limit,
    projectId: projectFilter,
    priority: priorityFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    search,
  });

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  //close filter when click outside
  useClickOutside(
    filterRef,
    () => {
      setFilterOpen(false);
    },
    [filterBtnRef]
  );

  // ==============================
  // FORMAT COLUMNS
  // ==============================
  const columns = localColumns;

  const columnPagination = {
    todo: todoData?.pagination,
    inProgress: progressData?.pagination,
    done: doneData?.pagination,
  };

  useEffect(() => {
    setLocalColumns({
      todo: todoData?.tasks || [],
      inProgress: progressData?.tasks || [],
      done: doneData?.tasks || [],
    });
  }, [todoData, progressData, doneData]);

  // ==============================
  // PRIORITY BADGE COLORS
  // ==============================
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-600";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-600";
      case "LOW":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ==============================
  //Filter projects
  // ==============================

  const filteredProjectList = allProjects.filter((p) =>
    `${p.name} ${p.code}`.toLowerCase().includes(projectSearch.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(e.target)
      ) {
        setShowProjectDD(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ==============================
  //Task Delete Handler
  // ==============================
  const confirmSingleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteTask(deleteId).unwrap();

      // 🔥 Instant UI update (no refresh needed)
      setLocalColumns((prev) => ({
        todo: prev.todo.filter((t) => t.id !== deleteId),
        inProgress: prev.inProgress.filter((t) => t.id !== deleteId),
        done: prev.done.filter((t) => t.id !== deleteId),
      }));

      showSuccess("Task deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);
      showError("Failed to delete task");
    } finally {
      setSingleDeleteConfirmOpen(false);
      setDeleteId(null);
    }
  };

  // ==============================
  // DRAG & DROP HANDLER
  // ==============================
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const start = source.droppableId as keyof ColumnMap;
    const end = destination.droppableId as keyof ColumnMap;

    // ❌ Same column reorder — UI only, no API, no toast
    if (start === end) {
      const newTasks = Array.from(localColumns[start]);
      const [moved] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, moved);

      setLocalColumns((prev) => ({
        ...prev,
        [start]: newTasks,
      }));

      return;
    }

    const task = localColumns[start][source.index];

    // SAVE PREVIOUS STATE (for rollback)
    const prevColumns = JSON.parse(JSON.stringify(localColumns));

    // OPTIMISTIC UI UPDATE
    const newColumns: ColumnMap = {
      todo: [...localColumns.todo],
      inProgress: [...localColumns.inProgress],
      done: [...localColumns.done],
    };

    newColumns[start].splice(source.index, 1);
    newColumns[end].splice(destination.index, 0, task);

    setLocalColumns(newColumns);

    const statusMap = {
      todo: "TODO",
      inProgress: "IN_PROGRESS",
      done: "DONE",
    } as const;

    try {
      await updateTaskStatus({
        id: task.id,
        status: statusMap[end],
      }).unwrap();

      //SUCCESS
      showSuccess("Task status updated successfully");
    } catch (error) {
      //ROLLBACK UI
      setLocalColumns(prevColumns);

      showError("Failed to update task status");
      console.error("Status update failed:", error);
    }
  };

  // ==============================
  // Handle view Permissions
  // ==============================

  const permissionErrorMessage =
    (todoError as any)?.data?.message ||
    (progressError as any)?.data?.message ||
    (doneError as any)?.data?.message;

  // ONLY check for READ access
  const noReadAccess = /READ access/i.test(permissionErrorMessage || "");

  // If user has no READ access → block entire page
  if (noReadAccess) {
    return (
      <AccessDenied
        title="Access Denied"
        message={
          permissionErrorMessage ||
          "You do not have READ access to Task Assignment."
        }
      />
    );
  }

  // ==============================
  // LOADING STATES
  // ==============================
  // if (loadingTodo || loadingProgress || loadingDone)
  //   return <p className="text-center py-10 text-gray-500">Loading tasks...</p>;

  // ==============================
  // TASK CARD COMPONENT
  // ==============================
  const TaskCard = ({ task, index }: any) => {
    const initials = task.assignedTo?.fullName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("");

    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`bg-white p-4 rounded-2xl shadow-sm border mb-4 transition-all duration-200 
${
  snapshot.isDragging
    ? "rotate-1 shadow-lg scale-[1.03] cursor-grabbing"
    : "cursor-grab"
}
${!task.isUserInProject ? "border-red-400 bg-red-50" : "border-gray-100"}
`}
          >
            {!task.isUserInProject && userRole === "MANAGER" && (
              <div className="flex items-center gap-2 mb-2 px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs">
                <AlertTriangle size={14} />
                <span>
                  User is no longer part of this project. Please reassign this
                  task.
                </span>
              </div>
            )}
            {/* HEADER : Title + Delete */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base break-words pr-2">
                {task.title}
              </h3>
              {userRole === "MANAGER" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(task.id);
                    setSingleDeleteConfirmOpen(true);
                  }}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                  title="Delete Task"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-3">{task.project?.name}</p>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
    ${
      !task.isUserInProject
        ? "bg-red-200 text-red-700"
        : "bg-purple-100 text-purple-600"
    }`}
                >
                  {initials}
                </div>
                <span
                  className={`text-sm ${
                    !task.isUserInProject
                      ? "text-red-600 line-through"
                      : "text-gray-700"
                  }`}
                >
                  {task.assignedTo?.fullName}
                </span>
              </div>

              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Calendar size={15} />
                <span>
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
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
              <span className="text-gray-400">{task.taskCode}</span>
            </div>

            <div
              title={task.description}
              className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-2"
            >
              {task.description || "No description provided"}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  // ==============================
  // MAIN UI
  // ==============================
  return (
    <div className="bg-white min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            User Task Assignment
          </h1>
          <p className="text-sm text-gray-500">
            Kanban board for project task management
          </p>
        </div>
        {userRole === "MANAGER" && (
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="flex items-center gap-1 bg-[#4b0082] hover:bg-[#4b0089] text-white text-xs sm:text-sm px-3 py-2 rounded-md"
          >
            + Add Task
          </button>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col items-end md:flex-row md:items-center md:justify-between gap-5 shadow p-4 rounded-lg border border-gray-200">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title / project / task code / assignee...."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2] outline-none"
          />
        </div>

        {/* FILTER WRAPPER */}
        <div className="relative min-w-max">
          <button
            ref={filterBtnRef}
            onClick={() => {
              // open with previously applied filters
              setTempProject(projectFilter);
              setTempPriority(priorityFilter);
              setTempStart(startDateFilter);
              setTempEnd(endDateFilter);

              setFilterOpen(!filterOpen);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-[f0f0f0] rounded-lg 
               text-sm font-medium bg-[#4b0082] text-white 
               hover:text-gray-700 hover:bg-[#facf6c] hover:border-[#fe9a00]"
          >
            <Filter size={16} /> Filters
          </button>

          {filterOpen && (
            <div
              ref={filterRef}
              className="absolute right-0 mt-2 w-80 max-w-[90vw] 
                    bg-white p-4 rounded-xl border shadow-lg z-50"
            >
              <h3 className="text-sm font-semibold mb-3">Filter Tasks</h3>

              {/* PROJECT SEARCHABLE DROPDOWN */}

              <div className="mb-2 relative" ref={projectDropdownRef}>
                <label className="text-xs text-gray-600">Project</label>

                <input
                  type="text"
                  value={
                    selectedProjectFilter
                      ? `${selectedProjectFilter.name} (${selectedProjectFilter.code})`
                      : projectSearch
                  }
                  title={
                    selectedProjectFilter
                      ? `${selectedProjectFilter.name} (${selectedProjectFilter.code})`
                      : projectSearch
                  }
                  onChange={(e) => {
                    setSelectedProjectFilter(null);
                    setProjectSearch(e.target.value.trimStart());
                    setShowProjectDD(true);
                  }}
                  onFocus={() => {
                    refetchProjects();
                    setShowProjectDD(true);
                  }}
                  placeholder="Search project..."
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 pr-10 text-sm 
       focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                />

                {/* CLEAR BUTTON */}
                {(projectSearch || selectedProjectFilter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setProjectSearch("");
                      setSelectedProjectFilter(null);
                    }}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}

                {/* DROPDOWN */}
                {showProjectDD && (
                  <div
                    className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 
        max-h-56 overflow-y-auto shadow-lg z-50"
                  >
                    {loadingProjects && (
                      <div className="p-3 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    )}

                    {!loadingProjects && filteredProjectList.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        No results found
                      </div>
                    )}

                    {filteredProjectList.map((p, index) => (
                      <div
                        key={p.id}
                        onMouseEnter={() => setProjectHighlight(index)}
                        onClick={() => {
                          setSelectedProjectFilter(p);
                          setProjectSearch("");
                          setShowProjectDD(false);
                        }}
                        className={`px-4 py-2 cursor-pointer text-sm ${
                          projectHighlight === index
                            ? "bg-[#f4e8ff] text-[#5b00b2] border-l-4 border-[#5b00b2] font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium">{p.code}</div>
                        <div className="text-xs text-gray-500">{p.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PRIORITY */}
              <div className="mb-3">
                <label className="text-xs text-gray-600">Priority</label>
                <select
                  value={tempPriority}
                  onChange={(e) => setTempPriority(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm 
                     focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                >
                  <option value="">All</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* DATE RANGE */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* start Date */}
                <div>
                  <label className="text-xs text-gray-600">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={tempStart}
                      onChange={(e) => setTempStart(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                    />
                    <Calendar
                      onClick={(e) =>
                        (
                          e.currentTarget
                            .previousElementSibling as HTMLInputElement
                        )?.showPicker?.()
                      }
                      size={16}
                      className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* end Date */}
                <div>
                  <label className="text-xs text-gray-600">End Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={tempEnd}
                      onChange={(e) => setTempEnd(e.target.value)}
                      className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-[#5b00b2]"
                    />
                    <Calendar
                      onClick={(e) =>
                        (
                          e.currentTarget
                            .previousElementSibling as HTMLInputElement
                        )?.showPicker?.()
                      }
                      size={16}
                      className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-between mt-4">
                <button
                  className="text-sm text-gray-600 hover:underline"
                  onClick={() => {
                    setTempProject("");
                    setTempPriority("");
                    setTempStart("");
                    setTempEnd("");
                    setSelectedProjectFilter(null);
                    setProjectSearch("");
                  }}
                >
                  Reset
                </button>

                <button
                  className="bg-[#4b0082] text-white text-sm px-4 py-2 rounded-lg"
                  onClick={() => {
                    setProjectFilter(
                      selectedProjectFilter ? selectedProjectFilter.id : ""
                    );
                    setPriorityFilter(tempPriority);
                    setStartDateFilter(tempStart);
                    setEndDateFilter(tempEnd);

                    setTodoPage(1);
                    setProgressPage(1);
                    setDonePage(1);

                    setFilterOpen(false);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {Object.entries(columns).map(([colId, tasks]) => (
            <Droppable key={colId} droppableId={colId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`bg-white p-2 rounded-2xl min-h-[400px] ${
                    snapshot.isDraggingOver ? "bg-purple-50 border" : ""
                  }`}
                >
                  <h2 className="font-semibold text-gray-700 mb-2 capitalize">
                    {colId === "todo"
                      ? "To Do"
                      : colId === "inProgress"
                      ? "In Progress"
                      : "Done"}{" "}
                    <span className="text-sm text-gray-400">
                      ({tasks.length} Tasks)
                    </span>
                  </h2>

                  {/* 🔄 SHIMMER LOADER PER COLUMN */}
                  {((colId === "todo" && loadingTodo) ||
                    (colId === "inProgress" && loadingProgress) ||
                    (colId === "done" && loadingDone)) && (
                    <>
                      {[1, 2, 3].map((i) => (
                        <TaskSkeleton key={i} />
                      ))}
                    </>
                  )}

                  {/* ✅ SHOW TASKS WHEN NOT LOADING */}
                  {colId === "todo" &&
                    !loadingTodo &&
                    tasks.map((task, i) => (
                      <TaskCard key={task.id} task={task} index={i} />
                    ))}

                  {colId === "inProgress" &&
                    !loadingProgress &&
                    tasks.map((task, i) => (
                      <TaskCard key={task.id} task={task} index={i} />
                    ))}

                  {colId === "done" &&
                    !loadingDone &&
                    tasks.map((task, i) => (
                      <TaskCard key={task.id} task={task} index={i} />
                    ))}

                  {provided.placeholder}

                  {/* Show pagination ONLY if total tasks > limit */}
                  {(columnPagination[colId]?.totalPages > 1 ||
                    columnPagination[colId]?.page > 1) && (
                    <div className="flex justify-between mt-4 px-2">
                      <button
                        disabled={columnPagination[colId]?.page === 1}
                        onClick={() => {
                          if (colId === "todo") setTodoPage((p) => p - 1);
                          if (colId === "inProgress")
                            setProgressPage((p) => p - 1);
                          if (colId === "done") setDonePage((p) => p - 1);
                        }}
                        className="px-4 py-1.5 text-xs rounded-full border border-gray-300
                 hover:bg-gray-100 transition disabled:opacity-40
                 disabled:hover:bg-transparent"
                      >
                        ← Prev
                      </button>

                      <button
                        disabled={!columnPagination[colId]?.hasNextPage}
                        onClick={() => {
                          if (colId === "todo") setTodoPage((p) => p + 1);
                          if (colId === "inProgress")
                            setProgressPage((p) => p + 1);
                          if (colId === "done") setDonePage((p) => p + 1);
                        }}
                        className="px-4 py-1.5 text-xs rounded-full border border-gray-300
                 hover:bg-gray-100 transition disabled:opacity-40
                 disabled:hover:bg-transparent"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />

      <ConfirmModal
        open={singleDeleteConfirmOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        onConfirm={confirmSingleDelete}
        onCancel={() => setSingleDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default TaskAssignment;
