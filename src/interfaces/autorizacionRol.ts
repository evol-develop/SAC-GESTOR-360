import { AutorizacionInterface } from './entidades/autorizacionesInterface';

export interface AutorizacionByRolInterface {
  autorizacion: AutorizacionInterface;
  activo: boolean;
}