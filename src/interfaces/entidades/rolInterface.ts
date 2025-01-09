import { EmpresaInterface } from "../empresaInterface";

export interface RolInterface {
    id: number,
    nombre: string,
    Empresa?: EmpresaInterface,
    empresaId: number,
    activo: boolean,
}