import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../../baseQueryWithInterceptor";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithInterceptor,
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
      invalidatesTags: ["NotificationCount", "Notifications"],
    }),
  }),
});

export const {
  useGetNotificationCountQuery,
  useGetNotificationsQuery,
  useNotificationsMarkReadMutation,
} = notificationsApi;
