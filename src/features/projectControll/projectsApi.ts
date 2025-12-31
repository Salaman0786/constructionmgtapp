import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../baseQueryWithInterceptor";

export const projectsApi = createApi({
  reducerPath: "projectsApi",

  baseQuery: baseQueryWithInterceptor,

  tagTypes: ["Projects", "Managers", "Dashboard"],

  endpoints: (builder) => ({
    /* ------------------------------------
       GET ALL PROJECTS
    ------------------------------------- */
    getProjects: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status = "",
        startDate = "",
        endDate = "",
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search.trim()) params.append("search", search.trim());
        if (status) params.append("status", status);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return `/projects?${params.toString()}`;
      },
      providesTags: ["Projects"],
    }),

    /* ------------------------------------
       CREATE PROJECT
    ------------------------------------- */
    createProject: builder.mutation({
      query: (payload) => ({
        url: `/projects`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Projects", "Dashboard"],
    }),

    /* ------------------------------------
       GET PROJECT MANAGERS
    ------------------------------------- */
    getProjectManagers: builder.query({
      query: () => `/projects/managers`,
      providesTags: ["Managers"],
    }),

    /* ------------------------------------
       GET ONE PROJECT BY ID
       /projects/:id
    ------------------------------------- */
    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: ["Projects"],
    }),
    getAllUsers: builder.query({
      query: () => "/projects/manager-users",
      providesTags: ["Manager-Users"],
    }),
    /* ------------------------------------
       UPDATE PROJECT
       PUT /projects/:id
    ------------------------------------- */
    updateProject: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Projects"],
    }),
    deleteProjects: builder.mutation({
      query: (ids: string[]) => ({
        url: "/projects",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Projects", "Dashboard"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useCreateProjectMutation,
  useGetProjectManagersQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectsMutation,
} = projectsApi;
