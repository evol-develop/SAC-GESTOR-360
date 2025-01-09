import { MenuItem } from "@/layout/sidebar/SidebarMenu/menuItems";

export const buildMenu = (items: MenuItem[], permisos: any[]): MenuItem[] => {
  return items
    .map((item) => {
      if (item.heading && item.items) {
        // Procesar secciones con encabezados
        return {
          heading: item.heading,
          items: buildMenu(item.items, permisos),
        };
      }

      if (!item.id && item.items) {
        // Elemento sin ID, pero con subelementos
        return {
          name: item.name,
          Icon: item.Icon,
          items: buildMenu(item.items, permisos),
        };
      }

      // Buscar el permiso correspondiente
      const permiso = permisos.find(
        (permiso) => permiso.id === item.id && permiso.acceso
      );

      // Si no hay permiso válido, excluir el elemento
      if (!permiso) return null;

      return {
        name: permiso.nombre,
        link: permiso.ruta === "/" ? "/site" : `/site/${permiso.ruta}`,
        Icon: item.Icon,
        items: item.items ? buildMenu(item.items, permisos) : undefined,
      };
    })
    .filter(Boolean) as MenuItem[]; // Filtrar elementos nulos
};
