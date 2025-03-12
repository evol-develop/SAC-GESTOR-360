import { UsuarioAdicionalesInterface } from "../UsuarioAdicionalesInterface";

export interface departamentoInterface {
    id: number;
    empresaId: number;
    nombre: string;
    departamentosUsuarios: departamentoUsuarioInterface[];
    usuarios: any[];
  }

  
  export interface departamentoUsuarioInterface {
      id: number;
      departamentoId: number;
      usuarioId: number;
      departamento: departamentoInterface[];
      usuario: UsuarioAdicionalesInterface;
  }