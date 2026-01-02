import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../../config/env";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("ngrok-skip-browser-warning", "1");
      return headers;
    },
  }),
  tagTypes: ["Users", "Roles", "UsersDashboard"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "", role = "" }) =>
        `/users?page=${page}&limit=${limit}&search=${search}&status=${status}&role=${role}`,
      providesTags: (result) =>
        result?.data?.users
          ? [
              ...result.data.users.map((user) => ({
                type: "Users",
                id: user.id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    getUsersDashboard: builder.query({
      query: () => "/users/dashboard",
      providesTags: ["UsersDashboard"],
    }),
    // ✅ POST API — add a new user
    addUser: builder.mutation({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UsersDashboard", "Users"],
    }),

    // ✅ PUT API — update user

    // ✅ DELETE API — delete user
    deleteUser: builder.mutation({
      query: (ids: string[]) => ({
        url: "/users",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["UsersDashboard", "Users"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, isActive }: { id: string; isActive: boolean }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id }, // Refresh this user
        { type: "Users", id: "LIST" }, // Refresh list
        "UsersDashboard",
      ],
    }),
    getRoles: builder.query({
      query: () => `/users/roles`,
    }),
    getUserById: builder.query<any, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // ⭐ Update user (PUT or PATCH)
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT", // or PATCH
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id }, // refresh getUserById data
        "UsersDashboard",
      ],
    }),
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
