import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../baseQueryWithInterceptor";

export const boqApi = createApi({
  reducerPath: "boqApi",

  baseQuery: baseQueryWithInterceptor,

  tagTypes: ["boq"],

  endpoints: (builder) => ({
    /* ------------------------------------
       GET ALL PROJECTS
    ------------------------------------- */
    getBoqs: builder.query({
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
      providesTags: ["boqa"],
    }),

    /* ------------------------------------
       CREATE PROJECT
    ------------------------------------- */
    createBoq: builder.mutation({
      query: (payload) => ({
        url: `/projects`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["boqs"],
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
    getBoqById: builder.query({
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
    updateBoq: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["boqs"],
    }),
    deleteBoq: builder.mutation({
      query: (ids: string[]) => ({
        url: "/projects",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["boqs"],
    }),
  }),
});

export const {
  useGetBoqsQuery,
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useCreateBoqMutation,
  useGetProjectManagersQuery,
  useGetBoqByIdQuery,
  useUpdateBoqMutation,
  useDeleteBoqMutation,
} = boqApi;
