import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Loader2,
  FilePlus2,
  RefreshCw,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { authStore, useAuthStore } from "@/lib/auth-store";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import {
  appointmentsApi,
  ApiError,
  type NhisServiceType,
  type SlotPeriodAvailability,
  type SlotPeriodId,
} from "@/lib/api-client";
import { NHIS_SERVICES } from "@/lib/nhis-services";
import { DOCUMENT_REQUIREMENTS, SERVICE_FEES } from "@/lib/nhis-application";
import { DEFAULT_CENTRE_NAME } from "@/lib/centre";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book centre visit - NHIS" },
      { name: "description", content: "Book at Techiman Municipal NHIA Service Centre." },
    ],
  }),
  component: BookPage,
});

const STEPS = ["Service", "Documents", "Schedule", "Review"] as const;

function BookPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState<NhisServiceType>("renewal");
  const [docAck, setDocAck] = useState<Set<string>>(new Set());
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<SlotPeriodId | null>(null);
  const [periods, setPeriods] = useState<SlotPeriodAvailability[]>([]);
  const [feePaymentReference, setFeePaymentReference] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [done, setDone] = useState(false);
  const [lastReference, setLastReference] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [openDates, setOpenDates] = useState<Set<string>>(new Set());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const documents = DOCUMENT_REQUIREMENTS[serviceType];
  const fee = SERVICE_FEES[serviceType];
  const requiredDocIds = documents.filter((d) => d.required).map((d) => d.id);
  const allRequiredAcked = requiredDocIds.every((id) => docAck.has(id));

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  useEffect(() => {
    const from = format(startOfMonth(calendarMonth), "yyyy-MM-dd");
    const to = format(endOfMonth(addMonths(calendarMonth, 1)), "yyyy-MM-dd");
    appointmentsApi.getBookingSchedule(from, to).then((r) => {
      setBlockedDates(new Set(r.blockedDates));
      setOpenDates(new Set(r.openDates));
    });
  }, [calendarMonth]);

  useEffect(() => {
    if (!date) {
      setPeriods([]);
      setSlot(null);
      return;
    }
    setLoadingSlots(true);
    appointmentsApi
      .getAvailableSlots(format(date, "yyyy-MM-dd"))
      .then((r) => {
        setPeriods(r.periods || []);
        if (r.dateUnavailable) setSlot(null);
      })
      .catch(() => toast.error("Failed to load time periods"))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return allRequiredAcked;
    if (step === 2) return !!date && !!slot;
    return true;
  };

  const handleConfirm = async () => {
    if (!date || !slot) return;
    setConfirming(true);
    try {
      const response = await appointmentsApi.createAppointment({
        date: format(date, "yyyy-MM-dd"),
        timeSlot: slot,
        serviceType,
        documentsAcknowledged: [...docAck],
        feePaymentReference: feePaymentReference.trim() || undefined,
      });
      authStore.addAppointment(response.appointment);
      setLastReference(response.appointment.referenceNumber);
      setDone(true);
      toast.success("Application submitted!");
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
      else toast.error("Booking failed");
    } finally {
      setConfirming(false);
    }
  };

  if (!user) return null;

  const selectedPeriod = periods.find((p) => p.id === slot);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8 md:py-8 sm:px-6">
      <div>
        <p className="text-sm font-medium text-primary">New application</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-4xl">Book centre visit</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          {DEFAULT_CENTRE_NAME}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-8">
        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(NHIS_SERVICES) as NhisServiceType[]).map((key) => {
              const service = NHIS_SERVICES[key];
              const Icon = key === "new_registration" ? FilePlus2 : RefreshCw;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setServiceType(key);
                    setDocAck(new Set());
                  }}
                  className={cn(
                    "rounded-2xl border p-4 text-left",
                    serviceType === key ? "border-primary bg-primary/5" : "border-border",
                  )}
                >
                  <Icon className="mb-2 h-6 w-6 text-primary" />
                  <p className="font-semibold">{service.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{service.description}</p>
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {documents.map((doc) => (
              <label
                key={doc.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border p-3"
              >
                <Checkbox
                  checked={docAck.has(doc.id)}
                  onCheckedChange={(c) => {
                    setDocAck((prev) => {
                      const next = new Set(prev);
                      if (c) next.add(doc.id);
                      else next.delete(doc.id);
                      return next;
                    });
                  }}
                />
                <span className="text-sm">
                  {doc.label}
                  {doc.required && <span className="text-destructive"> *</span>}
                </span>
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
            <div>
              <h2 className="mb-2 text-sm font-semibold">Visit date</h2>
              <Calendar
                mode="single"
                selected={date}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                onSelect={(d) => {
                  setDate(d);
                  setSlot(null);
                }}
                disabled={(d) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (d < today) return true;
                  const key = format(d, "yyyy-MM-dd");
                  if (blockedDates.has(key)) return true;
                  if (d.getDay() === 0 && !openDates.has(key)) return true;
                  return false;
                }}
              />
            </div>
            <div>
              <h2 className="mb-2 text-sm font-semibold">Time period</h2>
              {!date ? (
                <p className="text-sm text-muted-foreground">Select a date first</p>
              ) : loadingSlots ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="space-y-2">
                  {periods.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      disabled={!p.available}
                      onClick={() => setSlot(p.id as SlotPeriodId)}
                      className={cn(
                        "w-full rounded-xl border p-4 text-left",
                        slot === p.id && "border-primary bg-primary/5",
                        !p.available && "opacity-50",
                      )}
                    >
                      <p className="font-semibold">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.hours}</p>
                      <p className="mt-1 text-xs">
                        {p.available
                          ? `${p.remaining} of ${p.maxSlots} slots left`
                          : "Fully booked"}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm">
            <Row label="Centre" value={DEFAULT_CENTRE_NAME} />
            <Row label="Service" value={NHIS_SERVICES[serviceType].label} />
            <Row label="Date" value={date ? format(date, "PPP") : "—"} />
            <Row
              label="Time"
              value={
                selectedPeriod
                  ? `${selectedPeriod.label} (${selectedPeriod.hours})`
                  : "—"
              }
            />
            <Row label="Fee" value={fee > 0 ? `GHS ${fee}` : "No fee"} />
            {fee > 0 && (
              <div>
                <Label htmlFor="payRef">Payment reference (optional)</Label>
                <Input
                  id="payRef"
                  className="mt-1"
                  value={feePaymentReference}
                  onChange={(e) => setFeePaymentReference(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => setShowModal(true)} disabled={!canNext()}>
            Submit application
          </Button>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          {done ? (
            <>
              <DialogHeader>
                <CheckCircle2 className="mx-auto h-12 w-12 text-secondary" />
                <DialogTitle className="text-center">Application submitted</DialogTitle>
                <DialogDescription className="text-center">
                  Reference: <strong>{lastReference}</strong>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <Button onClick={() => navigate({ to: "/appointments" })}>My bookings</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Confirm submission</DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowModal(false)}>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
