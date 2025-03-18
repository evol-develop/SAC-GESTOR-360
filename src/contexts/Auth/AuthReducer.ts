import { AuthState, authUser } from "@/contexts/Auth/types";

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "AUTH_LOADING" }
  | { type: "LOGIN"; payload: { user: authUser; is2FAEnabled?: boolean } }
  | { type: "LOGOUT" }
  | {
      type: "INITIALIZE";
      payload: {
        isAuthenticated: boolean;
        user?: authUser;
        is2FAEnabled?: boolean;
      };
    }
  | { type: "UPDATE_USER"; payload: { user: authUser; is2FAEnabled?: boolean } }
  | { type: "ERROR" | "LOGIN_ERROR"; payload: { error: string } };

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
    case "AUTH_LOADING":
      return {
        ...state,
        isLoading: true,
        error: undefined,
      };

    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        is2FAEnabled: action.payload.is2FAEnabled || false,
        error: undefined,
      };

    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: undefined,
        is2FAEnabled: false,
        error: undefined,
      };

    case "INITIALIZE":
      return {
        ...state,
        ...action.payload,
        isInitialized: true,
        is2FAEnabled: action.payload.is2FAEnabled || false,
        error: undefined,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload.user,
        is2FAEnabled: action.payload.is2FAEnabled || state.is2FAEnabled,
        error: undefined,
      };

    case "ERROR":
    case "LOGIN_ERROR":
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};
