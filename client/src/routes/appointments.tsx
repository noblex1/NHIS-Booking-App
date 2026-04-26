import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authStore, useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { CalendarPlus, CalendarX, Calendar, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { appointmentsApi, ApiError } from "@/lib/api-client";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "My Appointments - NHIS Booking" },
      { name: "description", content: "View and manage your NHIS appointments." },
    ],
  }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const { user, appointments } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }

    // Fetch appointments from backend
    const fetchAppointments = async () => {
      try {
        const response = await appointmentsApi.getMyAppointments();
        authStore.setAppointments(response.appointments);
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error("Failed to load appointments");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, navigate]);

  if (!user) return null;

  const cancel = async (id: string) => {
    // Note: Backend doesn't have cancel endpoint yet, so we'll just update locally
    // In a real app, you'd call an API endpoint here
    setCancelling(id);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      authStore.cancelAppointment(id);
      toast.success("Appointment cancelled");
    } catch (error) {
      toast.error("Failed to cancel appointment");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sorted = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">History</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-4xl">My Appointments</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Your upcoming and past visits.</p>
          </div>
          <Link to="/book" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <CalendarPlus className="h-4 w-4" />
              New booking
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-3 sm:mt-8">
        {sorted.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center sm:p-10">
            <CalendarX className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-3 text-base font-semibold text-foreground">No appointments yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Book your first appointment to get started.</p>
            <Link to="/book" className="mt-4 inline-block">
              <Button>Book appointment</Button>
            </Link>
          </div>
        )}

        {sorted.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 sm:p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground sm:h-12 sm:w-12"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground sm:text-base">
                    {format(new Date(a.date), "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {a.time}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <StatusBadge status={a.status} />
                {a.status === "Confirmed" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => cancel(a.id)}
                    disabled={cancelling === a.id}
                  >
                    {cancelling === a.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Cancel"
                    )}
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
