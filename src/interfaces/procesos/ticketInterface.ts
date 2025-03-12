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
    user: any;
    atendido: boolean;
  }

  export interface ticketMovimientoInterface {
    id: number;
    empresaId: number;
    clienteId: number;
    ticketId: number;
    estado:string;
    ticket: ticketInterface;
    ticketEstatus: any;
    fecha:any
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