import {
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "./config/env";
import { logout } from "./features/auth/slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithInterceptor = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);

  // 🔴 Response Interceptor
  if (result.error) {
    const error = result.error as FetchBaseQueryError;

    if (error.status === 401) {
      api.dispatch(logout());
    }
  }

  return result;
};
