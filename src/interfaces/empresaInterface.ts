export interface EmpresaInterface {
  id: number;
  nombre: string;
  nombreCorto: string;
  representante: string;
  telefono: string;
  correo: string;
  direccion: string;
  pictureURL?: string | File | unknown;
  isActive: boolean;
}
