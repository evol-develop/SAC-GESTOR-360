import {
  onSnapshot,
  collection,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Link, useSearchParams } from "react-router";
import { LuBellOff, LuClipboardX } from "react-icons/lu";
import { createContext, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
  isNotificationRead,
  notificationsAndTasksCount,
  uncompletedTasksCount,
  unreadNotificationsCount,
  useNotifications,
  unreadNotificationsCount2
} from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "@/components/UserAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Status } from "@/contexts/Notifications/components";
import { firebaseDB as db } from "@/firebase/firebase-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { time } from "console";
import { useNavigate } from "react-router";

export type Notification = {
  id?: string;
  userId?: string;
  groupIds?: string[];
  title: string;
  message: string;
  type: string;
  isRead?: {
    [userId: string]: boolean;
  };
  senderId?: string;
  createdAt?: string;
  empresaId?: number | string;
  notificationDisplay?: {
    [userId: string]: boolean;
  }
  ticketId?: number;
  comentarioId?:number;
  motivo:string;
};

export type TaskStatus =
  | "on hold"
  | "pending"
  | "in progress"
  | "review"
  | "done"
  | "canceled";
export type TaskLabel =
  | "error"
  | "feature"
  | "improvement"
  | "support"
  | "maintenance"
  | "general";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type Task = {
  id?: string;
  userId?: string;
  groupIds?: string[];
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  dueDate: string;
  senderId?: string;
  empresaId?: number | string;
  status: TaskStatus;
  label: TaskLabel[];
  priority: TaskPriority;
};

