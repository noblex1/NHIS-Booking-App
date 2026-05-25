import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  CalendarCheck,
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
  centresApi,
  ApiError,
  type NhisServiceType,
  type ServiceCentre,
} from "@/lib/api-client";
import { NHIS_SERVICES } from "@/lib/nhis-services";
import {
  DOCUMENT_REQUIREMENTS,
  SERVICE_FEES,
} from "@/lib/nhis-application";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book centre visit - NHIS" },
      {
        name: "description",
        content: "Book NHIS registration or renewal at an NHIA service centre.",
      },
    ],
  }),
  component: BookPage,
});

const STEPS = ["Service", "Centre", "Documents", "Schedule", "Review"] as const;
const ALL_TIME_SLOTS = [
  "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
  "11:30 AM", "12:00 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM",
];

function BookPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState<NhisServiceType>("renewal");
  const [centres, setCentres] = useState<ServiceCentre[]>([]);
  const [centreId, setCentreId] = useState<string | null>(null);
  const [docAck, setDocAck] = useState<Set<string>>(new Set());
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<string | null>(null);
  const [feePaymentReference, setFeePaymentReference] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [done, setDone] = useState(false);
  const [lastReference, setLastReference] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [openDates, setOpenDates] = useState<Set<string>>(new Set());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const documents = DOCUMENT_REQUIREMENTS[serviceType];
  const fee = SERVICE_FEES[serviceType];
  const selectedCentre = centres.find((c) => c._id === centreId);

  const requiredDocIds = useMemo(
    () => documents.filter((d) => d.required).map((d) => d.id),
    [documents],
  );

  const allRequiredAcked = requiredDocIds.every((id) => docAck.has(id));

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  useEffect(() => {
    centresApi.list().then((r) => setCentres(r.centres)).catch(() => toast.error("Failed to load centres"));
  }, []);

  useEffect(() => {
    const from = format(startOfMonth(calendarMonth), "yyyy-MM-dd");
    const to = format(endOfMonth(addMonths(calendarMonth, 1)), "yyyy-MM-dd");
    appointmentsApi.getBookingSchedule(from, to).then((r) => {
      setBlockedDates(new Set(r.blockedDates));
      setOpenDates(new Set(r.openDates));
    });
  }, [calendarMonth]);

  useEffect(() => {
    if (!date || !centreId) {
      setAvailableSlots([]);
      setBookedSlots([]);
      return;
    }
    setLoadingSlots(true);
    appointmentsApi
      .getAvailableSlots(format(date, "yyyy-MM-dd"), centreId)
      .then((r) => {
        setAvailableSlots(r.availableSlots);
        setBookedSlots(r.bookedSlots);
        if (r.dateUnavailable) setSlot(null);
      })
      .catch(() => toast.error("Failed to load slots"))
      .finally(() => setLoadingSlots(false));
  }, [date, centreId]);

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return !!centreId;
    if (step === 2) return allRequiredAcked;
    if (step === 3) return !!date && !!slot;
    return true;
  };

  const handleConfirm = async () => {
    if (!date || !slot || !centreId) return;
    setConfirming(true);
    try {
      const response = await appointmentsApi.createAppointment({
        date: format(date, "yyyy-MM-dd"),
        timeSlot: slot,
        serviceType,
        centreId,
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8 md:py-8 sm:px-6">
      <div>
        <p className="text-sm font-medium text-primary">New application</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-4xl">Book NHIS centre visit</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
        <div className="mt-4 flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={STEPS[i]}
              className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-border")}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-8">
        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(NHIS_SERVICES) as NhisServiceType[]).map((key) => {
              const service = NHIS_SERVICES[key];
              const Icon = key === "new_registration" ? FilePlus2 : RefreshCw;
              const active = serviceType === key;
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
                    active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                  )}
                >
                  <Icon className="mb-2 h-6 w-6 text-primary" />
                  <p className="font-semibold">{service.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{service.description}</p>
                  <p className="mt-2 text-xs font-medium text-secondary">
                    Fee: {SERVICE_FEES[key] > 0 ? `GHS ${SERVICE_FEES[key]}` : "Free"}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {centres.length === 0 ? (
              <p className="text-sm text-muted-foreground">No centres available. Contact support.</p>
            ) : (
              centres.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => setCentreId(c._id)}
                  className={cn(
                    "flex w-full gap-3 rounded-xl border p-4 text-left",
                    centreId === c._id ? "border-primary bg-primary/5" : "border-border",
                  )}
                >
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.address}, {c.city}</p>
                    <p className="text-xs text-muted-foreground">{c.region} · {c.code}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Confirm you will bring these documents to the centre (passport-style checklist):
            </p>
            {documents.map((doc) => (
              <label
                key={doc.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3"
              >
                <Checkbox
                  checked={docAck.has(doc.id)}
                  onCheckedChange={(checked) => {
                    setDocAck((prev) => {
                      const next = new Set(prev);
                      if (checked) next.add(doc.id);
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

        {step === 3 && (
          <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
            <div>
              <h2 className="mb-2 text-sm font-semibold">Date</h2>
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
              <h2 className="mb-2 text-sm font-semibold">Time slot</h2>
              {!date ? (
                <p className="text-sm text-muted-foreground">Select a date first</p>
              ) : loadingSlots ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ALL_TIME_SLOTS.map((s) => {
                    const disabled = bookedSlots.includes(s) || !availableSlots.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSlot(s)}
                        className={cn(
                          "rounded-lg border px-2 py-2 text-sm",
                          slot === s && "border-primary bg-primary text-primary-foreground",
                          disabled && "opacity-40 line-through",
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-sm">
            <SummaryRow label="Service" value={NHIS_SERVICES[serviceType].label} />
            <SummaryRow label="Centre" value={selectedCentre?.name || "—"} />
            <SummaryRow label="Date" value={date ? format(date, "PPP") : "—"} />
            <SummaryRow label="Time" value={slot || "—"} />
            <SummaryRow label="Fee" value={fee > 0 ? `GHS ${fee}` : "No fee"} />
            {fee > 0 && (
              <div>
                <Label htmlFor="payRef">Payment reference (optional)</Label>
                <Input
                  id="payRef"
                  placeholder="e.g. mobile money transaction ID"
                  value={feePaymentReference}
                  onChange={(e) => setFeePaymentReference(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            disabled={!canNext()}
            onClick={() => {
              if (!canNext()) {
                toast.error("Complete this step first");
                return;
              }
              setStep((s) => s + 1);
            }}
          >
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
                  <br />
                  Status: Submitted online — bring documents to your centre visit.
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
                <DialogDescription>
                  Your application will be recorded as submitted. Attend the centre on your
                  booked date with all required documents.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
