import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../../config/env";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, limit = 10, type = "" }) =>
        `/notifications/me?page=${page}&limit=${limit}&type=${type}`,
      providesTags: ["Notifications"],
    }),
    getNotificationCount: builder.query({
      query: () => "/notifications/me/unread-count",
      providesTags: ["NotificationCount"],
    }),
    // ✅ POST API — add a new user
    notificationsMarkRead: builder.mutation({
      query: (body) => ({
        url: "/notifications/me/mark-read",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationCountQuery,
  useGetNotificationsQuery,
  useNotificationsMarkReadMutation,
} = notificationsApi;
