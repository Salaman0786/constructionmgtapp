import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl } from "../../../config";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",

  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Dashboard"],

  endpoints: (builder) => ({
    /* ------------------------------------
       GET DASHBOARD DATA
       GET /dashboard
    ------------------------------------- */
    getDashboard: builder.query({
      query: () => `/dashboard`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
