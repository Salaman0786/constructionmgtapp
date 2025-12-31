import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../../baseQueryWithInterceptor";

export const drawingsApi = createApi({
  reducerPath: "drawingsApi",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["Documents"],
  endpoints: (builder) => ({
    getDrawings: builder.query({
      query: ({
        page = 1,
        limit = 10,
        projectId = "",
        category = "",
        search = "",
      } = {}) => {
        let url = `/drawings?page=${page}&limit=${limit}`;
        if (projectId) url += `&projectId=${projectId}`;
        if (category) url += `&discipline=${category}`;
        if (search) url += `&search=${search}`;

        return url;
      },
      providesTags: (result) =>
        result?.data?.drawing
          ? [
              ...result.data.drawing.map((d: any) => ({
                type: "Drawings",
                id: d.id,
              })),
              { type: "Drawings", id: "LIST" },
            ]
          : [{ type: "Drawings", id: "LIST" }],
    }),
    getDrawingsProjects: builder.query({
      query: () => "/drawings/projects",
      providesTags: ["Projects"],
    }),
    // ✅ POST API — add a new user
    createDrawings: builder.mutation({
      query: (payload) => ({
        url: `/drawings`,
        method: "POST",
        body: payload,
      }),
    }),

    // ✅ DELETE API — delete user
    deleteDrawings: builder.mutation({
      query: (ids: string[]) => ({
        url: `/drawings`,
        method: "DELETE",
        body: { ids },
      }),
    }),

    getDrawingsById: builder.query<any, string>({
      query: (id) => `/drawings/${id}`,
      providesTags: (result, error, id) => [{ type: "Drawings", id }],
    }),
    uploadDrawings: builder.mutation({
      query: (formData: FormData) => ({
        url: "/drawings/upload-multiple",
        method: "POST",
        body: formData,
      }),
    }),
    deleteDrawingsFile: builder.mutation({
      query: (fileId: string) => ({
        url: `/drawings/file-delete/${fileId}`,
        method: "DELETE",
      }),
    }),
    // ⭐ Update user (PUT or PATCH)
    updateDrawings: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/drawings/${id}`,
        method: "PUT", // or PATCH
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Drawings", id }, // invalidate that specific drawing
        { type: "Drawings", id: "LIST" }, // also refresh list
      ],
    }),
    updateDrawingsStatus: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/drawings/${id}/decision`,
        method: "PATCH", // or PATCH
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetDrawingsQuery,
  useGetDrawingsProjectsQuery,
  useGetDrawingsByIdQuery,
  useCreateDrawingsMutation,
  useUploadDrawingsMutation,
  useUpdateDrawingsMutation,
  useUpdateDrawingsStatusMutation,
  useDeleteDrawingsMutation,
  useDeleteDrawingsFileMutation,
} = drawingsApi;
