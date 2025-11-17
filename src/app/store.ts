import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/api/authApi";
import authReducer from "../features/auth/slices/authSlice";
import { companySettingsApi } from "../features/companySettings/api/companySettingsApi";
import { userApi } from "../features/user/api/userApi";
import { projectsApi } from "../features/projectControll/projectsApi";


export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [companySettingsApi.reducerPath]: companySettingsApi.reducer,
     [projectsApi.reducerPath]: projectsApi.reducer,
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      companySettingsApi.middleware,
      userApi.middleware,
      projectsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
