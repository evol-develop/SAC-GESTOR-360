import {
  signOut,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import axiosService from "axios";
import { firebaseAuth } from "@/firebase/firebase-config";

import axios from "@/lib/utils/axios";
import { signIn } from "@/api/authApi";
import { authUser, Permisos } from "@/contexts/Auth/types";
import { ResponseInterface } from "@/interfaces/responseInterface";

export class AuthService {
  private static ACCESS_TOKEN_KEY = "AuthToken";
  private static REFRESH_TOKEN_KEY = "RefreshToken";
  private static USER_KEY = "AuthState";
  private static INACTIVITY_TIMER_KEY = "InactivityTimer";
  private static INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
  private static _refreshInterceptorId: number = -1;

  // Método para establecer el token de acceso
  static setAuthToken(token: string) {
    // En lugar de localStorage, idealmente usar cookies HttpOnly desde el backend
    // Por ahora, seguimos usando localStorage pero con una estructura mejorada
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  // Método para obtener el token de acceso
  static getAuthToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Método para establecer el token de refresco
  static setRefreshToken(token: string) {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  // Método para obtener el token de refresco
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Método para eliminar los tokens
  static removeTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    delete axios.defaults.headers.common.Authorization;
  }

  // Método para establecer el usuario
  static setUser(user: authUser) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Método para obtener el usuario
  static getUser(): authUser | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Método para eliminar el usuario
  static removeUser() {
    localStorage.removeItem(this.USER_KEY);
  }

  // Método para refrescar el token
  static async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.removeTokens();
      this.removeUser();
      return null;
    }

    try {
      const response = await axios.post<ResponseInterface>(
        "/api/account/refresh-token",
        {
          refreshToken,
        }
      );

      if (!response.data?.isSuccess) {
        throw new Error(
          response.data?.message || "Error al refrescar el token"
        );
      }

      const { accessToken, refreshToken: newRefreshToken } =
        response.data.result;

      this.setAuthToken(accessToken);
      this.setRefreshToken(newRefreshToken);

      return accessToken;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  // Configurar interceptor para renovar tokens automáticamente
  static setupTokenRefreshInterceptor() {
    // Remover interceptores existentes para evitar duplicados
    if (this._refreshInterceptorId !== -1) {
      axios.interceptors.response.eject(this._refreshInterceptorId);
    }

    // Agregar interceptor para renovar tokens
    this._refreshInterceptorId = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 (Unauthorized) y no hemos intentado renovar el token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Intentar renovar el token
            const newToken = await this.refreshToken();

            if (newToken) {
              // Actualizar el token en la solicitud original y reintentarla
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error("Error al renovar el token:", refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Método para iniciar el temporizador de inactividad
  static startInactivityTimer(callback: () => void) {
    this.resetInactivityTimer(callback);

    // Configurar listeners para resetear el temporizador en actividad del usuario
    const resetEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    resetEvents.forEach((event) => {
      document.addEventListener(event, () =>
        this.resetInactivityTimer(callback)
      );
    });
  }

  // Método para resetear el temporizador de inactividad
  static resetInactivityTimer(callback: () => void) {
    const existingTimer = localStorage.getItem(this.INACTIVITY_TIMER_KEY);
    if (existingTimer) {
      window.clearTimeout(parseInt(existingTimer));
    }

    const timerId = window.setTimeout(() => {
      callback();
      localStorage.removeItem(this.INACTIVITY_TIMER_KEY);
    }, this.INACTIVITY_TIMEOUT);

    localStorage.setItem(this.INACTIVITY_TIMER_KEY, timerId.toString());
  }

  // Método para detener el temporizador de inactividad
  static stopInactivityTimer() {
    const existingTimer = localStorage.getItem(this.INACTIVITY_TIMER_KEY);
    if (existingTimer) {
      window.clearTimeout(parseInt(existingTimer));
      localStorage.removeItem(this.INACTIVITY_TIMER_KEY);
    }
  }

  // Método para iniciar sesión
  static async login(userName: string, password: string) {
    try {
      // Iniciar sesión con Firebase
      await signIn(userName);

      // Verificar si 2FA está habilitado
      const is2FAEnabled = await this.check2FAStatus();

      // Obtener información del usuario
      const response = await axios.post<ResponseInterface>(
        "/api/account/login",
        {
          userName,
          password,
        }
      );

      if (!response.data?.isSuccess) {
        throw new Error(response.data?.message || "Error al iniciar sesión");
      }

      const { accessToken, user } = response.data.result;

      // Actualizar el usuario con el estado de 2FA
      const updatedUser: authUser = {
        ...user,
        accessToken,
        is2FAEnabled,
      };

      // Guardar tokens y usuario
      this.setAuthToken(accessToken);
      this.setRefreshToken(accessToken);
      this.setUser(updatedUser);

      // Obtener permisos del usuario
      const permisos = await this.getUserPermissions(userName);

      return { user: updatedUser, permisos };
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }

  // Método para cerrar sesión
  static async logout() {
    this.stopInactivityTimer();
    await signOut(firebaseAuth);
    this.removeTokens();
    this.removeUser();
  }

  // Método para obtener la configuración de la empresa
  static async getEmpresaConfig(idEmpresa: number) {
    const response = await axios.get<ResponseInterface>(
      `/api/EmpresaConfiguracion/GetData/${idEmpresa}`
    );
    return response.data.result;
  }

  // Método para obtener los permisos del usuario
  static async getUserPermissions(userName: string) {
    const response = await axios.get<ResponseInterface>(
      `/api/roles/getpermisosbyusuario/${userName}`
    );
    return response.data.result;
  }

  // Método para verificar si el token está expirado
  static isTokenExpired(token: string): boolean {
    if (!token) return true;

    try {
      // Decodificar el token (formato JWT)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const { exp } = JSON.parse(jsonPayload);

      // Verificar si el token ha expirado
      return exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return true; // Si hay error, consideramos que el token está expirado
    }
  }

  // Método para validar la sesión
  static async validateSession(): Promise<{
    user: authUser;
    permisos: Permisos[];
  }> {
    const token = this.getAuthToken();
    const user = this.getUser();

    if (!token || !user) {
      throw new Error("No hay sesión activa");
    }

    // Verificar si el token está expirado
    if (this.isTokenExpired(token)) {
      try {
        // Intentar renovar el token
        await this.refreshToken();
      } catch (refreshError) {
        this.removeTokens();
        this.removeUser();
        console.error("Error al renovar el token:", refreshError);
        throw new Error("La sesión ha expirado");
      }
    }

    try {
      const [userResponse, permisos] = await Promise.all([
        axios.get<ResponseInterface>(`/api/account/getuserbyemail`, {
          params: { email: user.userName },
        }),
        this.getUserPermissions(user.userName),
      ]);

      const updatedUser: authUser = {
        ...user,
        ...userResponse.data.result,
      };

      this.setUser(updatedUser);
      return {
        user: updatedUser,
        permisos,
      };
    } catch (error) {
      // Si hay un error de autorización, intentar refrescar el token
      if (axiosService.isAxiosError(error) && error.response?.status === 401) {
        try {
          await this.refreshToken();
          return this.validateSession(); // Reintentar con el nuevo token
        } catch (refreshError) {
          this.removeTokens();
          this.removeUser();
          throw refreshError;
        }
      }

      this.removeTokens();
      this.removeUser();
      throw error;
    }
  }

  // Método para configurar la autenticación de dos factores
  static async setup2FA(phoneNumber: string) {
    const user = firebaseAuth.currentUser;
    if (!user) {
      throw new Error("No hay usuario autenticado");
    }

    try {
      // Iniciar la configuración de multi-factor
      const multiFactorUser = multiFactor(user);

      // Enviar código de verificación al teléfono
      const phoneInfoOptions = {
        phoneNumber,
        session: await multiFactorUser.getSession(),
      };

      const phoneAuthProvider = new PhoneAuthProvider(firebaseAuth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions
        // Aquí se podría usar un recaptcha si es necesario
      );

      return verificationId;
    } catch (error) {
      console.error("Error al configurar 2FA:", error);
      throw new Error("No se pudo configurar la autenticación de dos factores");
    }
  }

  // Método para completar la configuración de 2FA
  static async complete2FASetup(
    verificationId: string,
    verificationCode: string
  ) {
    const user = firebaseAuth.currentUser;
    if (!user) {
      throw new Error("No hay usuario autenticado");
    }

    try {
      const multiFactorUser = multiFactor(user);

      // Crear credencial con el código de verificación
      const phoneAuthCredential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      // Crear la información del multi-factor
      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(phoneAuthCredential);

      // Enrollar el factor
      await multiFactorUser.enroll(multiFactorAssertion, "Teléfono móvil");

      return true;
    } catch (error) {
      console.error("Error al completar configuración 2FA:", error);
      throw new Error(
        "No se pudo completar la configuración de autenticación de dos factores"
      );
    }
  }

  // Método para verificar el estado de la autenticación de dos factores
  static async check2FAStatus(): Promise<boolean> {
    const user = firebaseAuth.currentUser;
    if (!user) {
      return false;
    }

    try {
      const multiFactorUser = multiFactor(user);
      const enrolledFactors = multiFactorUser.enrolledFactors;

      // Si hay factores registrados, 2FA está habilitado
      return enrolledFactors.length > 0;
    } catch (error) {
      console.error("Error al verificar estado de 2FA:", error);
      return false;
    }
  }
}
