import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../../config/env";

export const submittalsApi = createApi({
  reducerPath: "submittalsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Documents"],
  endpoints: (builder) => ({
    getSubmittals: builder.query({
      query: ({
        page = 1,
        limit = 10,
        projectId = "",
        category = "",
        search = "",
      } = {}) => {
        let url = `/submittals?page=${page}&limit=${limit}`;

        if (projectId) url += `&projectId=${projectId}`;
        if (category) url += `&category=${category}`;
        if (search) url += `&search=${search}`;

        return url;
      },
      providesTags: ["Submittals"],
    }),
    getSubmittalsProjects: builder.query({
      query: () => "/submittals/projects",
      providesTags: ["Submittals"],
    }),
    getSubmittalsProjectsDrawings: builder.query({
      query: (id) => `/submittals/projects/${id}/drawings`,
      providesTags: ["Submittals"],
    }),
    // ✅ POST API — add a new user
    createSubmittals: builder.mutation({
      query: (payload) => ({
        url: `/submittals`,
        method: "POST",
        body: payload,
      }),
    }),

    // ✅ DELETE API — delete user
    deleteSubmittals: builder.mutation({
      query: (ids: string[]) => ({
        url: `/submittals`,
        method: "DELETE",
        body: { ids },
      }),
    }),

    getSubmittalsById: builder.query<any, string>({
      query: (id) => `/submittals/${id}`,
    }),
    uploadSubmittals: builder.mutation({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/submittals/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
    deleteSubmittalsFile: builder.mutation({
      query: (fileId: string) => ({
        url: `/submittals/file-delete/${fileId}`,
        method: "DELETE",
      }),
    }),
    // ⭐ Update user (PUT or PATCH)
    updateSubmittals: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/submittals/${id}`,
        method: "PUT", // or PATCH
        body: payload,
      }),
      invalidatesTags: ["Submittals", "Submittal"],
    }),
  }),
});

export const {
  useGetSubmittalsQuery,
  useGetSubmittalsProjectsQuery,
  useGetSubmittalsProjectsDrawingsQuery,
  useGetSubmittalsByIdQuery,
  useCreateSubmittalsMutation,
  useUploadSubmittalsMutation,
  useUpdateSubmittalsMutation,
  useDeleteSubmittalsMutation,
  useDeleteSubmittalsFileMutation,
} = submittalsApi;
