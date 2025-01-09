import { AuthState } from "@/contexts/Auth/AuthContext";
import { UserInterface } from "@/interfaces/userInterface";

export type AuthAction =
  | { type: "LOGIN"; payload: { user: UserInterface } }
  | { type: "LOGIN_ERROR"; payload: { error: string } }
  | { type: "LOGOUT" }
  | {
      type: "INITIALIZE";
      payload: { isAuthenticated: boolean; user: UserInterface | undefined };
    }
  | { type: "ERROR"; payload: { error: string } };

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        error: undefined,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: undefined,
        error: undefined,
      };
    case "LOGIN_ERROR":
    case "ERROR": // Consolida el manejo de errores
      return {
        ...state,
        isAuthenticated: false,
        error: action.payload.error,
      };
    case "INITIALIZE": {
      const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isAuthenticated,
        isInitialized: true,
        user,
        error: undefined,
      };
    }
    default:
      return state;
  }
};
