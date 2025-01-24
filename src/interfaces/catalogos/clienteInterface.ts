export interface clienteInterface {
    id: number;
    id_empresa: number;
    nombre: string;
    rfc: string;
    cp: number;
    id_tipo_cliente: number;
    domicilio: string;
    colonia: string;
    estado: string;
    ciudad : string;
    telefono: string;
    celular: string;
    email: string;
    email2: string;
    limite_credito: number;
    descuento_default: number;
    dias_credito: number;
    id_alerta: number;
    curp: string;
    facturar: boolean;
    retener_iva: boolean;
    retener_isr: boolean;
    porcentaje_retencion_iva: number;
    porcentaje_retencion_isr: number;
    metodo_pago: string;
    id_forma_pago: number;
    fecha_registro: string;
    enviar_cobranza: boolean;
    nombreComercial: string;
    fecha_final: string;
    activo: boolean;
    id_regimen_fiscal:number
    id_uso_cfdi: number;
    password:string;
  }