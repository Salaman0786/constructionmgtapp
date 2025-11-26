import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://construction-api-stg.addisababadbohra.com/api",
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Users", "Roles", "UsersDashboard"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "", role = "" }) =>
        `/users?page=${page}&limit=${limit}&search=${search}&status=${status}&role=${role}`,
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
      invalidatesTags: ["UsersDashboard", "Users"],
    }),
    getRoles: builder.query({
      query: () => `/users/roles`,
    }),
    getUserById: builder.query<any, string>({
      query: (id) => `/users/${id}`,
    }),

    // ⭐ Update user (PUT or PATCH)
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT", // or PATCH
        body,
      }),
      invalidatesTags: ["Users", "User"],
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
