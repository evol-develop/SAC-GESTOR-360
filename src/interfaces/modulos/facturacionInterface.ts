export interface facturacionChildItem {
    id_venta?: number;
    linea_detalle?: number;
    nombre_servicio: string;
    importe_servicio: number;
    importe_servicio_original?:number;
    cantidad: number;
    total: number,
    subtotal: number,
    iva: number,
    tasa_iva: number;
    porcentaje_descuento: number;
    importe_descuento: number;
    capturar_cantidad: boolean;
    id_servicio: number;
    id_cliente: number;
    id_parent: number;
    status_editado?: string;
    venta_separada?: boolean;
  }
  
  export interface facturacionParentItem {
    id_parent: number;
    nombre_cliente: string;
    importe_total: number;
    anio: number;
    mes: number;
    frecuencia: string;
    id_cliente: number;
    id_venta? : number;
    estatus?: string;
    metodo_pago: string;
    forma_pago: string;
  }