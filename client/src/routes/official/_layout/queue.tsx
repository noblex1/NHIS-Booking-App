import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  officialAppointmentsApi,
  OfficialApiError,
  OfficialAppointment,
} from "@/lib/official-api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Search,
  UserCheck,
  CheckCircle2,
  XCircle,
  Filter,
  X,
  RotateCcw,
} from "lucide-react";
import { getServiceTypeLabel } from "@/lib/nhis-services";
import { getSlotPeriodLabel, SLOT_PERIODS, type SlotPeriodId } from "@/lib/slot-periods";
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/nhis-application";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type QueueSearch = {
  status?: string;
  serviceType?: string;
  timeSlot?: string;
  date?: string;
  q?: string;
};

const todayStr = () => format(new Date(), "yyyy-MM-dd");

export const Route = createFileRoute("/official/_layout/queue")({
  validateSearch: (search: Record<string, unknown>): QueueSearch => ({
    status: typeof search.status === "string" ? search.status : undefined,
    serviceType: typeof search.serviceType === "string" ? search.serviceType : undefined,
    timeSlot: typeof search.timeSlot === "string" ? search.timeSlot : undefined,
    date: typeof search.date === "string" ? search.date : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: OfficialQueuePage,
});

function statusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-secondary/10 text-secondary";
    case "at_centre":
      return "bg-primary/10 text-primary";
    case "cancelled":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-amber-500/10 text-amber-700";
  }
}

