import { appConfig } from "@/appConfig";
import { AuthService } from "@/services/auth.service";
import axios, { AxiosError, CanceledError } from "axios";
import { toast } from "sonner";

export const axiosIns2 = axios.create({
  baseURL: appConfig.URL_API_FACTURACION,
  timeout: 100000,
});

// Interceptor de solicitudes
axiosIns2.interceptors.request.use(
  (config) => {
    const token = AuthService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
axiosIns2.interceptors.response.use(
  (response) => {
    // Puedes manipular los datos de la respuesta si es necesario
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      // Manejo específico de códigos de estado
      switch (status) {
        case 401:
          console.warn("Unauthorized: Redireccionando al login...");
          localStorage.removeItem("AuthState");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Forbidden: No tienes permisos para esta acción.");
          break;
        case 500:
          console.error("Server error: Algo salió mal en el servidor.");
          break;
        default:
          console.error(
            `Error ${error.response.status}: ${error.response.statusText}`
          );
      }
      return Promise.reject(
        data || error.response.data || "An unexpected error occurred"
      );
    }
    // Manejo de errores sin respuesta del servidor
    // console.error("Network error:", error.message);
    return Promise.reject(error);
  }
);

const axiosIns = axios.create({
  baseURL: appConfig.URL_API,
  timeout: 60000,
});

// Interceptor de solicitudes
axiosIns.interceptors.request.use(
  (config) => {
    const token = AuthService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
axiosIns.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof CanceledError) {
      return Promise.reject(error);
    } else if (error instanceof AxiosError) {
      const customError = {
        message: error.response?.data?.message || "Ha ocurrido un error",
        status: error.response?.statusText,
        code: error.response?.status,
      };

      toast.error(customError.message);
      return Promise.reject(customError);
    }
  }
);

export default axiosIns;
