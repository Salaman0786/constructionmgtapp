import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../../config/env";

// =========================
// TYPES
// =========================

export interface Project {
  id: string;
  name: string;
  code: string;
}

export interface Assignee {
  id: string;
  fullName: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
}

export type PriorityType = "HIGH" | "MEDIUM" | "LOW";

export interface CreateTaskPayload {
  title: string;
  description: string;
  projectId: string;
  // assignedToId: string;
  dueDate: string;
  priority: PriorityType;
}

export interface CreatedTaskResponse {
  id: string;
  taskCode: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: PriorityType;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: {
    id: string;
    fullName: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
  };
}

// Pagination type
export interface PaginatedTasks {
  tasks: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

// =========================
// API
// =========================

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`); 
      return headers;
    },
  }),

  tagTypes: ["Tasks", "Projects", "Assignees"],

  endpoints: (builder) => ({
    // --------------------------
    // GET PROJECTS
    // --------------------------
    getProjects: builder.query<Project[], void>({
      query: () => "/tasks/projects",
      transformResponse: (response: any) => response.data.projects,
      providesTags: ["Projects"],
    }),

    // --------------------------
    // GET ASSIGNEES
    // --------------------------
    getAssignees: builder.query<Assignee[], void>({
      query: () => "/tasks/assignees",
      transformResponse: (response: any) => response.data.managers,
      providesTags: ["Assignees"],
    }),

    // --------------------------
    // CREATE TASK
    // --------------------------
    createTask: builder.mutation<CreatedTaskResponse, CreateTaskPayload>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // ============================================================
    // 🔥  FILTERABLE STATUS-BASED PAGINATED TASK QUERIES
    // ============================================================

    getTodoTasks: builder.query<
      PaginatedTasks,
      {
        page: number;
        limit: number;
        projectId?: string;
        priority?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
      }
    >({
      query: ({
        page,
        limit,
        projectId,
        priority,
        startDate,
        endDate,
        search,
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          status: "TODO",
        });

        if (projectId) params.append("projectId", projectId);
        if (priority) params.append("priority", priority);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (search) params.append("search", search);

        return `/tasks?${params.toString()}`;
      },

      transformResponse: (res: any) => ({
        tasks: res.data.tasks.todo,
        pagination: res.pagination,
      }),

      providesTags: ["Tasks"],
    }),

    getInProgressTasks: builder.query<
      PaginatedTasks,
      {
        page: number;
        limit: number;
        projectId?: string;
        priority?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
      }
    >({
      query: ({
        page,
        limit,
        projectId,
        priority,
        startDate,
        endDate,
        search,
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          status: "IN_PROGRESS",
        });

        if (projectId) params.append("projectId", projectId);
        if (priority) params.append("priority", priority);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (search) params.append("search", search);

        return `/tasks?${params.toString()}`;
      },

      transformResponse: (res: any) => ({
        tasks: res.data.tasks.inProgress,
        pagination: res.pagination,
      }),

      providesTags: ["Tasks"],
    }),

    getDoneTasks: builder.query<
      PaginatedTasks,
      {
        page: number;
        limit: number;
        projectId?: string;
        priority?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
      }
    >({
      query: ({
        page,
        limit,
        projectId,
        priority,
        startDate,
        endDate,
        search,
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          status: "DONE",
        });

        if (projectId) params.append("projectId", projectId);
        if (priority) params.append("priority", priority);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (search) params.append("search", search);

        return `/tasks?${params.toString()}`;
      },

      transformResponse: (res: any) => ({
        tasks: res.data.tasks.done,
        pagination: res.pagination,
      }),

      providesTags: ["Tasks"],
    }),

    // --------------------------
    // Delete Task
    // --------------------------

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // --------------------------
    // UPDATE STATUS
    // --------------------------
    updateTaskStatus: builder.mutation<
      any,
      { id: string; status: "TODO" | "IN_PROGRESS" | "DONE" }
    >({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

// Export hooks
export const {
  useGetProjectsQuery,
  useDeleteTaskMutation,
  useGetAssigneesQuery,
  useCreateTaskMutation,
  useGetTodoTasksQuery,
  useGetInProgressTasksQuery,
  useGetDoneTasksQuery,
  useUpdateTaskStatusMutation,
} = taskApi;