const NotificationContext = createContext<{
  notifications: Notification[];
  tasks: Task[];
  myTasks: Task[];
  markAsRead: (id: string, userId: string) => void;
  sendNotification: (notification: Notification) => void;
  completeTask: (id: string) => void;
  createTask: (task: Task) => void;
  markAsNotified?: (id: string,userId: string) => void;
}>({
  notifications: [],
  tasks: [],
  myTasks: [],
  markAsRead: () => {},
  sendNotification: () => {},
  completeTask: () => {},
  createTask: () => {},
  markAsNotified: () => {},
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const { idEmpresa, user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      const notificationQuery = query(
        collection(db, "notifications"),
        where("empresaId", "in", [idEmpresa, "all"]),
        orderBy("createdAt", "desc")
        // limit(10)
      );

      const unsubscribeNotifications = onSnapshot(
        notificationQuery,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Notification[];
          setNotifications(data);
        }
      );

      const taskQuery = query(
        collection(db, "tasks"),
        where("empresaId", "in", [idEmpresa, "all"]),
        orderBy("createdAt", "desc")
        // limit(10)
      );

      const unsubscribeTasks = onSnapshot(taskQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        setTasks(data);
      });

      const myTasksQuery = query(
        collection(db, "tasks"),
        where("senderId", "==", user?.id ?? ""),
        orderBy("createdAt", "desc")
      );

      const unsubscribeMyTasks = onSnapshot(myTasksQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        setMyTasks(data);
      });

      return () => {
        unsubscribeNotifications();
        unsubscribeTasks();
        unsubscribeMyTasks();
      };
    }
  }, [idEmpresa, user]);

  const markAsRead = async (id: string, userId: string) => {
    if (!id || !userId) return;
  
    const notificationRef = doc(db, "notifications", id);
  
    await updateDoc(notificationRef, {
      [`isRead.${userId}`]: true, // actualiza solo el campo del usuario
    });
  };
  

   const markAsNotified = async (notificationId: string, userId: string) => {
    const docRef = doc(db, "notifications", notificationId);
    await updateDoc(docRef, {
      [`notificationDisplay.${userId}`]: true,
    });
  };
  

  
  const sendNotification = async ({
    userId = "all",
    groupIds = [],
    empresaId = idEmpresa,
    ...notification
  }: Notification) => {
    // Construir isRead por cada usuario
    let isRead: Record<string, boolean> = {};
    let notificationDisplay: Record<string, boolean> = {};
  
    if (userId === "all") {
      isRead = { all: false }; 
      notificationDisplay = { all: false };
    } else if (groupIds.length > 0) {
      groupIds.forEach(id => {
        isRead[id] = false;
        notificationDisplay[id] = false;
      });
    } else if (userId) {
      isRead[userId] = false;
      notificationDisplay[userId] = false;
    }
  
    await addDoc(collection(db, "notifications"), {
      ...notification,
      userId,
      groupIds,
      empresaId,
      senderId: user?.id,
      isRead,
      createdAt: new Date().toISOString(),
      notificationDisplay,
    });
  };
  

  const completeTask = async (id: string) => {
    if (!id) return;
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { isCompleted: true, status: "done" });
  };

  const createTask = async (task: Task) => {
    await addDoc(collection(db, "tasks"), {
      ...task,
      status: "pending",
      senderId: user?.id,
      createdAt: new Date().toISOString(),
      empresaId: idEmpresa,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        tasks,
        myTasks,
        markAsRead,
        sendNotification,
        completeTask,
        createTask,
        markAsNotified
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const NotificationAndTaskList = ({
  className,
  itemClassName,
}: {
  className?: string;
  itemClassName?: string;
}) => {
  const { authState } = useAuth();
  const { notifications, tasks } = useNotifications();
  const currentUserId = authState.user?.id || "";

  const filteredNotifications = notifications.filter((notification) => {
    return (
      notification.userId === "all" ||
      notification.userId === currentUserId ||
      (notification.groupIds && notification.groupIds.includes(currentUserId))
    );
  });

  const filteredTasks = tasks.filter((task) => {
    return (
      task.userId === "all" ||
      task.userId === currentUserId ||
      (task.groupIds && task.groupIds.includes(currentUserId))
    );
  });

  return (
    <Tabs defaultValue="notifications" className="bg-background">
      <TabsList className="grid grid-cols-2 gap-2 p-4 pb-0 w-full h-auto bg-background">
        <TabsTrigger value="notifications" className="relative border">
          Mensajes <CountNotificationsAndTasks countTasks={false} showNotificacion={false} />
        </TabsTrigger>
        <TabsTrigger value="tasks" className="relative border">
          Tareas <CountNotificationsAndTasks countMessages={false} showNotificacion={false}/>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="notifications">
        <ScrollArea className={className}>
          <div className="grid gap-2 p-4 pt-0 w-full h-full">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  className={itemClassName}
                  notification={notification}
                />
              ))
            ) : (
              <div className="flex gap-1 justify-center items-center p-2 w-full text-sm text-secondary-foreground/50">
                No hay mensajes
                <LuBellOff />
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="tasks">
        <ScrollArea className={className}>
          <div className="grid gap-2 p-4 pt-0 w-full h-full">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} className={itemClassName} />
              ))
            ) : (
              <div className="flex gap-1 justify-center items-center p-2 w-full text-sm text-secondary-foreground/50">
                No hay tareas
                <LuClipboardX />
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

const NotificationItem = ({
  notification,
  className,
}: {
  notification: Notification;
  className?: string;
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { id, title, createdAt, senderId, message } = notification;
  const read = isNotificationRead(notification, user?.id || "");
  const isActive = Boolean(searchParams.get("notification") === id);

  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(message, "text/html");
  const anchor = parsedDoc.querySelector("a");
  const hasAnchor = Boolean(anchor);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isInsideAnchor = target.closest("a");

    if (isInsideAnchor) return;

    navigate(`/site/notificaciones-y-actividad?type=msj&notification=${id}`);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 w-full rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
        !hasAnchor && "cursor-pointer", // ✅ solo tiene cursor si NO hay <a>
        isActive && "bg-muted",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center">
          <div className="grid grid-cols-[minmax(0,1fr)_0.5rem] gap-2 items-center mr-1">
            <span className="font-semibold truncate">
              <UserAvatar userId={senderId} showAvatar={false} />
            </span>
            {!read && <span className="flex bg-blue-600 rounded-full size-2" />}
          </div>
          <div
            className={cn(
              "ml-auto text-xs text-nowrap",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {formatDistanceToNow(new Date(createdAt as string), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className="text-xs font-medium">{title}</div>
      </div>

      <div
        className={cn(
          "rich-text-content",
          "text-xs line-clamp-1 text-muted-foreground",
          hasAnchor && "cursor-auto" // ✅ evita cursor en mensaje si hay <a>
        )}
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
};


const TaskItem = ({ task, className }: { task: Task; className?: string }) => {
  const [searchParams] = useSearchParams();
  const { id, title, description, isCompleted, senderId, createdAt, status } =
    task;
  const isActive = Boolean(searchParams.get("notification") === id);

  return (
    <Link
      className={cn(
        "flex flex-col items-start gap-2 w-full rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
        isActive && "bg-muted",
        className
      )}
      to={`/site/notificaciones-y-actividad?type=task&notification=${task.id}`}
    >
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center">
          <div className="grid grid-cols-[minmax(0,1fr)_0.5rem] gap-2 items-center mr-1">
            <span className="font-semibold truncate">
              <UserAvatar userId={senderId} showAvatar={false} />
            </span>
            {!isCompleted && (
              <span className="flex bg-blue-600 rounded-full size-2" />
            )}
          </div>
          <div
            className={cn(
              "ml-auto text-xs text-nowrap",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {formatDistanceToNow(new Date(createdAt as string), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className="text-xs font-medium">{title}</div>
      </div>
      <div className="text-xs line-clamp-1 text-muted-foreground">
        {description.substring(0, 100)}
      </div>
      <div className="flex gap-2 items-center">
        <Status taskStatus={status} />
      </div>
    </Link>
  );
};

export const CountNotificationsAndTasks =  React.memo(({
  x = "right",
  y = "top",
  countMessages = true,
  countTasks = true,
  showNotificacion = true,
}: {
  x?: "left" | "right";
  y?: "top" | "bottom";
  countMessages?: boolean;
  countTasks?: boolean;
  showNotificacion? : boolean;
}) => {
  const { authState } = useAuth();
  const { notifications, tasks } = useNotifications();

  let count = 0;

  const filteredMessages = notifications.filter((notification) => {
    const currentUserId = authState.user?.id || "";
    return (
      notification.userId === "all" ||
      notification.userId === currentUserId ||
      (notification.groupIds && notification.groupIds.includes(currentUserId))
    );
  });

  const filteredTasks = tasks.filter((task) => {
    const currentUserId = authState.user?.id || "";
    return (
      task.userId === "all" ||
      task.userId === currentUserId ||
      (task.groupIds && task.groupIds.includes(currentUserId))
    );
  });

  if (countMessages && countTasks) {
    count = notificationsAndTasksCount(
      filteredMessages,
      filteredTasks,
      authState
    );
  } else if (countMessages) {
    count = unreadNotificationsCount(filteredMessages, authState);
  } else if (countTasks) {
    count = uncompletedTasksCount(filteredTasks, authState);
  }

  return (
    <div
      className={cn(
        "absolute z-10",
        x === "left" ? "-left-2" : "-right-2",
        y === "top" ? "-top-3" : "-bottom-3"
      )}
    >
      {count > 0 && (
        <div className="bg-destructive text-destructive-foreground text-[8px] rounded-full leading-none size-4 inline-flex items-center justify-center">
          {count}
        </div>
      )}
    </div>
  );
});

export const CountNotifications2 = () => {
  const { authState } = useAuth();
  const { notifications, tasks } = useNotifications();

  const filteredMessages = notifications.filter((notification) => {
    const currentUserId = authState.user?.id || "";
    return (
      notification.userId === "all" ||
      notification.userId === currentUserId ||
      (notification.groupIds && notification.groupIds.includes(currentUserId))
    );
  });


  var notificationCount = unreadNotificationsCount2(filteredMessages, authState);

  var notif = notificationCount.unreadNotifications[0];
  //console.log("Enviar", notificationCount.unreadNotifications.length);

  if(notificationCount.unreadNotifications.length > 0) {
    mostrarNotificacion({
      title: notif.title,
      message: notif.message,
      ticketId: notif.ticketId,
      comentarioId: notif.comentarioId,
    });
  }



  return (<> </>);
};

async function mostrarNotificacion(notification: any) {
  if (!("Notification" in window)) {
    console.error("Este navegador no soporta notificaciones.");
    return;
  }

  const permiso = await Notification.requestPermission();

  if (permiso === "granted") {
    try {
      // const audio = new Audio(
      //   "https://firebasestorage.googleapis.com/v0/b/sac-gestor-360.firebasestorage.app/o/SONIDOS_SISTEMA%2Fding-101492.mp3?alt=media&token=10619769-992b-4941-b062-03f2105f3288"
      // );

      // // Reproducir el sonido antes de mostrar la notificación
      // await audio.play();

      // Mostrar la notificación del sistema
      const noti =new Notification(notification.title, {
        //body: notification.message,
        icon: "https://firebasestorage.googleapis.com/v0/b/sac-gestor-360.firebasestorage.app/o/SONIDOS_SISTEMA%2F1827272.png?alt=media&token=8ac05cab-a24b-426a-b216-0b7625c29555", // Cambia el icono si es necesario
        
      });

      if(notification.ticketId != 0 && notification.comentarioId == 0) {

        noti.onclick = () => {
          window.open('/site/procesos/consultaTickets/mostrarArchivos/'+notification.ticketId+'/0', '_blank');
        };
      }
      else{
        noti.onclick = () => {
          window.open('/site/procesos/consultaTickets/mostrarComentarios/'+notification.ticketId, '_blank');
        };
      }
      
    } catch (error) {
      console.error("Error al mostrar la notificación:", error);
    }
  } else {
    console.warn("Permiso de notificación no concedido:", permiso);
  }
  
}


export default NotificationContext;
