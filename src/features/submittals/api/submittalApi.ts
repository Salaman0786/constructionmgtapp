import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../../baseQueryWithInterceptor";

export const submittalsApi = createApi({
  reducerPath: "submittalsApi",
  baseQuery: baseQueryWithInterceptor,
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
      providesTags: (result) =>
        result?.data?.submittals
          ? [
              ...result.data.submittals.map((d: any) => ({
                type: "Submittals",
                id: d.id,
              })),
              { type: "Submittals", id: "LIST" },
            ]
          : [{ type: "Submittals", id: "LIST" }],
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
      providesTags: (result, error, id) => [{ type: "Submittals", id }],
    }),

    uploadSubmittals: builder.mutation({
      query: (formData: FormData) => ({
        url: "/submittals/upload-multiple",
        method: "POST",
        body: formData,
      }),
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
      invalidatesTags: (result, error, { id }) => [
        { type: "Submittals", id }, // invalidate that specific drawing
        { type: "Submittals", id: "LIST" }, // also refresh list
      ],
    }),
    updateSubmittalsStatus: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/submittals/${id}/decision`,
        method: "PATCH", // or PATCH
        body: payload,
      }),
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
  useUpdateSubmittalsStatusMutation,
  useDeleteSubmittalsMutation,
  useDeleteSubmittalsFileMutation,
} = submittalsApi;
