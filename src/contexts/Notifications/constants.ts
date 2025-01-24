import { TaskLabel } from "@/contexts/Notifications";
import {
  LuArrowDown,
  LuArrowRight,
  LuArrowUp,
  LuCircleCheck,
  LuCircleOff,
  LuCircleHelp,
  LuTimer,
  LuCircleAlert,
  LuCircleDashed,
  LuEye,
} from "react-icons/lu";

type Label = {
  value: TaskLabel;
  label: string;
};

export const labels: Label[] = [
  {
    value: "error",
    label: "Error",
  },
  {
    value: "feature",
    label: "Actualización",
  },
  {
    value: "improvement",
    label: "Mejora",
  },
  {
    value: "support",
    label: "Soporte",
  },
  {
    value: "maintenance",
    label: "Mantenimiento",
  },
  {
    value: "general",
    label: "General",
  },
];

export const statuses = [
  {
    value: "on hold",
    label: "En espera",
    icon: LuCircleHelp,
  },
  {
    value: "pending",
    label: "Pendiente",
    icon: LuCircleDashed,
  },
  {
    value: "in progress",
    label: "En progreso",
    icon: LuTimer,
  },
  {
    value: "review",
    label: "Revisión",
    icon: LuEye,
  },
  {
    value: "done",
    label: "Hecho",
    icon: LuCircleCheck,
  },
  {
    value: "canceled",
    label: "Cancelado",
    icon: LuCircleOff,
  },
];

export const priorities = [
  {
    label: "Baja",
    value: "low",
    icon: LuArrowDown,
  },
  {
    label: "Media",
    value: "medium",
    icon: LuArrowRight,
  },
  {
    label: "Alta",
    value: "high",
    icon: LuArrowUp,
  },
  {
    label: "Urgente",
    value: "urgent",
    icon: LuCircleAlert,
  },
];
