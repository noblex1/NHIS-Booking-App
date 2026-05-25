import type { NhisServiceType } from "@/lib/api-client";

export type ApplicationStatus = "submitted" | "at_centre" | "completed" | "cancelled";

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  "submitted",
  "at_centre",
  "completed",
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Submitted online",
  at_centre: "At service centre",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface DocumentRequirement {
  id: string;
  label: string;
  required: boolean;
}

export const DOCUMENT_REQUIREMENTS: Record<NhisServiceType, DocumentRequirement[]> = {
  new_registration: [
    { id: "ghana_card", label: "Valid Ghana Card (original)", required: true },
    { id: "birth_cert", label: "Birth certificate (if applicable)", required: false },
    { id: "passport_photo", label: "Two passport-sized photographs", required: true },
    { id: "residence_proof", label: "Proof of residence", required: true },
  ],
  renewal: [
    { id: "ghana_card", label: "Valid Ghana Card (original)", required: true },
    { id: "nhis_card", label: "Existing NHIS card or membership details", required: true },
    { id: "passport_photo", label: "One passport-sized photograph", required: false },
  ],
};

export const SERVICE_FEES: Record<NhisServiceType, number> = {
  new_registration: 0,
  renewal: 0,
};

export function getApplicationStatusIndex(status: ApplicationStatus): number {
  if (status === "cancelled") return -1;
  return APPLICATION_STATUS_ORDER.indexOf(status);
}
