import { LuCircleCheck } from "react-icons/lu";
import { format, formatDistanceToNow } from "date-fns";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getBadgeVariantFromLabel,
  useNotifications,
} from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const NotificationDetail = ({ notificationId }: { notificationId: string }) => {
  const { notifications, markAsRead } = useNotifications();
  const notification = notifications.find((n) => n.id === notificationId);

  if (!notification) {
    return <p>Notificación no encontrada.</p>;
  }

  return (
    <div className="flex flex-col flex-1">
      <Separator />
      <div className="sm:flex-row sm:items-center flex flex-col p-4">
        <div className="flex gap-4 items-start text-sm">
          <UserAvatar
            userId={notification.senderId}
            rounded="rounded-full"
            withTooltip
          />
          <div className="grid gap-1">
            <div className="font-semibold">{notification.title}</div>
            <div className="text-primary/75 line-clamp-1 text-xs">
              <Badge variant={getBadgeVariantFromLabel(notification.type)}>
                {notification.type}
              </Badge>
            </div>
          </div>
        </div>
        <div className="sm:ml-auto sm:mt-0 flex gap-2 items-center mt-1 ml-12">
          <span className="text-muted-foreground text-xs">
            {formatDistanceToNow(new Date(notification.createdAt as string), {
              addSuffix: true,
            })}
            {" - "}
            {format(new Date(notification.createdAt as string), "PPPP")}
          </span>
          {!notification.isRead && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => markAsRead(notification.id as string)}
                >
                  <LuCircleCheck />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Marcar como leído</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <Separator />
      <ScrollArea className="p-4 h-full sm:h-[calc(100vh-346px)]">
        <div className="flex-1 text-sm whitespace-pre-wrap">
          <div
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: notification.message }}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationDetail;
