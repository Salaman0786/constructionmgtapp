import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/env";

/* ================= TYPES ================= */

export type AuditChange = {
  field: string;
  from: string | number | null;
  to: string | number | null;
};

export type AuditLog = {
  id: string;
  actorRole: string;
  actionType:
    | "LOGIN"
    | "LOGOUT"
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "STATUS_CHANGE"
    | "ASSIGN"
    | "UNASSIGN";
  entityType: string;
  entityName?: string;
  title: string | null;
  description: string;
  changes?: AuditChange[];
  createdAt: string;
  user: {
    fullName: string;
    email: string;
    role: {
      name: string;
    };
  };
};

/* ================= API ================= */

export const auditLogApi = createApi({
  reducerPath: "auditLogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAuditLogs: builder.query<
      { logs: AuditLog[]; pagination: any },
      {
        page: number;
        limit: number;
        actionType?: string;
        entityType?: string;
      }
    >({
      query: ({ page, limit, actionType, entityType }) => ({
        url: "/audit-logs",
        params: {
          page,
          limit,
          ...(actionType && { actionType }),
          ...(entityType && { entityType }),
        },
      }),
      transformResponse: (response: any) => ({
        logs: response?.data?.logs ?? [],
        pagination: response?.pagination ?? {},
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditLogApi;
