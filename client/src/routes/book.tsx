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
import { appointmentsApi, ApiError } from "@/lib/api-client";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Appointment - NHIS Booking" },
      { name: "description", content: "Choose a date and time slot for your appointment." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [done, setDone] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!date) {
      setAvailableSlots([]);
      setBookedSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const dateStr = format(date, "yyyy-MM-dd");
        const response = await appointmentsApi.getAvailableSlots(dateStr);
        setAvailableSlots(response.availableSlots);
        setBookedSlots(response.bookedSlots);
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error("Failed to load available slots");
        }
        setAvailableSlots([]);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [date]);

  if (!user) return null;

  const handleConfirm = async () => {
    if (!date || !slot) return;
    
    setConfirming(true);
    
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const response = await appointmentsApi.createAppointment({
        date: dateStr,
        timeSlot: slot,
      });

      // Add appointment to local store
      authStore.addAppointment(response.appointment);
      
      setConfirming(false);
      setDone(true);
      toast.success("Appointment confirmed! Check your email for confirmation.");
    } catch (error) {
      setConfirming(false);
      if (error instanceof ApiError) {
        toast.error(error.message);
        
        // If slot is already booked, refresh available slots
        if (error.status === 409) {
          setShowModal(false);
          setSlot(null);
          // Trigger refresh of slots
          if (date) {
            const dateStr = format(date, "yyyy-MM-dd");
            const response = await appointmentsApi.getAvailableSlots(dateStr);
            setAvailableSlots(response.availableSlots);
            setBookedSlots(response.bookedSlots);
          }
        }
      } else {
        toast.error("Failed to book appointment. Please try again.");
      }
    }
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

  // All time slots for display
  const ALL_TIME_SLOTS = [
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <p className="text-sm font-medium text-primary">Booking</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-4xl">Book an appointment</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Choose a date and an available time slot.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-[auto_1fr] lg:gap-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-6">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Select date</h2>
          <div className="mx-auto w-fit">
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
              className={cn("pointer-events-auto p-0")}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-foreground">Time slots</h2>
            {date && <span className="text-xs text-muted-foreground">{format(date, "EEEE, MMM d")}</span>}
          </div>

          {!date ? (
            <div className="mt-8 flex flex-col items-center justify-center text-center text-muted-foreground sm:mt-10">
              <CalendarCheck className="h-10 w-10 opacity-40" />
              <p className="mt-2 text-sm">Select a date to see available slots</p>
            </div>
          ) : loadingSlots ? (
            <div className="mt-8 flex flex-col items-center justify-center text-center sm:mt-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading available slots...</p>
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ALL_TIME_SLOTS.map((s) => {
                  const isBooked = bookedSlots.includes(s);
                  const isAvailable = availableSlots.includes(s);
                  const disabled = isBooked || !isAvailable;
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
                        active && "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-card)]",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              
              {availableSlots.length === 0 && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  No available slots for this date. Please select another date.
                </p>
              )}
            </>
          )}

          <div className="mt-6 flex flex-col gap-3">
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
            <Button size="lg" onClick={open} disabled={!date || !slot || loadingSlots} className="w-full sm:w-auto">
              Confirm Appointment
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[480px]">
          {done ? (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
                  <CheckCircle2 className="h-7 w-7 text-secondary" />
                </div>
                <DialogTitle className="text-center">Appointment Confirmed</DialogTitle>
                <DialogDescription className="text-center">
                  We booked your visit for{" "}
                  <span className="font-medium text-foreground">
                    {date && format(date, "EEEE, MMM d")} at {slot}
                  </span>
                  . A confirmation email has been sent to {user.email}.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:justify-center">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate({ to: "/appointments" })}>
                  View Appointments
                </Button>
                <Button className="w-full sm:w-auto" onClick={() => navigate({ to: "/dashboard" })}>
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
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setShowModal(false)}
                  disabled={confirming}
                >
                  Cancel
                </Button>
                <Button className="w-full sm:w-auto" onClick={handleConfirm} disabled={confirming}>
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
