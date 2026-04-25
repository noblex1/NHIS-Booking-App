import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { authStore, useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { CalendarPlus, CalendarX, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "My Appointments — NHIS Booking" },
      { name: "description", content: "View and manage your NHIS appointments." },
    ],
  }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const { user, appointments } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  const cancel = (id: string) => {
    authStore.cancelAppointment(id);
    toast.success("Appointment cancelled");
  };

  const sorted = [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex items-start justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <p className="text-sm font-medium text-primary">History</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
            My Appointments
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your upcoming and past visits.
          </p>
        </div>
        <Link to="/book">
          <Button>
            <CalendarPlus className="h-4 w-4" />
            <span className="hidden sm:inline">New booking</span>
          </Button>
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {sorted.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <CalendarX className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-3 text-base font-semibold text-foreground">
              No appointments yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Book your first appointment to get started.
            </p>
            <Link to="/book" className="mt-4 inline-block">
              <Button>Book appointment</Button>
            </Link>
          </div>
        )}

        {sorted.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-primary-foreground"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">
                    {format(new Date(a.date), "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {a.time}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={a.status} />
                {a.status === "Confirmed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancel(a.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "Confirmed" | "Pending" | "Cancelled" }) {
  const styles: Record<typeof status, string> = {
    Confirmed: "bg-secondary/10 text-secondary",
    Pending: "bg-amber-500/10 text-amber-600",
    Cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
