import { Badge } from "@/components/ui/badge";
import { labels, priorities, statuses } from "@/contexts/Notifications/constants";
import { cn } from "@/lib/utils";

export const Labels = ({
  taskLabels,
  className,
}: {
  taskLabels: string[];
  className?: string;
}) => {
  const label = taskLabels.map((label) =>
    labels.find((l) => l.value === label)
  );
  return (
    <div className={cn("flex items-center justify-end gap-1", className)}>
      {label.length > 0 &&
        label.map(
          (l) =>
            l && (
              <Badge key={l.value} variant="outline">
                {l.label}
              </Badge>
            )
        )}
    </div>
  );
};

export const Status = ({
  taskStatus,
  className,
}: {
  taskStatus: string;
  className?: string;
}) => {
  const status = statuses.find((status) => status.value === taskStatus);

  if (!status) {
    return null;
  }

  return (
    <div className={cn("flex items-center w-auto text-xs gap-1", className)}>
      <span>{status.label}</span>
      {status.icon && <status.icon className="text-muted-foreground w-4 h-4" />}
    </div>
  );
};

export const Priority = ({
  taskPriority,
  className,
}: {
  taskPriority: string;
  className?: string;
}) => {
  const priority = priorities.find(
    (priority) => priority.value === taskPriority
  );

  if (!priority) {
    return null;
  }

  return (
    <div className={cn("flex items-center text-xs gap-1", className)}>
      {priority.icon && (
        <priority.icon className="text-muted-foreground w-4 h-4" />
      )}
      <span>{priority.label}</span>
    </div>
  );
};
