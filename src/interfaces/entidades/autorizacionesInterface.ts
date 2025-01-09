import { EmpresaInterface } from "../empresaInterface";

export interface AutorizacionInterface {
    id: number,
    empresa?: EmpresaInterface,
    empresaId: number,
    descripcion: string,
    activo: string,
}