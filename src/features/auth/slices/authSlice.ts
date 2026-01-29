import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  user: User | null;
  userEmail: string | null;
  role: string | null;
}

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const getUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? (JSON.parse(user) as User) : null;
};

const getRole = (): string | null => {
  return localStorage.getItem("role");
};

const initialState: AuthState = {
  token: getToken(),
  user: getUser(),
  userEmail: null,
  role: getRole(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* LOGIN / SET AUTH DATA */
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) => {
      const { token, user } = action.payload;

      state.token = token;
      state.user = user;
      state.role = user.role.name;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role.name);
    },

    /* STORE EMAIL (FOR OTP / RESET FLOW) */
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.userEmail = action.payload;
    },

    /* UPDATE TOKEN ONLY (REFRESH TOKEN CASE) */
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },

    /* UPDATE ROLE ONLY */
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },

    /* LOGOUT */
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.userEmail = null;
      state.role = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
  },
});

export const { setCredentials, logout, setUserEmail, setUserToken, setRole } =
  authSlice.actions;

export default authSlice.reducer;
