import { getItemsByConditionNoIdEmpresa } from "@/api";
import { type Notification, type Task } from "@/contexts/Notifications";
import { timeLineInterface } from "@/interfaces/timeLineInterface";
import { useAuth } from "@/hooks/useAuth";
// Define el tipo genérico para la línea de tiempo
export type ActivityTimelineItem = {
  id: string;
  title: string;
  notification: "message" | "task";
  details: string;
  userId?: string;
  groupIds?: string[];
  createdAt: string; // Asegúrate de que el backend siempre envíe `createdAt` como string ISO
} & (Notification | Task);

// Función auxiliar para mapear los datos al formato esperado
const mapToActivityTimelineItem = <T extends Notification | Task>(
  items: T[],
  type: "message" | "task",
  detailsKey: keyof T
): any[] => {
  return items.map((item) => ({
    ...item,
    id: item.id as string,
    title: item.title,
    notification: type,
    details: item[detailsKey] as string,
    groupIds: item.groupIds,
    userId: item.userId,
    createdAt: item.createdAt,
  
  }));
};

export const getActivityTimeline = async (userId: string): Promise<timeLineInterface[]> => {
  try {
    console.log(userId)
    const [notifications, tasks] = await Promise.all([
      getItemsByConditionNoIdEmpresa("notifications", "senderId", "==", userId),
      getItemsByConditionNoIdEmpresa("tasks", "senderId", "==", userId),
    ]);

    // Mapear notificaciones y tareas al formato ActivityTimelineItem
    const mappedNotifications = mapToActivityTimelineItem(
      notifications as Notification[],
      "message",
      "message"
    );
    const mappedTasks = mapToActivityTimelineItem(
      tasks as Task[],
      "task",
      "description"
    );

  
    const formattedNotifications: timeLineInterface[] = mappedNotifications.map((item) => ({
      id: String(item.id),
      title: String(item.title), // Ajusta la ruta correcta
      description: String(item.details),
      time: String(item.createdAt),
    }));

    const formattedTasks: timeLineInterface[] = mappedTasks.map((item) => ({
      id: String(item.id),
      title: String(item.title),
      description: String(item.details),
      time: String(item.createdAt),
    }));

    return [
      ...formattedNotifications,
      ...formattedTasks,
    ].sort(
      (a, b) =>
        new Date(b.time).getTime() - new Date(a.time).getTime()
    ) as timeLineInterface[];

  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener la línea de tiempo");
  }
};
