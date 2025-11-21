import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const drawingsApi = createApi({
  reducerPath: "drawingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://construction-api-stg.addisababadbohra.com/api",
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Documents"],
  endpoints: (builder) => ({
    getDrawings: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/drawings?page=${page}&limit=${limit}`,
      providesTags: ["Drawings"],
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
      query: (id) => `/roles/${id}`,
    }),
    uploadDrawings: builder.mutation({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/drawings/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
    deleteDrawingsFile: builder.mutation({
      query: (fileId: string) => ({
        url: `/drawings/file-delete/${fileId}`,
        method: "DELETE",
      }),
    }),
    // ⭐ Update user (PUT or PATCH)
    updateDrawings: builder.mutation({
      query: ({ id, body }) => ({
        url: `/roles/${id}`,
        method: "PUT", // or PATCH
        body,
      }),
      invalidatesTags: ["Drawings", "Drawing"],
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
  useDeleteDrawingsMutation,
  useDeleteDrawingsFileMutation,
} = drawingsApi;
