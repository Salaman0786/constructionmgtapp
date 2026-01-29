import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../../baseQueryWithInterceptor";

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  isActive: boolean;
  role?: Role;
  createdAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersResponse {
  data: {
    users: User[];
  };
  pagination: Pagination;
}

export interface UserResponse {
  data: {
    data: User;
  };
}

export interface UsersDashboardResponse {
  data: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  };
}

export interface CreateUserPayload {
  userName: string;
  email: string;
  fullName: string;
  roleId: string;
  password?: string;
}

export interface UpdateUserPayload {
  userName?: string;
  email?: string;
  fullName?: string;
  roleId?: string;
  password?: string;
}

export interface UpdateUserStatusPayload {
  id: string;
  isActive: boolean;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["Users", "UsersDashboard"],
  endpoints: (builder) => ({
    getUsers: builder.query<
      UsersResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        role?: string;
      }
    >({
      query: ({ page = 1, limit = 10, search = "", status = "", role = "" }) =>
        `/users?page=${page}&limit=${limit}&search=${search}&status=${status}&role=${role}`,
      providesTags: (result) =>
        result?.data?.users
          ? [
              ...result.data.users.map((u) => ({
                type: "Users" as const,
                id: u.id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    getUsersDashboard: builder.query<UsersDashboardResponse, void>({
      query: () => "/users/dashboard",
      providesTags: ["UsersDashboard"],
    }),

    addUser: builder.mutation<void, CreateUserPayload>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }, "UsersDashboard"],
    }),

    deleteUser: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: "/users",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }, "UsersDashboard"],
    }),

    updateUserStatus: builder.mutation<void, UpdateUserStatusPayload>({
      query: ({ id, isActive }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
        "UsersDashboard",
      ],
    }),

    getRoles: builder.query<{ data: { roles: Role[] } }, void>({
      query: () => "/users/roles",
    }),

    getUserById: builder.query<UserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    updateUser: builder.mutation<void, { id: string; body: UpdateUserPayload }>(
      {
        query: ({ id, body }) => ({
          url: `/users/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Users", id },
          { type: "Users", id: "LIST" },
          "UsersDashboard",
        ],
      },
    ),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useGetRolesQuery,
  useGetUsersDashboardQuery,
} = userApi;
