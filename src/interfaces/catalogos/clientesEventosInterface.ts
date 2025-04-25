 export interface clientesEventosInterface {
    id: number;
    empresaId: number;
    fecha_inicio: Date;
    comentario: string;
    clienteId: number;
    evento: eventoInterface;
   
}

export interface eventoInterface {
    id: number;
    empresaId: number;
    nombre: string;
    activo: boolean;

}

