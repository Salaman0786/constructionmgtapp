import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../../baseQueryWithInterceptor";

export interface DrawingFile {
  id: string;
  originalName: string;
  url: string;
}

export interface Drawing {
  id: string;
  drawingCode: string;
  drawingName: string;
  discipline: string;
  revision: string;
  status: "FOR_REVIEW" | "APPROVED" | "REJECTED";
  date: string;
  project?: {
    id: string;
    name: string;
  };
  files?: DrawingFile[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface DrawingsResponse {
  data: {
    drawing: Drawing[];
  };
  pagination: Pagination;
}

export interface DrawingsProjectsResponse {
  data: {
    projects: {
      id: string;
      code: string;
      name: string;
    }[];
  };
}

export const drawingsApi = createApi({
  reducerPath: "drawingsApi",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["Drawings", "Projects"],
  endpoints: (builder) => ({
    getDrawings: builder.query<
      DrawingsResponse,
      {
        page?: number;
        limit?: number;
        projectId?: string;
        category?: string;
        search?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        projectId = "",
        category = "",
        search = "",
      }) => {
        let url = `/drawings?page=${page}&limit=${limit}`;
        if (projectId) url += `&projectId=${projectId}`;
        if (category) url += `&discipline=${category}`;
        if (search) url += `&search=${search}`;
        return url;
      },
      providesTags: (result) =>
        result?.data?.drawing
          ? [
              ...result.data.drawing.map((d) => ({
                type: "Drawings" as const,
                id: d.id,
              })),
              { type: "Drawings", id: "LIST" },
            ]
          : [{ type: "Drawings", id: "LIST" }],
    }),

    getDrawingsProjects: builder.query<DrawingsProjectsResponse, void>({
      query: () => "/drawings/projects",
      providesTags: ["Projects"],
    }),

    getDrawingsById: builder.query<{ data: Drawing }, string>({
      query: (id) => `/drawings/${id}`,
      providesTags: (result, error, id) => [{ type: "Drawings", id }],
    }),

    createDrawings: builder.mutation<void, any>({
      query: (payload) => ({
        url: "/drawings",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Drawings", id: "LIST" }],
    }),

    updateDrawings: builder.mutation<void, { id: string; payload: any }>({
      query: ({ id, payload }) => ({
        url: `/drawings/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Drawings", id },
        { type: "Drawings", id: "LIST" },
      ],
    }),

    updateDrawingsStatus: builder.mutation<
      void,
      { id: string; payload: { action: string } }
    >({
      query: ({ id, payload }) => ({
        url: `/drawings/${id}/decision`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Drawings", id },
        { type: "Drawings", id: "LIST" },
      ],
    }),

    deleteDrawings: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: "/drawings",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Drawings", id: "LIST" }],
    }),

    uploadDrawings: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/drawings/upload-multiple",
        method: "POST",
        body: formData,
      }),
    }),

    deleteDrawingsFile: builder.mutation<void, string>({
      query: (fileId) => ({
        url: `/drawings/file-delete/${fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Drawings", id: "LIST" }],
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
