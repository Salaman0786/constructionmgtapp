import { authApi } from "../features/auth/api/authApi";
import { companySettingsApi } from "../features/companySettings/api/companySettingsApi";
import { userApi } from "../features/user/api/userApi";
import { projectsApi } from "../features/projectControll/projectsApi";
import { siteDiaryApi } from "../features/siteDiary/api/siteDiaryApi";
import { roleApi } from "../features/role/api/roleApi";
import { drawingsApi } from "../features/drawings&controls/api/drawingsApi";
import { taskApi } from "../features/taskAssignment/api/taskAssignmentApi";
import { dashboardApi } from "../features/dashboard/api/dashboardApi";
import { submittalsApi } from "../features/submittals/api/submittalApi";
import { userTaskApi } from "../features/userTaskAssignment/api/userTaskAssignmentApi";

export const resetAllApis = (dispatch: any) => {
  dispatch(authApi.util.resetApiState());
  dispatch(companySettingsApi.util.resetApiState());
  dispatch(userApi.util.resetApiState());
  dispatch(projectsApi.util.resetApiState());
  dispatch(siteDiaryApi.util.resetApiState());
  dispatch(roleApi.util.resetApiState());
  dispatch(drawingsApi.util.resetApiState());
  dispatch(taskApi.util.resetApiState());
  dispatch(dashboardApi.util.resetApiState());
  dispatch(submittalsApi.util.resetApiState());
  dispatch(userTaskApi.util.resetApiState());
};
