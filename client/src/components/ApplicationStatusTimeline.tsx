import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_ORDER,
  type ApplicationStatus,
} from "@/lib/nhis-application";
import { CheckCircle2, Circle } from "lucide-react";

export function ApplicationStatusTimeline({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  if (status === "cancelled") {
    return (
      <p className={cn("text-sm font-medium text-destructive", className)}>
        {APPLICATION_STATUS_LABELS.cancelled}
      </p>
    );
  }

  const currentIndex = APPLICATION_STATUS_ORDER.indexOf(status);

  return (
    <ol className={cn("flex flex-col gap-2 sm:flex-row sm:gap-0", className)}>
      {APPLICATION_STATUS_ORDER.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li
            key={step}
            className={cn(
              "flex items-center gap-2 sm:flex-1 sm:flex-col sm:text-center",
              index < APPLICATION_STATUS_ORDER.length - 1 && "sm:pb-0",
            )}
          >
            <div className="flex items-center gap-2 sm:flex-col">
              {done ? (
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              ) : (
                <Circle
                  className={cn(
                    "h-5 w-5",
                    active ? "text-primary fill-primary/20" : "text-muted-foreground/40",
                  )}
                />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  active ? "text-foreground" : done ? "text-secondary" : "text-muted-foreground",
                )}
              >
                {APPLICATION_STATUS_LABELS[step]}
              </span>
            </div>
            {index < APPLICATION_STATUS_ORDER.length - 1 && (
              <div
                className={cn(
                  "hidden h-px flex-1 bg-border sm:mx-2 sm:mt-3 sm:block",
                  done && "bg-secondary/50",
                )}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
