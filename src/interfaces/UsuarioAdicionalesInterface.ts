import { EvolRolInterface } from "./userInterface";

export interface UsuarioAdicionalesInterface {
    id?: string,
    idUsuario: string,
    idEmpresa: string,
    nombre: string,
    apellido: string,
    telefono: string,
    activo: boolean,
    email:string,
    photoURL:string,
    coverPhotoURL:string,
    photoNameFile?:string,
    coverPhotoNameFile?:string
    password?:string,
    confirmPassword?: string
    //userRol: RolestType,
    userRol: EvolRolInterface | undefined,
    vendedor: boolean,
}