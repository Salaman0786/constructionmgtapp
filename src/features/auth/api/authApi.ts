import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptor } from "../../../baseQueryWithInterceptor";

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: {
      id: string;
      name: string;
    };
  };
}

// Forgot password
export interface ForgotPasswordRequest {
  email: string;
}

export interface GenericResponse {
  message: string;
}

// Verify OTP
export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

// Reset password
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
}

// Current user
export interface CurrentUserResponse {
  id: string;
  fullName: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    forgotPassword: builder.mutation<GenericResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyOTP: builder.mutation<GenericResponse, VerifyOTPRequest>({
      query: (credentials) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: credentials,
      }),
    }),

    resetPassword: builder.mutation<GenericResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => "/auth/me",
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
} = authApi;
