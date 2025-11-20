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
        `/roles?page=${page}&limit=${limit}`,
      providesTags: ["Roles"],
    }),

    // ✅ POST API — add a new user
    addDrawings: builder.mutation({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
    }),

    // ✅ PUT API — update user

    // ✅ DELETE API — delete user
    deleteDrawings: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
    }),

    getDrawingsById: builder.query<any, string>({
      query: (id) => `/roles/${id}`,
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
  useGetDrawingsByIdQuery,
  useAddDrawingsMutation,
  useUpdateDrawingsMutation,
  useDeleteDrawingsMutation,
} = drawingsApi;
