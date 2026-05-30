import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { officialDashboardApi, OfficialApiError } from "@/lib/official-api-client";
import { useOfficialStore, getOfficialCentreName } from "@/lib/official-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ClipboardList, UserCheck, Users, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/official/_layout/dashboard")({
  component: OfficialDashboardPage,
});

function OfficialDashboardPage() {
  const { official } = useOfficialStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalToday: 0,
    awaitingCheckIn: 0,
    atCentre: 0,
    completed: 0,
  });

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    officialDashboardApi
      .getStats(today)
      .then((res) => setStats(res.stats))
      .catch((e) => {
        if (e instanceof OfficialApiError) toast.error(e.message);
      })
      .finally(() => setLoading(false));
  }, [today]);

  const cards = [
    {
      label: "Total bookings today",
      value: stats.totalToday,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Awaiting check-in",
      value: stats.awaitingCheckIn,
      icon: ClipboardList,
      color: "text-amber-600",
    },
    {
      label: "At centre now",
      value: stats.atCentre,
      icon: UserCheck,
      color: "text-secondary",
    },
    {
      label: "Completed today",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-secondary",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {getOfficialCentreName(official)} · {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Link to="/official/queue">
          <Button>
            <ClipboardList className="h-4 w-4" />
            Open today&apos;s queue
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {c.label}
                </CardTitle>
                <c.icon className={`h-4 w-4 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{c.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What you can do here</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• View everyone booked for today at your centre</p>
          <p>• Check in applicants when they arrive (reference number or queue)</p>
          <p>• Mark applications as complete when processing is done</p>
          <p>• You cannot change system settings, other centres, or user accounts</p>
        </CardContent>
      </Card>
    </div>
  );
}
