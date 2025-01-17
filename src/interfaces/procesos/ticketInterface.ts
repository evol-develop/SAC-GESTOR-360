export interface ticketInterface {
    id: number;
    id_empresa: number;
    id_cliente: number;
    descripcion: string;
    titulo: string;
    activo: boolean;
    pictureURL?: string | File | unknown;
    audioFile?: string | File | unknown;
    
  }