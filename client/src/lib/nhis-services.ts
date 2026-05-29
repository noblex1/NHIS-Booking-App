/** NHIA centre service types (aligned with passport-style application booking) */

export type NhisServiceType = "new_registration" | "renewal";

export const NHIS_SERVICES: Record<
  NhisServiceType,
  { label: string; shortLabel: string; description: string }
> = {
  new_registration: {
    label: "New NHIS registration",
    shortLabel: "New registration",
    description: "New enrollment at an NHIA service centre",
  },
  renewal: {
    label: "Card Misplacement or Card Update",
    shortLabel: "Card Update",
    description: "Replace lost card or update your NHIS card information",
  },
};

export function getServiceTypeLabel(
  type: NhisServiceType | string | undefined,
): string {
  if (type && type in NHIS_SERVICES) {
    return NHIS_SERVICES[type as NhisServiceType].label;
  }
  return "NHIS service";
}
