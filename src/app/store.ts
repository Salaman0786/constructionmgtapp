import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/api/authApi";
import authReducer from "../features/auth/slices/authSlice";
import { companySettingsApi } from "../features/companySettings/api/companySettingsApi";
import { userApi } from "../features/user/api/userApi";
import { projectsApi } from "../features/projectControll/projectsApi";
import { siteDiaryApi } from "../features/siteDiary/api/siteDiaryApi";

import { roleApi } from "../features/role/api/roleApi";
import { drawingsApi } from "../features/drawings&controls/api/drawingsApi";

import { taskApi } from "../features/taskAssignment/api/taskAssignmentApi";
import { dashboardApi } from "../features/dashboard/api/dashboardApi";
import { submittalsApi } from "../features/submittals/api/submittalApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [companySettingsApi.reducerPath]: companySettingsApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [siteDiaryApi.reducerPath]: siteDiaryApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [drawingsApi.reducerPath]: drawingsApi.reducer,
    [submittalsApi.reducerPath]: submittalsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      companySettingsApi.middleware,
      userApi.middleware,
      roleApi.middleware,
      projectsApi.middleware,
      siteDiaryApi.middleware,
      drawingsApi.middleware,
      submittalsApi.middleware,
      taskApi.middleware,
      dashboardApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
