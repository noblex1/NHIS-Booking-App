import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminAppointmentsApi, AdminApiError, Appointment } from "@/lib/admin-api-client";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { exportAppointmentsToCSV } from "@/lib/export-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getServiceTypeLabel } from "@/lib/nhis-services";
import { getSlotPeriodLabel } from "@/lib/slot-periods";
import { APPLICATION_STATUS_LABELS } from "@/lib/nhis-application";

export const Route = createFileRoute("/admin/_layout/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments Management - NHIS Admin" },
      { name: "description", content: "Manage NHIS appointments" },
    ],
  }),
  component: AppointmentsManagementPage,
});

function AppointmentsManagementPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await adminAppointmentsApi.getAll({
        page,
        limit: 20,
        search,
        status: status === "all" ? undefined : status,
      });
      setAppointments(response.appointments);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error("Failed to load appointments");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, status]);

  const handleSearch = () => {
    setPage(1);
    fetchAppointments();
  };

  const handleApplicationStatusChange = async (id: string, applicationStatus: string) => {
    setUpdatingStatus(id);
    try {
      await adminAppointmentsApi.updateApplication(id, { applicationStatus });
      toast.success("Application status updated");
      fetchAppointments();
    } catch (error) {
      if (error instanceof AdminApiError) toast.error(error.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingStatus(id);
    try {
      await adminAppointmentsApi.updateStatus(id, newStatus);
      toast.success("Appointment status updated");
      fetchAppointments();
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error(error.message);
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await adminAppointmentsApi.getAll({
        page: 1,
        limit: 1000,
        search,
        status: status === "all" ? undefined : status,
      });
      if (response.appointments.length === 0) {
        toast.error("No appointments to export");
        return;
      }
      exportAppointmentsToCSV(response.appointments);
      toast.success(`Exported ${response.appointments.length} appointments`);
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error(error.message);
      } else {
        toast.error("Export failed");
      }
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await adminAppointmentsApi.delete(deleteId);
      toast.success("Appointment deleted successfully");
      setDeleteId(null);
      fetchAppointments();
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error(error.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Centre bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            NHIS registration and renewal visits at service centres
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={exporting}>
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">
            Search
          </Button>
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No appointments found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt) => (
                  <TableRow key={apt._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{apt.userId?.fullName || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{apt.userId?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {apt.referenceNumber || "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {getServiceTypeLabel(apt.serviceType)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={apt.applicationStatus || "submitted"}
                        onValueChange={(v) => handleApplicationStatusChange(apt._id, v)}
                        disabled={updatingStatus === apt._id}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(apt.date), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {getSlotPeriodLabel(apt.timeSlot)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={apt.status}
                        onValueChange={(value) => handleStatusChange(apt._id, value)}
                        disabled={updatingStatus === apt._id}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue>
                            <StatusBadge status={apt.status} />
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(apt.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(apt._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Confirmed: "bg-secondary/10 text-secondary",
    Pending: "bg-amber-500/10 text-amber-600",
    Cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        colors[status] || "bg-accent text-foreground",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
