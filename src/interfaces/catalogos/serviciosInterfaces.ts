import { UsuarioAdicionalesInterface } from "../UsuarioAdicionalesInterface";
import { clienteInterface } from "./clienteInterface";
import { departamentoInterface } from "./departamentoInterface";
import { lineasInterface } from "./lineasInterface";
import { sublineasInterface } from "./sublineasInterface";

export interface serviciosInterface {
    id: number;
    empresaId: number;
    precio:number;
    descripcion: string;
    frecuencia:string;
    capturar_cantidad:boolean;
    lineaId:number;
    sublineaId:number;
    id_unidad:number;
    tasa_iva:string;
    aplica_iva:boolean;
    clave_sat: string;
    aplica_ieps:boolean;
    obj_imp: string;
    tasa_ieps:number;
    porcentaje_retencion_isr:number;
    porcentaje_retencion_iva:number;
    activo: boolean;
    linea: lineasInterface;
    sublinea : sublineasInterface;
    departamentoId: number;
    departamento: departamentoInterface;
    usuario: UsuarioAdicionalesInterface;
    userId: string;
}

export interface clientesServiciosInterface {
    id: number;
    clienteId: number;
    servicioId: number;
    activo: boolean;
    servicio: serviciosInterface;
    cliente: clienteInterface;
}