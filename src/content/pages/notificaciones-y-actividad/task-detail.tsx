import { format, formatDistanceToNow } from "date-fns";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateItem } from "@/api";
import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import { TaskStatus } from "@/contexts/Notifications";
import { useNotifications } from "@/hooks/useNotifications";
import { statuses } from "@/contexts/Notifications/constants";
import { Labels, Status } from "@/contexts/Notifications/components";
import { ScrollArea } from "@/components/ui/scroll-area";

const TaskDetail = ({ taskId }: { taskId: string }) => {
  const { tasks, completeTask } = useNotifications();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return <p>Tarea no encontrada.</p>;
  }

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      if (status !== "done") {
        await updateItem("tasks", taskId, { status });
      } else {
        completeTask(taskId);
      }
    } catch (error) {
      console.error("Error updating task status", error);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Separator />
      <div className="sm:flex-row sm:items-center flex flex-col p-4">
        <div className="flex items-start gap-4 text-sm">
          <UserAvatar
            userId={task.senderId}
            rounded="rounded-full"
            withTooltip
          />
          <div className="grid gap-1">
            <div className="font-semibold">{task.title}</div>
            <div className="text-primary/75 line-clamp-1 flex flex-wrap gap-1 text-xs">
              <Status taskStatus={task.status} className="text-xs" />
              {!task.isCompleted && (
                <span className="mr-2">
                  <span className="font-medium">Fecha límite: </span>
                  {format(new Date(task.dueDate), "PPPP")}
                </span>
              )}
            </div>
            <div>
              <Labels taskLabels={task.label} className="justify-start" />
            </div>
          </div>
        </div>
        <div className="sm:ml-auto sm:mt-0 sm:flex-row sm:items-center sm:justify-end flex flex-col flex-wrap gap-2 mt-1 ml-12">
          <span className="text-muted-foreground line-clamp-1 text-xs">
            {formatDistanceToNow(new Date(task.createdAt), {
              addSuffix: true,
            })}
            {" - "}
            {format(new Date(task.createdAt), "PPPP")}
          </span>
          {!task.isCompleted && (
            <Select
              defaultValue={task.status}
              onValueChange={(value: TaskStatus) =>
                handleStatusChange(task.id as string, value)
              }
            >
              <SelectTrigger className="sm:max-w-[118px]">
                <SelectValue placeholder="Cambiar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estado</SelectLabel>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <Separator />
      <ScrollArea className="p-4 h-full sm:h-[calc(100vh-366px)]">
        <div className="flex-1 text-sm whitespace-pre-wrap">
          <p>{task.description}</p>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskDetail;
