import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
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
import { Loader2, Search, UserCheck, CheckCircle2, XCircle } from "lucide-react";
import { getServiceTypeLabel } from "@/lib/nhis-services";
import { getSlotPeriodLabel } from "@/lib/slot-periods";
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/nhis-application";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/official/_layout/queue")({
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
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [refLookup, setRefLookup] = useState("");
  const [appointments, setAppointments] = useState<OfficialAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [completeTarget, setCompleteTarget] = useState<OfficialAppointment | null>(null);
  const [nhisInput, setNhisInput] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await officialAppointmentsApi.getForDate({
        date,
        applicationStatus: statusFilter === "all" ? undefined : statusFilter,
        search: search.trim() || undefined,
      });
      setAppointments(res.appointments);
    } catch (e) {
      if (e instanceof OfficialApiError) toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [date, statusFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLookup = async () => {
    if (!refLookup.trim()) return;
    setActingId("lookup");
    try {
      const res = await officialAppointmentsApi.lookup(refLookup.trim());
      setAppointments((prev) => {
        const exists = prev.some((a) => a._id === res.appointment._id);
        if (exists) return prev;
        return [res.appointment, ...prev];
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Today&apos;s queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Check in applicants and process registrations & renewals
        </p>
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

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-[180px]" />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
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
        <div className="relative flex-1 min-w-[200px] space-y-2">
          <Label>Search name / email</Label>
          <Search className="absolute left-3 top-[34px] h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
        </div>
        <Button onClick={load} variant="secondary">
          Refresh
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            No bookings for this date and filters
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
                    <p className="font-medium">{apt.userId?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{apt.userId?.email}</p>
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
                          onClick={() => {
                            setCompleteTarget(apt);
                          }}
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
              Mark {completeTarget?.userId?.fullName}'s application as completed.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will update the application status to completed and notify the applicant.
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
