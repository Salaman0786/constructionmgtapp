import { authApi } from "../features/auth/api/authApi";
import { userApi } from "../features/user/api/userApi";
import { roleApi } from "../features/role/api/roleApi";
import { drawingsApi } from "../features/drawings&controls/api/drawingsApi";
export const resetAllApis = (dispatch: any) => {
  dispatch(authApi.util.resetApiState());
  dispatch(userApi.util.resetApiState());
  dispatch(roleApi.util.resetApiState());
  dispatch(drawingsApi.util.resetApiState());
};
