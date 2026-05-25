import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  adminScheduleApi,
  AdminApiError,
  BookingScheduleRule,
} from "@/lib/admin-api-client";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, CalendarOff, CalendarCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/_layout/availability")({
  head: () => ({
    meta: [
      { title: "Booking Availability - NHIS Admin" },
      { name: "description", content: "Manage bookable appointment dates" },
    ],
  }),
  component: AvailabilityPage,
});

function AvailabilityPage() {
  const [month, setMonth] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Date | undefined>();
  const [rules, setRules] = useState<BookingScheduleRule[]>([]);
  const [blockedSet, setBlockedSet] = useState<Set<string>>(new Set());
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const range = useMemo(() => {
    const from = startOfMonth(month);
    const to = endOfMonth(addMonths(month, 1));
    return {
      from: format(from, "yyyy-MM-dd"),
      to: format(to, "yyyy-MM-dd"),
    };
  }, [month]);

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminScheduleApi.getRange(range.from, range.to);
      setRules(response.rules);
      setBlockedSet(new Set(response.blockedDates));
      setOpenSet(new Set(response.openDates));
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error("Failed to load schedule");
      }
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : null;
  const selectedRule = selectedKey
    ? rules.find((rule) => rule.date === selectedKey)
    : undefined;

  const applyRule = async (type: "blocked" | "open") => {
    if (!selectedKey) {
      toast.error("Select a date on the calendar first");
      return;
    }

    setSaving(true);
    try {
      await adminScheduleApi.setRule({
        date: selectedKey,
        type,
        reason: reason.trim(),
      });
      toast.success(
        type === "blocked"
          ? "Date marked unavailable for booking"
          : "Date marked open for booking",
      );
      await loadSchedule();
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const clearRule = async () => {
    if (!selectedKey) return;

    setSaving(true);
    try {
      await adminScheduleApi.removeRule(selectedKey);
      toast.success("Date reset to default rules");
      setReason("");
      await loadSchedule();
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const upcomingRules = [...rules].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Booking Availability</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Block centre closure dates or open extra days (e.g. Sundays). Citizens only see
          bookable dates when scheduling registration or renewal visits.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              month={month}
              onMonthChange={setMonth}
              modifiers={{
                blocked: (date) => blockedSet.has(format(date, "yyyy-MM-dd")),
                open: (date) => openSet.has(format(date, "yyyy-MM-dd")),
              }}
              modifiersClassNames={{
                blocked: "bg-destructive/15 text-destructive font-semibold",
                open: "bg-secondary/20 text-secondary font-semibold",
              }}
              className="mx-auto"
            />
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-destructive/15" />
                Unavailable (blocked)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-secondary/20" />
                Open override
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedKey ? format(new Date(selectedKey), "EEEE, MMM d, yyyy") : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedKey ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Default: weekdays are bookable; Sundays are closed unless you mark a date as
                  open.
                </p>
                {selectedRule && (
                  <p className="text-sm">
                    Current rule:{" "}
                    <span
                      className={cn(
                        "font-medium",
                        selectedRule.type === "blocked" ? "text-destructive" : "text-secondary",
                      )}
                    >
                      {selectedRule.type === "blocked" ? "Unavailable" : "Open"}
                    </span>
                    {selectedRule.reason ? ` — ${selectedRule.reason}` : ""}
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="reason">Note (optional)</Label>
                  <Input
                    id="reason"
                    placeholder="e.g. Public holiday, special clinic day"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => applyRule("blocked")}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CalendarOff className="h-4 w-4" />
                    )}
                    Mark unavailable
                  </Button>
                  <Button variant="secondary" onClick={() => applyRule("open")} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CalendarCheck className="h-4 w-4" />
                    )}
                    Mark open
                  </Button>
                  {selectedRule && (
                    <Button variant="outline" onClick={clearRule} disabled={saving}>
                      Reset to default
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click a date to block it or open it for bookings.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scheduled overrides</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingRules.length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom rules in this range.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingRules.map((rule) => (
                  <TableRow key={rule.date}>
                    <TableCell>{format(new Date(rule.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {rule.type === "blocked" ? (
                        <span className="text-destructive">Unavailable</span>
                      ) : (
                        <span className="text-secondary">Open</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{rule.reason || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={async () => {
                          try {
                            await adminScheduleApi.removeRule(rule.date);
                            toast.success("Rule removed");
                            loadSchedule();
                          } catch (error) {
                            if (error instanceof AdminApiError) {
                              toast.error(error.message);
                            }
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
