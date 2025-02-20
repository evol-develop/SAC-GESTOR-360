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
  }

  export interface ticketMovimientoInterface {
    id: number;
    empresaId: number;
    clienteId: number;
    ticketId: number;
    etapa:number;
  }