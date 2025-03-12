import { Permisos } from "./userInterface";

export interface ResponseInterface {
  isSuccess: boolean;
  message: string;
  code: number;
  result?: any;
}

export interface Result {
  accessToken: string;
  user: User;
  expiration: string;
  by: string;
}

// user response
export interface User {
  userName: string;
  fullName: string;
  userRol: string;
  avatar: string;
  permisos: Permisos;
}

// recupera info de usuario
export interface userResult {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  fullName: string;
  userRoll: string;
  avatar: string;
  permisos: Permisos;
  expiration: string;
  activo: boolean;
  departamento: any
}
