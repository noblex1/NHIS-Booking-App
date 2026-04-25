import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { authStore, useAuthStore } from "@/lib/auth-store";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Appointment — NHIS Booking" },
      { name: "description", content: "Choose a date and time slot for your appointment." },
    ],
  }),
  component: BookPage,
});

const TIME_SLOTS = [
  "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM",
  "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM",
];
// Some pre-disabled slots for realism
const UNAVAILABLE = new Set(["09:00 AM", "11:00 AM", "02:00 PM"]);

function BookPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  const handleConfirm = async () => {
    if (!date || !slot) return;
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 900));
    authStore.addAppointment({
      id: crypto.randomUUID(),
      date: date.toISOString(),
      time: slot,
      status: "Confirmed",
    });
    setConfirming(false);
    setDone(true);
    toast.success("Appointment confirmed!");
  };

  const open = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    if (!slot) {
      toast.error("Please select a time slot");
      return;
    }
    setShowModal(true);
    setDone(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <p className="text-sm font-medium text-primary">Booking</p>
        <h1 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
          Book an appointment
        </h1>
        <p className="mt-2 text-muted-foreground">
          Choose a date and an available time slot.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[auto_1fr]">
        {/* Calendar */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Select date</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setSlot(null);
            }}
            disabled={(d) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return d < today || d.getDay() === 0;
            }}
            className={cn("p-0 pointer-events-auto")}
          />
        </div>

        {/* Slots */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Time slots</h2>
            {date && (
              <span className="text-xs text-muted-foreground">
                {format(date, "EEEE, MMM d")}
              </span>
            )}
          </div>

          {!date ? (
            <div className="mt-10 flex flex-col items-center justify-center text-center text-muted-foreground">
              <CalendarCheck className="h-10 w-10 opacity-40" />
              <p className="mt-2 text-sm">Select a date to see available slots</p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map((s) => {
                const disabled = UNAVAILABLE.has(s);
                const active = slot === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSlot(s)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                      disabled &&
                        "cursor-not-allowed border-border bg-muted text-muted-foreground/50 line-through",
                      !disabled &&
                        !active &&
                        "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5",
                      active &&
                        "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-card)]",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {date && slot ? (
                <>
                  Selected:{" "}
                  <span className="font-medium text-foreground">
                    {format(date, "MMM d")} at {slot}
                  </span>
                </>
              ) : (
                "No selection yet"
              )}
            </div>
            <Button size="lg" onClick={open} disabled={!date || !slot}>
              Confirm Appointment
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          {done ? (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
                  <CheckCircle2 className="h-7 w-7 text-secondary" />
                </div>
                <DialogTitle className="text-center">Appointment Confirmed</DialogTitle>
                <DialogDescription className="text-center">
                  We've booked your visit for{" "}
                  <span className="font-medium text-foreground">
                    {date && format(date, "EEEE, MMM d")} at {slot}
                  </span>
                  .
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center gap-2">
                <Button variant="outline" onClick={() => navigate({ to: "/appointments" })}>
                  View Appointments
                </Button>
                <Button onClick={() => navigate({ to: "/dashboard" })}>
                  Back to Dashboard
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Confirm your appointment</DialogTitle>
                <DialogDescription>
                  {date && format(date, "EEEE, MMMM d")} at {slot}. Please confirm to proceed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowModal(false)} disabled={confirming}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={confirming}>
                  {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
