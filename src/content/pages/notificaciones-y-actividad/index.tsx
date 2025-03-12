import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { LuBellRing, LuLogs, LuMailPlus, LuUndo2 } from "react-icons/lu";

import TaskDetail from "./task-detail";
import { appConfig } from "@/appConfig";
import { Large } from "@/components/typography";
import { Button } from "@/components/ui/button";
import ActivityTimeline from "./activity-timeline";
import NotificationDetail from "./notification-detail";
import { NotificationAndTaskList } from "@/contexts/Notifications";
import SendMessage from "./send-message";

const NotificacionesYActividad = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showActivity, setShowActivity] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<"msj" | "task" | null>(null);
  const [writeMessage, setWriteMessage] = useState(false);

  useEffect(() => {
    const id = searchParams.get("notification");
    const type = searchParams.get("type") as "msj" | "task" | null;
    setItemId(id);
    setSelectedItem(type);
    if (id && type) {
      setShowActivity(false);
      setWriteMessage(false);
    }
  }, [searchParams]);

  const toggleShow = (type: "message" | "activity") => {
    setSearchParams({ type: "", notification: "" });
    setItemId(null);
    setSelectedItem(null);
    if (type === "message") {
      setShowActivity(false);
      setWriteMessage(!writeMessage);
    } else {
      setWriteMessage(false);
      setShowActivity(!showActivity);
    }
  };

  return (
    <>
      <Helmet>
        <title>{appConfig.NOMBRE} - Notificaciones y Actividad</title>
      </Helmet>
      <section className="relative h-[calc(100dvh-252px)] sm:h-[calc(100dvh-200px)] flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col w-full h-full border rounded-sm bg-background sm:w-1/4 max-h-1/2 sm:max-h-none">
          <Large className="p-4 pb-0">Notificaciones</Large>
          <NotificationAndTaskList className="h-[calc(100dvh-660px)] sm:h-[calc(100dvh-304px)]" />
        </div>
        <div className="flex flex-col w-full h-full overflow-y-auto border rounded-sm bg-background sm:w-3/4 max-h-1/2 sm:max-h-none">
          <div className="flex items-center justify-between p-4">
            <Button
              size="sm"
              variant="default"
              onClick={() => toggleShow("message")}
            >
              <span className="hidden lg:inline-block">
                {writeMessage ? "Volver" : "Escribir mensaje"}
              </span>
              {writeMessage ? <LuUndo2 /> : <LuMailPlus />}
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => toggleShow("activity")}
            >
              <span className="hidden lg:inline-block">
                {showActivity ? "Ocultar actividad" : "Ver mi actividad"}
              </span>
              <LuLogs />
            </Button>
          </div>
          {selectedItem === "msj" && itemId ? (
            <NotificationDetail notificationId={itemId} />
          ) : selectedItem === "task" && itemId ? (
            <TaskDetail taskId={itemId} />
          ) : showActivity ? (
            <ActivityTimeline />
          ) : writeMessage ? (
            <SendMessage />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-primary/50">
              <div className="flex items-center gap-2 p-2 text-sm border rounded-md border-primary/50">
                <p>Visualiza tus notificaciones </p>
                <LuBellRing />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default NotificacionesYActividad;
