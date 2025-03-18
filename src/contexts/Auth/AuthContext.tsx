import { toast } from "sonner";
import { useNavigate } from "react-router";
import { createContext, useEffect, useReducer, useCallback } from "react";

import { usePage } from "@/hooks/usePage";
import { authReducer } from "./AuthReducer";
import { AuthService } from "@/services/auth.service";
import { AuthContextInterface, AuthState } from "./types";
import { createSlotPermisos } from "@/store/slices/Permisos";
import { setInfoEmpresa } from "@/store/slices/Empresa";

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  user: undefined,
  error: undefined,
  is2FAEnabled: false,
};

const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);
  const navigate = useNavigate();
  const { dispatch: dispatchPermisos, dispatch: dispatchEmpresa } = usePage();

  // Manejador de cierre de sesión por inactividad
  const handleInactivityLogout = useCallback(async () => {
    try {
      await AuthService.logout();
      dispatch({ type: "LOGOUT" });
      toast.warning("Sesión cerrada por inactividad");
      navigate("/login");
    } catch (error) {
      console.error("Error en logout por inactividad:", error);
    }
  }, [navigate]);

  const initializeAuth = useCallback(async () => {
    try {
      const { user, permisos } = await AuthService.validateSession();

      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: true,
          user,
          is2FAEnabled: user.is2FAEnabled || false,
        },
      });

      dispatchPermisos(createSlotPermisos({ PERMISOS: permisos }));
      dispatchEmpresa(setInfoEmpresa(user.empresa));

      // Iniciar temporizador de inactividad
      AuthService.startInactivityTimer(handleInactivityLogout);
    } catch (error) {
      if (error instanceof Error && error.message === "No hay sesión activa") {
        console.warn(error.message);
      } else {
        console.error(error);
      }
      dispatch({
        type: "INITIALIZE",
        payload: { isAuthenticated: false, user: undefined },
      });
    }
  }, [dispatchPermisos, dispatchEmpresa, handleInactivityLogout]);

  useEffect(() => {
    // Configurar interceptor para renovar tokens automáticamente
    AuthService.setupTokenRefreshInterceptor();

    initializeAuth();

    // Limpiar temporizador al desmontar
    return () => {
      AuthService.stopInactivityTimer();
    };
  }, [initializeAuth]);

  const login = async (userName: string, password: string) => {
    try {
      dispatch({ type: "LOGIN_START" });

      const { user, permisos } = await AuthService.login(userName, password);

      dispatch({
        type: "LOGIN",
        payload: {
          user,
          is2FAEnabled: user.is2FAEnabled || false,
        },
      });

      dispatchPermisos(createSlotPermisos({ PERMISOS: permisos }));
      dispatchEmpresa(setInfoEmpresa(user.empresa));

      // Iniciar temporizador de inactividad
      AuthService.startInactivityTimer(handleInactivityLogout);

      if (user && permisos && user.empresa) {
        navigate("/site");
      } else {
        throw new Error("No se pudieron cargar todos los datos necesarios");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al iniciar sesión";

      dispatch({
        type: "LOGIN_ERROR",
        payload: { error: errorMessage },
      });

      // Mostrar mensaje de error
      toast.error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      // Limpiar redux
      await AuthService.logout();
      dispatchPermisos(createSlotPermisos({ PERMISOS: [] }));
      dispatchEmpresa(setInfoEmpresa({}));
      dispatch({ type: "LOGOUT" });
      navigate("/");
    } catch (error) {
      console.error("Error en logout:", error);
      dispatch({
        type: "ERROR",
        payload: { error: "Error al cerrar sesión" },
      });
      toast.error("Error al cerrar sesión");
    }
  };

  // Configurar autenticación de dos factores
  const setup2FA = async (phoneNumber: string) => {
    try {
      dispatch({ type: "AUTH_LOADING" });
      const verificationId = await AuthService.setup2FA(phoneNumber);
      return verificationId;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al configurar autenticación de dos factores";

      dispatch({
        type: "ERROR",
        payload: { error: errorMessage },
      });

      toast.error(errorMessage);
      throw error;
    }
  };

  // Completar configuración de 2FA
  const complete2FASetup = async (
    verificationId: string,
    verificationCode: string
  ) => {
    try {
      dispatch({ type: "AUTH_LOADING" });
      const success = await AuthService.complete2FASetup(
        verificationId,
        verificationCode
      );

      if (success && authState.user) {
        const updatedUser = { ...authState.user, is2FAEnabled: true };
        AuthService.setUser(updatedUser);

        dispatch({
          type: "UPDATE_USER",
          payload: { user: updatedUser, is2FAEnabled: true },
        });

        toast.success(
          "Autenticación de dos factores configurada correctamente"
        );
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al completar la configuración de autenticación de dos factores";

      dispatch({
        type: "ERROR",
        payload: { error: errorMessage },
      });

      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        idEmpresa: authState.user?.empresa.id,
        authState,
        login,
        logout,
        setup2FA,
        complete2FASetup,
        is2FAEnabled: authState.is2FAEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
