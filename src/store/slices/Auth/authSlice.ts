import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "src/interfaces/userInterface";

export type authAction =
  | { type: "LOGIN"; payload: { user: UserInterface } }
  | { type: "LOGIN_ERROR"; payload: { error: string } }
  | { type: "LOGOUT" }
  | {
      type: "INITIALIZE";
      payload: { isAuthenticated: boolean; user: UserInterface };
    };
// | { type: 'REGISTER' payload: { user: UserInterface } }

export interface AuthState {
  isAuthenticated?: boolean;
  isInitialized?: boolean;
  user?: UserInterface;
  error?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: undefined,
  error: undefined,
};

//slice auth

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LOGIN: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    LOGOUT: (state) => {
      state.isAuthenticated = false;
      state.user = undefined;
    },
    LOGIN_ERROR: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = false;
      state.error = action.payload.error;
    },
    INITIALIZE: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isInitialized = true;
      state.user = action.payload.user;
    },
  },
});

export const { LOGIN, LOGOUT, LOGIN_ERROR, INITIALIZE } = authSlice.actions;

// export default authSlice.reducer;
