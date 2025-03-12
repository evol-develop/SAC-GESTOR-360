import {
  LuBuilding2,
  LuFolder,
  LuFolderCog,
  LuHouse,
  LuShieldCheck,
  LuUserCog,
  LuUsers,
  LuUserRound,
  LuBell,
  LuClipboardList,
} from "react-icons/lu";
import { IoIosAlert } from "react-icons/io";
import type { IconType } from "react-icons";
import { IoAlertCircleOutline } from "react-icons/io5";
import { RiCustomerService2Fill } from "react-icons/ri";
import { GrServices } from "react-icons/gr";
import { FaUsers } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";
import { MenuEnums } from "./MenuEnums";
import { FaListCheck } from "react-icons/fa6";
import { TbUserDollar } from "react-icons/tb";
import { MdOutlineFactCheck } from "react-icons/md";
import { SiCodefactor } from "react-icons/si";
import { IoCellularOutline } from "react-icons/io5";
import { IoTicketOutline } from "react-icons/io5";
import { BsFileText } from "react-icons/bs";
export type MenuItem = {
  id?: number;
  heading?: string;
  link?: string;
  Icon?: IconType;
  badge?: string;
  items?: MenuItem[];
  name?: string;
  show?: boolean;
};

export type MenuItems = {
  items: MenuItem[];
  heading: string;
};

const menuItems: MenuItems[] = [
  {
    heading: "Sistema",
    items: [
      {
        id: MenuEnums.Inicio,
        Icon: LuHouse,
      },
    ],
  },
  {
    heading: "Procesos",
    items: [
      {
        id: MenuEnums.Tickets,
        Icon: IoTicketOutline ,
      },
      {
        id: MenuEnums.ConsultaTickets,
        Icon: BsFileText,
      },
    ],
  },
  {
    heading: "Configuración",
    items: [
      {
        name: "Catálogos",
        Icon: LuFolder,
        items: [
          {
            id: MenuEnums.Alertas,
            Icon: IoAlertCircleOutline,
          },
          {
            id: MenuEnums.Clientes,
            Icon: LuUserRound,
          },
          {
            id: MenuEnums.Departamentos,
            Icon: RiCustomerService2Fill,
          },
          {
            id: MenuEnums.Facturacion,
            Icon: MdOutlineFactCheck,
          },
          // {
          //   id: MenuEnums.FacturacionComplementos,
          //   Icon: SiCodefactor,
          // },
          {
            id: MenuEnums.Lineas,
            Icon: IoCellularOutline,
          },
          {
            id: MenuEnums.Servicios,
            Icon: GrServices,
          },
          {
            id: MenuEnums.SubLineas,
            Icon: LuShieldCheck,
          },
          {
            id: MenuEnums.TiposClientes,
            Icon: FaUsers,
          },
          // {
          //   id: MenuEnums.Ventas,
          //   Icon:TbUserDollar ,
          // },
          // {
          //   id: MenuEnums.VentasDetalles,
          //   Icon: FaListCheck,
          // },
          // {
          //   id: MenuEnums.VentasPagos,
          //   Icon: MdOutlineAttachMoney,
          // },
        ],
      },
      {
        name: "Administración",
        Icon: LuFolderCog,
        items: [
          {
            id: MenuEnums.Autrizaciones,
            Icon: LuShieldCheck,
          },
          {
            id: MenuEnums.Empresas,
            Icon: LuBuilding2,
          },
          {
            id: MenuEnums.Roles,
            Icon: LuUserCog,
          },
          {
            id: MenuEnums.Usuarios,
            Icon: LuUsers,
          },
        ],
      },
      {
        id: MenuEnums.Notificaciones,
        Icon: LuBell,
      },
      {
        id: MenuEnums.Tareas,
        Icon: LuClipboardList,
      },
    ],
  },
  // {
  //   heading: "Reportes",
  //   items: [
  //     {
  //       id: MenuEnums.Reportes,
  //       Icon: LuClipboard,
  //     },
  //   ],
  // },
];

export default menuItems;
