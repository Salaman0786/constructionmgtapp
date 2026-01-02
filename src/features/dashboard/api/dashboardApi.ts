import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../../baseQueryWithInterceptor";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",

  baseQuery: baseQueryWithInterceptor,

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
