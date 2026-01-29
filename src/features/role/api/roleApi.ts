import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../../baseQueryWithInterceptor";

export interface Permission {
  id: string;
  name: string;
  code: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
  usersCount?: number;
  createdAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RolesResponse {
  data: {
    roles: Role[];
  };
  pagination: Pagination;
}

export interface RoleResponse {
  data: Role;
}

export interface RolesDashboardResponse {
  data: {
    totalRoles: number;
    systemRoles: number;
    customRoles: number;
  };
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissions?: string[];
}

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["Roles", "Role"],
  endpoints: (builder) => ({
    getRoles: builder.query<RolesResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/roles?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.data?.roles
          ? [
              ...result.data.roles.map((r) => ({
                type: "Role" as const,
                id: r.id,
              })),
              { type: "Roles", id: "LIST" },
            ]
          : [{ type: "Roles", id: "LIST" }],
    }),

    getRolesDashboard: builder.query<RolesDashboardResponse, void>({
      query: () => "/roles/dashboard",
    }),

    getRoleById: builder.query<RoleResponse, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),

    addRole: builder.mutation<void, CreateRolePayload>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),

    updateRole: builder.mutation<
      void,
      { id: string; payload: UpdateRolePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Role", id },
        { type: "Roles", id: "LIST" },
      ],
    }),

    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolesDashboardQuery,
} = roleApi;
