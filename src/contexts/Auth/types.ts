import { EmpresaInterface } from "@/interfaces/empresaInterface";

export type authUser = {
  accessToken: string;
  activo: boolean;
  apellido: string;
  avatar: string | null;
  email: string;
  empresa: EmpresaInterface;
  fullName: string;
  id: string;
  nombre: string;
  role: string;
  telefono: string | null;
  userRoll: string;
  userName: string;
  is2FAEnabled?: boolean;
};

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user?: authUser;
  error?: string;
  is2FAEnabled: boolean;
}

export interface AuthContextInterface {
  user: authUser | undefined;
  idEmpresa: number | undefined;
  authState: AuthState;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setup2FA: (phoneNumber: string) => Promise<string>;
  complete2FASetup: (
    verificationId: string,
    verificationCode: string
  ) => Promise<boolean>;
  is2FAEnabled: boolean;
}

export interface Permisos {
  id: number;
  nombre: string;
  acceso: boolean;
  ruta: string;
}
