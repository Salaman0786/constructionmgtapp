import React, { useState, useEffect, useRef } from "react";
import { X, Calendar } from "lucide-react";
import {
  useGetProjectsQuery,
  useGetAssigneesQuery,
  useCreateTaskMutation,
  Project,
  Assignee,
  PriorityType,
  CreateTaskPayload,
} from "../../../features/taskAssignment/api/taskAssignmentApi";

import { showError, showInfo, showSuccess } from "../../../utils/toast";
import { validateTask } from "../../../utils/validators/taskValidator";
import { RequiredLabel } from "../../common/RequiredLabel";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState<any>({});

  // API
  const { data: projects = [], isLoading: isProjectsLoading } =
    useGetProjectsQuery();
  const { data: assignees = [], isLoading: isAssigneesLoading } =
    useGetAssigneesQuery();
  const [createTask, { isLoading }] = useCreateTaskMutation();

  /* -----------------------------------
        FORM STATE
  ----------------------------------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<PriorityType>("LOW");
  const [dueDate, setDueDate] = useState("");

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<Assignee | null>(
    null
  );

  /* -----------------------------------
        SEARCH + DROPDOWN STATES
  ----------------------------------- */
  const [projectSearch, setProjectSearch] = useState("");
  const [assigneeSearch, setAssigneeSearch] = useState("");

  const [showProjectDD, setShowProjectDD] = useState(false);
  const [showAssigneeDD, setShowAssigneeDD] = useState(false);

  const [projectHighlight, setProjectHighlight] = useState(-1);
  const [assigneeHighlight, setAssigneeHighlight] = useState(-1);

  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);

  /* -----------------------------------
        FILTER SEARCH RESULTS
  ----------------------------------- */
  const filteredProjects = projects.filter((p) =>
    `${p.name} ${p.code}`.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredAssignees = assignees.filter((a) =>
    `${a.fullName} ${a.email}`
      .toLowerCase()
      .includes(assigneeSearch.toLowerCase())
  );

  /* -----------------------------------
      CLOSE DROPDOWN ON OUTSIDE CLICK
  ----------------------------------- */
  useEffect(() => {
    const handler = (e: any) => {
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(e.target)
      ) {
        setShowProjectDD(false);
      }
      if (
        assigneeDropdownRef.current &&
        !assigneeDropdownRef.current.contains(e.target)
      ) {
        setShowAssigneeDD(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  //reusable reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("LOW");
    setDueDate("");

    setSelectedProject(null);
    setSelectedAssignee(null);

    setProjectSearch("");
    setAssigneeSearch("");

    setProjectHighlight(-1);
    setAssigneeHighlight(-1);

    setShowProjectDD(false);
    setShowAssigneeDD(false);
  };

  /* -----------------------------------------
          RESET Errors WHEN CLose Or Cancel Modal
      ----------------------------------------- */

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  /* -----------------------------------
        SUBMIT FORM
  ----------------------------------- */
  const handleSave = async () => {
    const validationErrors = validateTask({
      title,
      description,
      dueDate,
      selectedProject,
      selectedAssignee,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showInfo("Please fill all required fields.");
      return;
    }

    const payload: CreateTaskPayload = {
      title,
      description,
      projectId: selectedProject.id,
      assignedToId: selectedAssignee.id,
      priority,
      dueDate,
    };

    try {
      await createTask(payload).unwrap();
      showSuccess("Task created successfully!");
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      showError("Failed to create task.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-[350px] sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">Add Task</h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form className="mt-4 space-y-4">
          {/* TITLE */}
          <div>
            <RequiredLabel label="Title" />
            <input
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev: any) => ({ ...prev, title: "" }));
              }}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
              focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* PROJECT SEARCH */}
          <div className="relative" ref={projectDropdownRef}>
            <RequiredLabel label="Project" />

            <input
              type="text"
              value={
                selectedProject
                  ? `${selectedProject.name} (${selectedProject.code})`
                  : projectSearch
              }
              placeholder="Search project..."
              onChange={(e) => {
                setSelectedProject(null);
                setProjectSearch(e.target.value.trimStart());
                setShowProjectDD(true);
                // ✅ clear project error when user types
                if (errors.project) {
                  setErrors((prev: any) => ({ ...prev, project: "" }));
                }
              }}
              onFocus={() => setShowProjectDD(true)}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
              focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            />
            {errors.project && (
              <p className="text-red-500 text-xs mt-1">{errors.project}</p>
            )}

            {/* CLEAR BUTTON */}
            {(projectSearch || selectedProject) && (
              <button
                type="button"
                onClick={() => {
                  setProjectSearch("");
                  setSelectedProject(null);
                }}
                className="absolute right-3 top-12 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}

            {/* DROPDOWN */}
            {showProjectDD && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-56 overflow-y-auto shadow-lg z-50">
                {isProjectsLoading && (
                  <div className="p-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                )}

                {!isProjectsLoading && filteredProjects.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    No results found
                  </div>
                )}

                {filteredProjects.map((p, index) => (
                  <div
                    key={p.id}
                    onMouseEnter={() => setProjectHighlight(index)}
                    onClick={() => {
                      setSelectedProject(p);
                      setShowProjectDD(false);
                      setErrors((prev: any) => ({ ...prev, project: "" }));
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

          {/* ASSIGNEE SEARCH */}
          <div className="relative" ref={assigneeDropdownRef}>
            <RequiredLabel label="Assigned To" />

            <input
              type="text"
              value={
                selectedAssignee ? selectedAssignee.fullName : assigneeSearch
              }
              placeholder="Search assignee..."
              onChange={(e) => {
                setSelectedAssignee(null);
                setAssigneeSearch(e.target.value.trimStart());
                setShowAssigneeDD(true);
                // ✅ clear assignee error when user types
                if (errors.assignee) {
                  setErrors((prev: any) => ({ ...prev, assignee: "" }));
                }
              }}
              onFocus={() => setShowAssigneeDD(true)}
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
              focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            />

            {errors.assignee && (
              <p className="text-red-500 text-xs mt-1">{errors.assignee}</p>
            )}

            {/* CLEAR BUTTON */}
            {(assigneeSearch || selectedAssignee) && (
              <button
                type="button"
                onClick={() => {
                  setAssigneeSearch("");
                  setSelectedAssignee(null);
                }}
                className="absolute right-3 top-12 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}

            {/* DROPDOWN */}
            {showAssigneeDD && (
              <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-56 overflow-y-auto shadow-lg z-50">
                {isAssigneesLoading && (
                  <div className="p-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                )}

                {!isAssigneesLoading && filteredAssignees.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    No results found
                  </div>
                )}

                {filteredAssignees.map((a, index) => (
                  <div
                    key={a.id}
                    onMouseEnter={() => setAssigneeHighlight(index)}
                    onClick={() => {
                      setSelectedAssignee(a);
                      setShowAssigneeDD(false);
                      setErrors((prev: any) => ({ ...prev, assignee: "" }));
                    }}
                    className={`px-4 py-2 cursor-pointer text-sm ${
                      assigneeHighlight === index
                        ? "bg-[#f4e8ff] text-[#5b00b2] border-l-4 border-[#5b00b2] font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-medium">{a.fullName}</div>
                    <div className="text-xs text-gray-500">{a.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GRID — DUE DATE + PRIORITY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <RequiredLabel label="Due Date" />
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    setErrors((prev: any) => ({ ...prev, dueDate: "" }));
                  }}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm
                  focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
                />
                <Calendar
                  onClick={(e) =>
                    (
                      e.currentTarget.previousElementSibling as HTMLInputElement
                    )?.showPicker?.()
                  }
                  size={16}
                  className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* PRIORITY */}
            <div>
              <RequiredLabel label="Priority" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityType)}
                className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm 
                focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <RequiredLabel label="Description" />
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev: any) => ({ ...prev, description: "" }));
              }}
              placeholder="Enter task description..."
              className="w-full mt-1 border border-gray-300 rounded-md p-2 text-sm h-28 resize-none
              focus:outline-none focus:ring-1 focus:ring-[#5b00b2] focus:border-[#5b00b2]"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700
              hover:bg-[#facf6c] hover:border-[#fe9a00]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleSave}
              className="px-4 py-2 bg-[#5b00b2] text-white rounded-md text-sm hover:bg-[#4b0082]
              disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
