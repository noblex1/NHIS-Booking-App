import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminDashboardApi, AdminApiError, DashboardStats } from "@/lib/admin-api-client";
import { toast } from "sonner";
import {
  Users,
  Calendar,
  CheckCircle,
  UserCog,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/_layout/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard - NHIS Booking" },
      { name: "description", content: "Admin dashboard overview" },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminDashboardApi.getStats();
        setStats(response.stats);
      } catch (error) {
        if (error instanceof AdminApiError) {
          toast.error("Failed to load dashboard stats");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your NHIS booking system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          subtitle={`${stats.users.verified} verified`}
          icon={Users}
          trend={`+${stats.users.newThisMonth} this month`}
        />
        <StatCard
          title="Total Appointments"
          value={stats.appointments.total}
          subtitle={`${stats.appointments.confirmed} confirmed`}
          icon={Calendar}
          trend={`${stats.appointments.today} today`}
        />
        <StatCard
          title="Upcoming"
          value={stats.appointments.upcoming}
          subtitle="Active bookings"
          icon={Clock}
          variant="secondary"
        />
        <StatCard
          title="NHIS Officials"
          value={stats.officials.total}
          subtitle={`${stats.officials.active} active`}
          icon={UserCog}
          variant="accent"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent.users.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent users</p>
              ) : (
                stats.recent.users.map((user: any) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </p>
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-secondary">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600">Pending</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent.appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent appointments</p>
              ) : (
                stats.recent.appointments.map((apt: any) => (
                  <div
                    key={apt._id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {apt.userId?.fullName || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(apt.date), "MMM d, yyyy")} at {apt.timeSlot}
                      </p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appointment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.appointments.byStatus.map((item: any) => (
              <div
                key={item._id}
                className="rounded-lg border border-border bg-accent/50 p-4 text-center"
              >
                <p className="text-2xl font-bold text-foreground">{item.count}</p>
                <p className="text-sm text-muted-foreground">{item._id}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "primary",
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  variant?: "primary" | "secondary" | "accent";
}) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent text-foreground",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
            {trend && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-secondary">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[variant]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] || "bg-accent text-foreground"}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
