/** NHIA centre service types (aligned with passport-style application booking) */

export type NhisServiceType = "new_registration" | "renewal";

export const NHIS_SERVICES: Record<
  NhisServiceType,
  { label: string; shortLabel: string; description: string }
> = {
  new_registration: {
    label: "New NHIS registration",
    shortLabel: "New registration",
    description: "First-time enrollment at an NHIA service centre",
  },
  renewal: {
    label: "NHIS renewal",
    shortLabel: "Renewal",
    description: "Renew your existing NHIS membership",
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
