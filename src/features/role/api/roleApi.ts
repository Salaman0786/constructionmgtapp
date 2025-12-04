import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl } from "../../../config";

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Roles"],
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/roles?page=${page}&limit=${limit}`,
      providesTags: ["Roles"],
    }),

    getRolesDashboard: builder.query({
      query: () => "/roles/dashboard",
    }),
    // ✅ POST API — add a new user
    addRole: builder.mutation({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
    }),

    // ✅ PUT API — update user

    // ✅ DELETE API — delete user
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
    }),

    getRoleById: builder.query<any, string>({
      query: (id) => `/roles/${id}`,
    }),

    // ⭐ Update user (PUT or PATCH)
    updateRole: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/roles/${id}`,
        method: "PUT", // or PATCH
        body: payload,
      }),
      invalidatesTags: ["Roles", "Role"],
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
