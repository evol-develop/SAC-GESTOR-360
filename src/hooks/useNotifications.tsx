import { ComponentProps, useContext } from "react";

import NotificationContext, {
  Notification,
  Task,
} from "@/contexts/Notifications";
import { Badge } from "@/components/ui/badge";
import { AuthState } from "@/contexts/Auth/types";

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications debe estar dentro del proveedor NotificationContext"
    );
  }
  return context;
};

export const unreadNotificationsCount = (
  notifications: Notification[],
  authState?: AuthState
) => {
  const auth =
    authState ||
    (JSON.parse(localStorage.getItem("authState") || "{}") as AuthState);

  const unreadNotifications = notifications.filter(
    (notification) =>
      (notification.userId === auth.user?.id && !notification.isRead) ||
      (notification.userId === "all" &&
        new Date(notification.createdAt || "") >
          new Date(new Date().setHours(0, 0, 0, 0))) ||
      (notification.groupIds?.includes(auth.user?.id || "") &&
        new Date(notification.createdAt || "") >
          new Date(new Date().setHours(0, 0, 0, 0)))
  );

  return unreadNotifications.length;
};

export const notificationsAndTasksCount = (
  notifications: Notification[],
  tasks: Task[],
  authState?: AuthState
) => {
  const auth =
    authState ||
    (JSON.parse(localStorage.getItem("authState") || "{}") as AuthState);

  const unreadNotifications = notifications.filter(
    (notification) =>
      (notification.userId === auth.user?.id && !notification.isRead) ||
      (notification.userId === "all" &&
        new Date(notification.createdAt || "") >
          new Date(new Date().setHours(0, 0, 0, 0))) ||
      (notification.groupIds?.includes(auth.user?.id || "") &&
        new Date(notification.createdAt || "") >
          new Date(new Date().setHours(0, 0, 0, 0)))
  );

  const uncompletedTasks = tasks.filter(
    (task) => task.userId === auth.user?.id && !task.isCompleted
  );

  return unreadNotifications.length + uncompletedTasks.length;
};

export const uncompletedTasksCount = (tasks: Task[], authState?: AuthState) => {
  const auth =
    authState ||
    (JSON.parse(localStorage.getItem("authState") || "{}") as AuthState);

  const uncompletedTasks = tasks.filter(
    (task) => task.userId === auth.user?.id && !task.isCompleted
  );

  return uncompletedTasks.length;
};

export const isNotificationRead = (
  notification: Notification,
  userId: string
) => {
  const isGroupNotification =
    notification.groupIds &&
    notification.groupIds?.includes(userId) &&
    new Date(notification.createdAt || "") >
      new Date(new Date().setHours(0, 0, 0, 0));
  const isGlobalToday =
    notification.userId === "all" &&
    new Date(notification.createdAt || "") >
      new Date(new Date().setHours(0, 0, 0, 0));

  return isGlobalToday || isGroupNotification ? false : notification.isRead;
};

export function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["mensaje", "pendiente"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["sistema", "en curso"].includes(label.toLowerCase())) {
    return "outline";
  }

  if (["importante", "cancelada"].includes(label.toLowerCase())) {
    return "destructive";
  }

  return "secondary";
}
