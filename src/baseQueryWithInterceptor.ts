import {
  fetchBaseQuery,
  FetchBaseQueryError,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";

import { API_BASE_URL } from "./config/env";
import { logout } from "./features/auth/slices/authSlice";
import type { RootState } from "./app/store";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithInterceptor: BaseQueryFn<
  string | { url: string; method?: string; body?: unknown },
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status } = result.error;
    if (status === 401) {
      api.dispatch(logout());
    }
  }

  return result;
};
