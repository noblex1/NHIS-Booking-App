import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminUsersApi, AdminApiError } from "@/lib/admin-api-client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Calendar,
  User,
  Shield,
  Edit,
  Save,
  X,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/_layout/users/$userId")({
  head: () => ({
    meta: [
      { title: "User Details - NHIS Admin" },
      { name: "description", content: "View and manage user details" },
    ],
  }),
  component: UserDetailPage,
});

const userSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  isVerified: z.boolean(),
});

type UserForm = z.infer<typeof userSchema>;

function UserDetailPage() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  const isVerified = watch("isVerified");

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await adminUsersApi.getById(userId);
      setUser(response.user);
      setAppointments(response.appointments || []);
      
      // Set form values
      reset({
        fullName: response.user.fullName,
        email: response.user.email,
        dateOfBirth: response.user.dateOfBirth.split("T")[0],
        isVerified: response.user.isVerified,
      });
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error("Failed to load user details");
        navigate({ to: "/admin/users" });
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserForm) => {
    setSaving(true);
    try {
      await adminUsersApi.update(userId, data);
      toast.success("User updated successfully");
      setEditing(false);
      fetchUserDetails();
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminUsersApi.delete(userId);
      toast.success("User deleted successfully");
      navigate({ to: "/admin/users" });
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error(error.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        dateOfBirth: user.dateOfBirth.split("T")[0],
        isVerified: user.isVerified,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status !== "Cancelled" && new Date(apt.date) >= new Date()
  );
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.date) < new Date()
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/admin/users" })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{user.fullName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              User ID: {user._id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          icon={Calendar}
        />
        <StatCard
          title="Upcoming"
          value={upcomingAppointments.length}
          icon={Clock}
          variant="secondary"
        />
        <StatCard
          title="Completed"
          value={pastAppointments.length}
          icon={CheckCircle}
          variant="accent"
        />
        <StatCard
          title="Status"
          value={user.isVerified ? "Verified" : "Unverified"}
          icon={Shield}
          variant={user.isVerified ? "secondary" : "warning"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    disabled={!editing}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      {...register("email")}
                      disabled={!editing}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    disabled={!editing}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-destructive">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="isVerified">Verified Status</Label>
                    <p className="text-sm text-muted-foreground">
                      User email verification status
                    </p>
                  </div>
                  <Switch
                    id="isVerified"
                    checked={isVerified}
                    onCheckedChange={(checked) => setValue("isVerified", checked)}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(user.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(user.updatedAt), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appointments History</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No appointments yet
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Upcoming Appointments */}
                  {upcomingAppointments.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-foreground">
                        Upcoming ({upcomingAppointments.length})
                      </h3>
                      <div className="space-y-2">
                        {upcomingAppointments.map((apt) => (
                          <AppointmentCard key={apt._id} appointment={apt} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Past Appointments */}
                  {pastAppointments.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-foreground">
                        Past ({pastAppointments.length})
                      </h3>
                      <div className="space-y-2">
                        {pastAppointments.slice(0, 5).map((apt) => (
                          <AppointmentCard key={apt._id} appointment={apt} isPast />
                        ))}
                      </div>
                      {pastAppointments.length > 5 && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          And {pastAppointments.length - 5} more past appointments
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{user.fullName}</strong>? This
              action cannot be undone and will also delete all associated appointments
              ({appointments.length} appointments).
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
                "Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  variant = "primary",
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "primary" | "secondary" | "accent" | "warning";
}) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent text-foreground",
    warning: "bg-amber-500/10 text-amber-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[variant]}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentCard({
  appointment,
  isPast = false,
}: {
  appointment: any;
  isPast?: boolean;
}) {
  const statusColors: Record<string, string> = {
    Confirmed: "bg-secondary/10 text-secondary",
    Pending: "bg-amber-500/10 text-amber-600",
    Cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-border p-3",
        isPast && "opacity-60"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            statusColors[appointment.status] || "bg-accent"
          )}
        >
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-foreground">
            {format(new Date(appointment.date), "MMMM d, yyyy")}
          </p>
          <p className="text-sm text-muted-foreground">{appointment.timeSlot}</p>
        </div>
      </div>
      <Badge
        variant="secondary"
        className={cn(
          "rounded-full",
          statusColors[appointment.status] || "bg-accent"
        )}
      >
        {appointment.status}
      </Badge>
    </div>
  );
}
