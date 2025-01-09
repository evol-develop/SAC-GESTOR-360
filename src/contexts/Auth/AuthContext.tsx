import { useNavigate } from "react-router";
import { createContext, useEffect, useReducer } from "react";

import axios from "@/lib/utils/axios";
import { usePage } from "@/hooks/usePage";
import { authReducer } from "./AuthReducer";
import { setInfoEmpresa } from "@/store/slices/Empresa";
import { firebaseAuth } from "@/firebase/firebase-config";
import { UserInterface } from "@/interfaces/userInterface";
import { createSlotPermisos } from "@/store/slices/Permisos";
import { EmpresaInterface } from "@/interfaces/empresaInterface";
import { ResponseInterface } from "@/interfaces/responseInterface";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user?: UserInterface;
  error?: string;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
};

interface AuthContextInterface {
  user: UserInterface | undefined;
  idEmpresa: string | number;
  authState: AuthState;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);
  const navigate = useNavigate();
  const { dispatch: dispatchPermisos, dispatch: dispatchEmpresa } = usePage();

  const updateLocalStorage = (state: AuthState) => {
    localStorage.setItem("AuthState", JSON.stringify(state));
  };

  const initializeAuth = async () => {
    try {
      const savedState = JSON.parse(
        localStorage.getItem("AuthState") || "{}"
      ) as AuthState;

      if (!savedState?.user || !savedState?.isAuthenticated) {
        throw new Error("No hay usuario autenticado");
      }

      const { user } = savedState;
      const userResponse = await axios.get(`/api/account/getuserbyemail`, {
        params: { email: user.email },
      });

      const permisosResponse = await axios.get(
        `/api/roles/getpermisosbyusuario/${user.email}`
      );

      const updatedUser: UserInterface = {
        ...user,
        ...userResponse.data.result,
      };

      dispatch({
        type: "INITIALIZE",
        payload: { isAuthenticated: true, user: updatedUser },
      });

      dispatchPermisos(
        createSlotPermisos({ PERMISOS: permisosResponse.data.result })
      );
      dispatchEmpresa(setInfoEmpresa(updatedUser.empresa as EmpresaInterface));
      updateLocalStorage({
        isAuthenticated: true,
        user: updatedUser,
        isInitialized: true,
      });
    } catch {
      dispatch({
        type: "INITIALIZE",
        payload: { isAuthenticated: false, user: undefined },
      });
      localStorage.removeItem("AuthState");
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      const response = await axios.post<ResponseInterface>(
        "/api/account/login",
        { userName, password }
      );

      if (!response.data || !response.data.isSuccess) {
        throw new Error(response.data?.message || "Error desconocido");
      }

      const { user, accessToken } = response.data.result;

      if (!user || !accessToken) {
        throw new Error("Error al iniciar sesión");
      }

      await signInWithEmailAndPassword(firebaseAuth, userName, userName);

      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      const permisosResponse = await axios.get(
        `/api/roles/getpermisosbyusuario/${user.userName}`,
        {
          headers: { "Content-Type": "application/text" },
        }
      );

      const userAuthenticated: UserInterface = {
        username: user.userName,
        nombre: user.fullName,
        accessToken,
        email: user.userName,
        role: user.userRol,
        avatar: user.avatar || "",
        permisos: user.permisos,
        expiration: user.expiration,
        empresa: user.empresa,
      };

      dispatch({ type: "LOGIN", payload: { user: userAuthenticated } });
      updateLocalStorage({
        isAuthenticated: true,
        user: userAuthenticated,
        isInitialized: true,
      });

      dispatchPermisos(
        createSlotPermisos({ PERMISOS: permisosResponse.data.result })
      );
      dispatchEmpresa(
        setInfoEmpresa(userAuthenticated.empresa as EmpresaInterface)
      );

      navigate("/site");
    } catch (error) {
      console.error(error);
      dispatch({
        type: "LOGIN_ERROR",
        payload: { error: "Error al iniciar sesión" },
      });
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: "LOGOUT" });
      await signOut(firebaseAuth);
      localStorage.removeItem("AuthState");
      delete axios.defaults.headers.common.Authorization;
      navigate("/login");
    } catch (error) {
      console.error(error);
      dispatch({
        type: "ERROR",
        payload: { error: "Error al cerrar sesión" },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        idEmpresa: authState.user?.empresa?.id || "",
        authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
