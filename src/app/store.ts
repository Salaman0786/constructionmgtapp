import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/api/authApi";
import authReducer from "../features/auth/slices/authSlice";
import { userApi } from "../features/user/api/userApi";

import { roleApi } from "../features/role/api/roleApi";
import { drawingsApi } from "../features/drawings&controls/api/drawingsApi";

import { notificationsApi } from "../features/notifications/api/notificationsApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,

    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [drawingsApi.reducerPath]: drawingsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      roleApi.middleware,
      drawingsApi.middleware,
      notificationsApi.middleware,
    ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
