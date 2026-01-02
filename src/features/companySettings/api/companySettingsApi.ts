import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../../baseQueryWithInterceptor";

export const companySettingsApi = createApi({
  reducerPath: "companySettingsApi",
  baseQuery: baseQueryWithInterceptor,

  tagTypes: ["CompanySettings"],

  endpoints: (builder) => ({
    // ✅ 1. GET company settings
    getCompanySettings: builder.query({
      query: () => "/company-settings",
      providesTags: ["CompanySettings"],
    }),

    // ✅ 2. PUT — Update company info (form-data)
    updateCompanySettings: builder.mutation({
      query: (formData) => ({
        url: "/company-settings",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["CompanySettings"],
    }),

    // ✅ 3. PUT — Update notification preferences (JSON)
    updateNotificationSettings: builder.mutation({
      query: (data) => ({
        url: "/company-settings/notification",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CompanySettings"],
    }),
  }),
});

export const {
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useUpdateNotificationSettingsMutation,
} = companySettingsApi;
