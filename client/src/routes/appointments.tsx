import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authStore, useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import {
  CalendarPlus,
  CalendarX,
  Calendar,
  Clock,
  Loader2,
  Download,
  FileText,
} from "lucide-react";
import type { Appointment } from "@/lib/api-client";
import { downloadAppointmentPdf } from "@/lib/appointment-pdf";
import { getSlotPeriodLabel } from "@/lib/slot-periods";
import { DEFAULT_CENTRE_NAME } from "@/lib/centre";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { appointmentsApi, ApiError } from "@/lib/api-client";
import { getServiceTypeLabel } from "@/lib/nhis-services";
import { ApplicationStatusTimeline } from "@/components/ApplicationStatusTimeline";
import type { ApplicationStatus } from "@/lib/nhis-application";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "My bookings - NHIS" },
      { name: "description", content: "Your NHIS registration and renewal centre visits." },
    ],
  }),
  component: AppointmentsPage,
});

function centreName(apt: Appointment): string {
  if (typeof apt.centreId === "object" && apt.centreId?.name) {
    return apt.centreId.name;
  }
  return DEFAULT_CENTRE_NAME;
}

function AppointmentsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await appointmentsApi.getMyAppointments();
        setAppointments(response.appointments);
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

  const handleDownloadPdf = async (apt: Appointment) => {
    setDownloadingId(apt._id);
    try {
      downloadAppointmentPdf(apt, {
        fullName: user.fullName,
        email: user.email,
      });
      toast.success("PDF downloaded");
    } catch {
      toast.error("Could not generate PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const cancel = async (id: string) => {
    setCancelling(id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      authStore.cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: "Cancelled" as const } : a,
        ),
      );
      toast.success("Appointment cancelled");
    } catch {
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

  const sorted = [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8 md:py-8 sm:px-6">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">History</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-4xl">
              My centre bookings
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {DEFAULT_CENTRE_NAME}
            </p>
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
            <h3 className="mt-3 text-base font-semibold text-foreground">No bookings yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Book your first registration or renewal centre visit.
            </p>
            <Link to="/book" className="mt-4 inline-block">
              <Button>Book centre visit</Button>
            </Link>
          </div>
        )}

        {sorted.map((apt) => (
          <div
            key={apt._id}
            className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 sm:p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground sm:h-12 sm:w-12"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground sm:text-base">
                    {getServiceTypeLabel(apt.serviceType)}
                  </div>
                  {apt.referenceNumber && (
                    <p className="mt-0.5 font-mono text-xs text-primary">
                      {apt.referenceNumber}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">{centreName(apt)}</p>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(apt.date), "EEEE, MMMM d, yyyy")}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    {getSlotPeriodLabel(apt.timeSlot)}
                  </div>
                  {apt.applicationStatus && apt.applicationStatus !== "cancelled" && (
                    <div className="mt-3">
                      <ApplicationStatusTimeline
                        status={apt.applicationStatus as ApplicationStatus}
                      />
                    </div>
                  )}
                </div>
              </div>

              <StatusBadge status={apt.status} />
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center">
              <Button
                className="w-full sm:flex-1"
                variant="default"
                onClick={() => handleDownloadPdf(apt)}
                disabled={downloadingId === apt._id}
              >
                {downloadingId === apt._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download confirmation PDF
              </Button>
              {apt.status === "Confirmed" && (
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={() => cancel(apt._id)}
                  disabled={cancelling === apt._id}
                >
                  {cancelling === apt._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Cancel booking"
                  )}
                </Button>
              )}
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5 shrink-0" />
              PDF includes your name, centre, visit date, time period, reference number, and
              booking status.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized =
    status === "Confirmed" || status === "confirmed"
      ? "Confirmed"
      : status === "Cancelled" || status === "cancelled"
        ? "Cancelled"
        : "Pending";

  const styles: Record<string, string> = {
    Confirmed: "bg-secondary/10 text-secondary",
    Pending: "bg-amber-500/10 text-amber-600",
    Cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-medium sm:self-center",
        styles[normalized],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {normalized}
    </span>
  );
}
