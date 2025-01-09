import { EmpresaInterface } from "./empresaInterface";

export interface UserInterface {
  username: string;
  nombre: string;
  avatar: string;
  email: string;
  role: string;
  accessToken: string;
  permisos: Permisos;
  expiration: string;
  empresa: EmpresaInterface;
}

export interface UsersInterface {
  activo: boolean;
  apellido: string;
  avatar: string | null;
  email: string;
  empresa: EmpresaInterface | null;
  fullName: string;
  id: string;
  nombre: string;
  telefono: string;
  userRoll: string;
  vendedor?: boolean;
}

export interface Permisos {
  id: number;
  catalogos: boolean;
  modifica: boolean;
  elimina: boolean;
}

export type RolestType = "SUPER-ADMIN" | "ADMINISTRADOR" | "USUARIO";

export interface EvolRolInterface {
  id: number;
  nombre: string;
  empresa: EmpresaInterface;
  empresaId: number;
  isActive: boolean;
}
