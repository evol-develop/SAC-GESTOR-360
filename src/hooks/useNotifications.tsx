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

  const userId = auth.user?.id;

  const unreadNotifications = notifications.filter((notification) => {
    const isForUser =
      notification.userId === userId ||
      notification.userId === "all" ||
      notification.groupIds?.includes(userId || "");

    const isUnread = !notification.isRead?.[userId ?? ""];

    return isForUser && isUnread;
  });

  return unreadNotifications.length;
};


export const unreadNotificationsCount2 = (
  notifications: Notification[],
  authState?: AuthState
) => {
  const { markAsNotified } = useNotifications();
  const auth = authState || (JSON.parse(localStorage.getItem("authState") || "{}") as AuthState);
  const userId = auth.user?.id;

  if (!userId) {
    return { unreadNotifications: [] }; // o maneja el caso de no tener userId
  }

  const unreadNotifications = notifications.filter((notification) => {
   

    const isUserUndisplayed =
      (notification.userId === userId || notification.groupIds?.includes(userId ?? "")) &&
      notification.motivo === "ticket" &&
      (!notification.notificationDisplay || notification.notificationDisplay[userId.toString() as string] === false);

    return isUserUndisplayed;
  });

  unreadNotifications.forEach(async (notification) => {
    if (notification?.id) {
      if (markAsNotified) {
        await markAsNotified(notification?.id as string, userId as string);
      }
    }
  });

  return {
    unreadNotifications,
  };
};




export const notificationsAndTasksCount = ( 
  notifications: Notification[],
  tasks: Task[],
  authState?: AuthState
) => {
  const auth =
    authState ||
    (JSON.parse(localStorage.getItem("authState") || "{}") as AuthState);

  const userId = auth.user?.id;

  const unreadNotifications = notifications.filter((notification) => {
    const isForUser =
      notification.userId === userId ||
      notification.userId === "all" ||
      notification.groupIds?.includes(userId || "");

    const isUnread = !notification.isRead?.[userId ?? ""];

    return isForUser && isUnread;
  });

  const uncompletedTasks = tasks.filter(
    (task) => task.userId === userId && !task.isCompleted
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
): boolean => {
  // Si la notificación es para todos o en grupo, verifica por userId
  const isForUser =
    notification.userId === userId ||
    notification.userId === "all" ||
    (notification.groupIds?.includes(userId) ?? false);

  if (!isForUser) return true; // No aplica para este usuario

  // Devuelve true o false según el registro en isRead
  return notification.isRead?.[userId] === true;
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
