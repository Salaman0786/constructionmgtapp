import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: any | null;
  userEmail: any | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  userEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: any }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
    },
    setUserEmail: (state, action: PayloadAction<{ userEmail: any }>) => {
      state.userEmail = action.payload.userEmail;
    },
    setUserToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout, setUserEmail, setUserToken } =
  authSlice.actions;
export default authSlice.reducer;
