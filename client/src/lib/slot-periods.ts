export type SlotPeriodId = "morning" | "afternoon" | "evening";

export const SLOT_PERIODS: Record<
  SlotPeriodId,
  { label: string; hours: string }
> = {
  morning: { label: "Morning", hours: "8:00 AM – 11:00 AM" },
  afternoon: { label: "Afternoon", hours: "12:00 PM – 3:00 PM" },
  evening: { label: "Evening", hours: "4:00 PM – 6:00 PM" },
};

export function getSlotPeriodLabel(period?: string): string {
  if (!period || !(period in SLOT_PERIODS)) {
    return period || "—";
  }
  const p = SLOT_PERIODS[period as SlotPeriodId];
  return `${p.label} (${p.hours})`;
}
