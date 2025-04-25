
export interface AutorizarInterface {
  password: string;
  observaciones: string;
  autorizacion: string;
}

export enum TiposAutorizacion {
    'BorrarGasto' = 'Borrar Gasto',
    'BorrarIngreso' = 'Borrar Ingreso',
    'AutorizarGasto' = 'Autorizar Gasto',
    'EliminarObra' = 'Eliminar Obra',
    'EliminarClientes' = 'Eliminar Clientes',
    'EliminarColaboradores' = 'Eliminar Colaboradores',
    'EliminarGruposInsumos' = 'Eliminar Grupos Insumos',
    'EliminarProveedores' = 'Eliminar Proveedores',
    'ModificarMontoMaximoAutorizadoProveedor' = 'Modificar Monto Máximo Autorizado Proveedor',
    'ModificarPermisos' = 'Modificar Permisos',
    'ModificarAutorizaciones' = 'Modificar Autorizaciones',
    'EliminarRoles' = 'Eliminar Roles',
    'EliminarDocumentos' = 'Eliminar Documentos',
    'CambiarEtapa'= 'Cambiar Etapa',
    'AñadirServicios'='Añadir Servicios',
    'AñadirNotas'='Añadir Notas',
    'AñadirEventos'='Añadir Eventos',
    'AñadirDatosFiscales'='Añadir DatosFiscales',
    'VerDocumentos'='Ver Documentos',
    'VerMovimientos'='Ver Movimientos',
}