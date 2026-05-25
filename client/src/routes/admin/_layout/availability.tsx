import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  adminScheduleApi,
  adminSlotCapacityApi,
  AdminApiError,
  BookingScheduleRule,
  SlotCapacityRow,
} from "@/lib/admin-api-client";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CalendarOff, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_CENTRE_NAME } from "@/lib/centre";

export const Route = createFileRoute("/admin/_layout/availability")({
  component: AvailabilityPage,
});

function AvailabilityPage() {
  const [month, setMonth] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Date | undefined>();
  const [rules, setRules] = useState<BookingScheduleRule[]>([]);
  const [blockedSet, setBlockedSet] = useState<Set<string>>(new Set());
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const [capacities, setCapacities] = useState<SlotCapacityRow[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const range = {
    from: format(startOfMonth(month), "yyyy-MM-dd"),
    to: format(endOfMonth(addMonths(month, 1)), "yyyy-MM-dd"),
  };

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminScheduleApi.getRange(range.from, range.to);
      setRules(response.rules);
      setBlockedSet(new Set(response.blockedDates));
      setOpenSet(new Set(response.openDates));
    } catch {
      toast.error("Failed to load calendar rules");
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to]);

  const loadCapacity = useCallback(async (dateKey: string) => {
    try {
      const res = await adminSlotCapacityApi.getForDate(dateKey);
      setCapacities(res.capacities);
    } catch {
      toast.error("Failed to load slot capacity");
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : null;

  useEffect(() => {
    if (selectedKey) {
      loadCapacity(selectedKey);
    } else {
      setCapacities([]);
    }
  }, [selectedKey, loadCapacity]);

  const applyRule = async (type: "blocked" | "open") => {
    if (!selectedKey) return;
    setSaving(true);
    try {
      await adminScheduleApi.setRule({ date: selectedKey, type, reason });
      toast.success(type === "blocked" ? "Date blocked" : "Date opened");
      await loadSchedule();
    } catch (e) {
      if (e instanceof AdminApiError) toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const saveCapacities = async () => {
    if (!selectedKey) return;
    setSaving(true);
    try {
      const res = await adminSlotCapacityApi.update({
        date: selectedKey,
        capacities: capacities.map((c) => ({
          period: c.period,
          maxSlots: Number(c.maxSlots),
        })),
      });
      setCapacities(res.capacities);
      toast.success("Slot capacity saved");
    } catch (e) {
      if (e instanceof AdminApiError) toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Availability & slots</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {DEFAULT_CENTRE_NAME} — block dates and set how many applicants per morning,
          afternoon, or evening.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              month={month}
              onMonthChange={setMonth}
              modifiers={{
                blocked: (d) => blockedSet.has(format(d, "yyyy-MM-dd")),
                open: (d) => openSet.has(format(d, "yyyy-MM-dd")),
              }}
              modifiersClassNames={{
                blocked: "bg-destructive/15 text-destructive",
                open: "bg-secondary/20",
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedKey
                  ? format(new Date(selectedKey), "EEEE, MMM d, yyyy")
                  : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedKey ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => applyRule("blocked")}
                      disabled={saving}
                    >
                      <CalendarOff className="h-4 w-4" /> Block entire day
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => applyRule("open")}
                      disabled={saving}
                    >
                      <CalendarCheck className="h-4 w-4" /> Open (e.g. Sunday)
                    </Button>
                  </div>
                  <Input
                    placeholder="Note (optional)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />

                  <div className="border-t pt-4">
                    <h3 className="mb-3 text-sm font-semibold">Slots per time period</h3>
                    <div className="space-y-3">
                      {capacities.map((row, idx) => (
                        <div
                          key={row.period}
                          className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-medium">{row.label}</p>
                            <p className="text-xs text-muted-foreground">{row.hours}</p>
                            <p className="text-xs text-muted-foreground">
                              {row.booked} already booked
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs whitespace-nowrap">Max slots</Label>
                            <Input
                              type="number"
                              min={row.booked}
                              className="w-24"
                              value={row.maxSlots}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setCapacities((prev) =>
                                  prev.map((c, i) =>
                                    i === idx ? { ...c, maxSlots: val } : c,
                                  ),
                                );
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-4" onClick={saveCapacities} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save slot limits"}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Pick a date to manage blocked days and slot capacity.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
