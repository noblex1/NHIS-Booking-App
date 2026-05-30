import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { officialDashboardApi, OfficialApiError } from "@/lib/official-api-client";
import { useOfficialStore, getOfficialCentreName } from "@/lib/official-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ClipboardList, UserCheck, Users, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/official/_layout/dashboard")({
  component: OfficialDashboardPage,
});

function OfficialDashboardPage() {
  const { official } = useOfficialStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalToday: 0,
    awaitingCheckIn: 0,
    atCentre: 0,
    completed: 0,
  });

  useEffect(() => {
    setLoading(true);
    officialDashboardApi
      .getStats(selectedDate)
      .then((res) => setStats(res.stats))
      .catch((e) => {
        if (e instanceof OfficialApiError) toast.error(e.message);
      })
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const cards = [
    {
      label: "Total bookings",
      value: stats.totalToday,
      icon: Users,
      color: "text-primary",
      queueSearch: { date: selectedDate } as const,
    },
    {
      label: "Awaiting check-in",
      value: stats.awaitingCheckIn,
      icon: ClipboardList,
      color: "text-amber-600",
      queueSearch: { date: selectedDate, status: "submitted" as const },
    },
    {
      label: "At centre now",
      value: stats.atCentre,
      icon: UserCheck,
      color: "text-secondary",
      queueSearch: { date: selectedDate, status: "at_centre" as const },
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-secondary",
      queueSearch: { date: selectedDate, status: "completed" as const },
    },
  ];

  const displayDate = format(new Date(selectedDate + "T12:00:00"), "EEEE, MMMM d, yyyy");
  const isToday = selectedDate === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {getOfficialCentreName(official)} · {displayDate}
            {!isToday && " (selected date)"}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor="dashboard-date" className="text-xs">
              View stats for
            </Label>
            <div className="flex gap-2">
              <Input
                id="dashboard-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[160px]"
              />
              {!isToday && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}
                >
                  Today
                </Button>
              )}
            </div>
          </div>
          <Link to="/official/queue" search={{ date: selectedDate }}>
            <Button>
              <ClipboardList className="h-4 w-4" />
              Open queue
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.label}
              to="/official/queue"
              search={c.queueSearch}
              className="block transition-opacity hover:opacity-90"
            >
              <Card className="h-full cursor-pointer hover:border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {c.label}
                  </CardTitle>
                  <c.icon className={`h-4 w-4 ${c.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{c.value}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Tap to view in queue →
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Queue search & filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            On <strong className="text-foreground">Today&apos;s queue</strong> you can filter by date,
            application status, service type (new registration vs renewal), and time slot. Search
            matches name, email, NHIS number, reference, or beneficiary name — results update as you
            type.
          </p>
          <Link to="/official/queue">
            <Button variant="secondary" size="sm">
              Go to queue with filters
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What you can do here</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• View everyone booked for a selected date at your centre</p>
          <p>• Tap a stat card to open the queue with that filter applied</p>
          <p>• Check in applicants when they arrive (reference number or queue)</p>
          <p>• Mark applications as complete when processing is done</p>
        </CardContent>
      </Card>
    </div>
  );
}
