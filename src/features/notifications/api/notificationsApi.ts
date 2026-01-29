import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../../baseQueryWithInterceptor";

export type NotificationEntityType =
  | "DRAWING_REVISION"
  | "SUBMITTAL"
  | "GENERAL";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  entityType: NotificationEntityType;
  createdAt: string;
}

export interface NotificationRecipient {
  recipientId: string;
  isRead: boolean;
  notification: Notification;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface NotificationsResponse {
  data: {
    notifications: NotificationRecipient[];
  };
  pagination: Pagination;
}

export interface NotificationCountResponse {
  data: {
    unread: number;
  };
}

export interface MarkReadPayload {
  recipientId: string;
}

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["Notifications", "NotificationCount"],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationsResponse,
      {
        page?: number;
        limit?: number;
        type?: "read" | "unread" | "";
      }
    >({
      query: ({ page = 1, limit = 10, type = "" }) =>
        `/notifications/me?page=${page}&limit=${limit}&type=${type}`,
      providesTags: ["Notifications"],
    }),

    getNotificationCount: builder.query<NotificationCountResponse, void>({
      query: () => "/notifications/me/unread-count",
      providesTags: ["NotificationCount"],
    }),

    notificationsMarkRead: builder.mutation<void, MarkReadPayload>({
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
