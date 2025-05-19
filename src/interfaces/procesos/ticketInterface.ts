export interface ticketInterface {
    id: number;
    empresaId: number;
    clienteId: number;
    descripcion: string;
    titulo: string;
    activo: boolean;
    pictureURL?: string | File | unknown;
    audioFile?: string | File | unknown;
    servicioId: number;
    servicio: any;
    user: any;
    atendido: boolean;
    fechaCrea: Date  | null;
    usuarioCrea: string;
  }

  export interface ticketMovimientoInterface {
    id: number;
    empresaId: number;
    clienteId: number;
    ticketId: number;
    estado:string;
    ticket: ticketInterface;
    ticketEstatus: any;
    ticketEstatusId: any;
    fechaCrea:any
  }

  export interface ticketComentariosInterface {
    id: number;
    empresaId: number;
    clienteId: number;
    ticketId: number;
    estado:string;
    comentario:string;
    ticket: ticketInterface;
    fecha:any
    usuarioCrea: string
    asunto:string
  }