function OfficialQueuePage() {
  const navigate = useNavigate({ from: Route.id });
  const urlSearch = Route.useSearch();

  const [date, setDate] = useState(urlSearch.date || todayStr());
  const [statusFilter, setStatusFilter] = useState(urlSearch.status || "all");
  const [serviceFilter, setServiceFilter] = useState(urlSearch.serviceType || "all");
  const [timeSlotFilter, setTimeSlotFilter] = useState(urlSearch.timeSlot || "all");
  const [search, setSearch] = useState(urlSearch.q || "");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [refLookup, setRefLookup] = useState("");
  const [appointments, setAppointments] = useState<OfficialAppointment[]>([]);
  const [meta, setMeta] = useState({ total: 0, totalForDate: 0 });
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [completeTarget, setCompleteTarget] = useState<OfficialAppointment | null>(null);

  const hasActiveFilters = useMemo(
    () =>
      statusFilter !== "all" ||
      serviceFilter !== "all" ||
      timeSlotFilter !== "all" ||
      debouncedSearch.trim() !== "" ||
      date !== todayStr(),
    [statusFilter, serviceFilter, timeSlotFilter, debouncedSearch, date],
  );

  useEffect(() => {
    navigate({
      search: {
        date: date !== todayStr() ? date : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        serviceType: serviceFilter !== "all" ? serviceFilter : undefined,
        timeSlot: timeSlotFilter !== "all" ? timeSlotFilter : undefined,
        q: debouncedSearch.trim() || undefined,
      },
      replace: true,
    });
  }, [date, statusFilter, serviceFilter, timeSlotFilter, debouncedSearch, navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await officialAppointmentsApi.getForDate({
        date,
        applicationStatus: statusFilter,
        serviceType: serviceFilter,
        timeSlot: timeSlotFilter,
        search: debouncedSearch.trim() || undefined,
      });
      setAppointments(res.appointments);
      setMeta({
        total: res.meta?.total ?? res.appointments.length,
        totalForDate: res.meta?.totalForDate ?? res.appointments.length,
      });
    } catch (e) {
      if (e instanceof OfficialApiError) toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [date, statusFilter, serviceFilter, timeSlotFilter, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const clearFilters = () => {
    setDate(todayStr());
    setStatusFilter("all");
    setServiceFilter("all");
    setTimeSlotFilter("all");
    setSearch("");
    navigate({ search: {}, replace: true });
  };

  const handleLookup = async () => {
    if (!refLookup.trim()) return;
    setActingId("lookup");
    try {
      const res = await officialAppointmentsApi.lookup(refLookup.trim());
      const apt = res.appointment;
      const aptDate = apt.date?.slice(0, 10);
      if (aptDate && aptDate !== date) {
        setDate(aptDate);
        toast.info(`Showing bookings for ${aptDate}`);
      }
      setAppointments((prev) => {
        const exists = prev.some((a) => a._id === apt._id);
        if (exists) return prev;
        return [apt, ...prev];
      });
      toast.success("Booking found");
      setRefLookup("");
    } catch (e) {
      if (e instanceof OfficialApiError) toast.error(e.message);
    } finally {
      setActingId(null);
    }
  };

  const checkIn = async (apt: OfficialAppointment) => {
    setActingId(apt._id);
    try {
      await officialAppointmentsApi.checkIn(apt._id);
      toast.success(`${apt.userId?.fullName || "Applicant"} checked in`);
      await load();
    } catch (e) {
      if (e instanceof OfficialApiError) toast.error(e.message);
    } finally {
      setActingId(null);
    }
  };

  const complete = async () => {
    if (!completeTarget) return;
    setActingId(completeTarget._id);
    try {
      await officialAppointmentsApi.updateApplication(completeTarget._id, {
        applicationStatus: "completed",
      });
      toast.success("Application marked completed");
      setCompleteTarget(null);
      await load();
    } catch (e) {
      if (e instanceof OfficialApiError) toast.error(e.message);
    } finally {
      setActingId(null);
    }
  };

  const cancelApp = async (apt: OfficialAppointment) => {
    if (!confirm("Cancel this application?")) return;
    setActingId(apt._id);
    try {
      await officialAppointmentsApi.updateApplication(apt._id, {
        applicationStatus: "cancelled",
      });
      toast.success("Application cancelled");
      await load();
    } catch (e) {
      if (e instanceof OfficialApiError) toast.error(e.message);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Today&apos;s queue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Check in applicants and process registrations & renewals
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">
            {loading ? "…" : `${meta.total} shown`}
          </Badge>
          <span>·</span>
          <span>{meta.totalForDate} total for selected date</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label>Find by reference</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. NHIS-TECH-20250525-ABC"
              value={refLookup}
              onChange={(e) => setRefLookup(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            />
            <Button variant="secondary" onClick={handleLookup} disabled={actingId === "lookup"}>
              {actingId === "lookup" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find"}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4 text-muted-foreground" />
            Filters
          </div>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-3.5 w-3.5" />
                Clear all
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RotateCcw className={cn("mr-1 h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => setDate(todayStr())}
              >
                Today
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Application status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="submitted">Submitted online</SelectItem>
                <SelectItem value="at_centre">At centre</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Service type</Label>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                <SelectItem value="new_registration">New registration</SelectItem>
                <SelectItem value="renewal">Card update / renewal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time slot</Label>
            <Select value={timeSlotFilter} onValueChange={setTimeSlotFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All slots" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time slots</SelectItem>
                {(Object.keys(SLOT_PERIODS) as SlotPeriodId[]).map((id) => (
                  <SelectItem key={id} value={id}>
                    {SLOT_PERIODS[id].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Name, email, NHIS no., ref…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {hasActiveFilters && !loading && (
          <p className="text-xs text-muted-foreground">
            Showing {meta.total} of {meta.totalForDate} bookings for{" "}
            {format(new Date(date + "T12:00:00"), "MMM d, yyyy")}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
            <p>No bookings match your filters</p>
            {hasActiveFilters && (
              <Button variant="link" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt._id}>
                  <TableCell className="font-mono text-xs text-primary">
                    {apt.referenceNumber || "—"}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      {apt.beneficiaryName || apt.userId?.fullName || "—"}
                    </p>
                    {apt.beneficiaryName && (
                      <p className="text-xs text-muted-foreground">
                        Booked by: {apt.userId?.fullName}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">{apt.userId?.email}</p>
                    {apt.userId?.nhisNumber && (
                      <p className="text-xs text-muted-foreground">
                        NHIS: {apt.userId.nhisNumber}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{getServiceTypeLabel(apt.serviceType)}</TableCell>
                  <TableCell className="text-sm">{getSlotPeriodLabel(apt.timeSlot)}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        statusBadgeClass(apt.applicationStatus),
                      )}
                    >
                      {APPLICATION_STATUS_LABELS[apt.applicationStatus as ApplicationStatus] ||
                        apt.applicationStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {apt.applicationStatus === "submitted" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actingId === apt._id}
                          onClick={() => checkIn(apt)}
                        >
                          {actingId === apt._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <UserCheck className="h-3 w-3" />
                          )}
                          Check in
                        </Button>
                      )}
                      {(apt.applicationStatus === "submitted" ||
                        apt.applicationStatus === "at_centre") && (
                        <Button
                          size="sm"
                          disabled={actingId === apt._id}
                          onClick={() => setCompleteTarget(apt)}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Complete
                        </Button>
                      )}
                      {apt.applicationStatus !== "completed" &&
                        apt.applicationStatus !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={actingId === apt._id}
                            onClick={() => cancelApp(apt)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!completeTarget} onOpenChange={(o) => !o && setCompleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete application</DialogTitle>
            <DialogDescription>
              Mark {completeTarget?.userId?.fullName}&apos;s application as completed.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will update the application status to completed and assign an NHIS number if needed.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteTarget(null)}>
              Cancel
            </Button>
            <Button onClick={complete} disabled={!!actingId}>
              {actingId ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark completed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
