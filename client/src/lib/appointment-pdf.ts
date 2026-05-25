import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { getServiceTypeLabel } from "@/lib/nhis-services";
import { getSlotPeriodLabel } from "@/lib/slot-periods";
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/nhis-application";
import type { Appointment } from "@/lib/api-client";

type PdfAppointment = Appointment & {
  centreId?: { name?: string; address?: string; city?: string; region?: string };
};

export function downloadAppointmentPdf(
  appointment: PdfAppointment,
  user: { fullName: string; email: string; nhisNumber?: string },
) {
  const doc = new jsPDF();
  const centre =
    typeof appointment.centreId === "object" && appointment.centreId
      ? appointment.centreId
      : null;
  const centreLabel = centre?.name || "Techiman Municipal NHIA Service Centre";
  const addressLine = centre?.address
    ? [centre.address, centre.city, centre.region].filter(Boolean).join(", ")
    : "Techiman Municipal, Bono East Region";

  const lines: [string, string][] = [
    ["Reference number", appointment.referenceNumber || "—"],
    ["Applicant name", user.fullName],
    ["Email", user.email],
    ["NHIS number", user.nhisNumber || "Assigned after centre visit"],
    ["Service", getServiceTypeLabel(appointment.serviceType)],
    ["Service centre", centreLabel],
    ["Centre address", addressLine],
    ["Visit date", format(new Date(appointment.date), "EEEE, MMMM d, yyyy")],
    ["Time period", getSlotPeriodLabel(appointment.timeSlot)],
    [
      "Application status",
      APPLICATION_STATUS_LABELS[appointment.applicationStatus as ApplicationStatus] ||
        appointment.applicationStatus ||
        "—",
    ],
    ["Booking status", appointment.status],
  ];

  if (appointment.feeAmount && appointment.feeAmount > 0) {
    lines.push(["Fee (GHS)", String(appointment.feeAmount)]);
    lines.push(["Fee paid", appointment.feePaid ? "Yes" : "No"]);
  }

  doc.setFontSize(18);
  doc.text("NHIS Centre Visit Confirmation", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("National Health Insurance Scheme — Techiman Municipal", 14, 28);
  doc.setTextColor(0);

  let y = 40;
  doc.setFontSize(11);
  for (const [label, value] of lines) {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 14, y);
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(String(value), 120);
    doc.text(wrapped, 60, y);
    y += Math.max(8, wrapped.length * 6);
  }

  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(
    "Bring all required documents for your service type. Arrive during your selected period.",
    14,
    y,
  );
  doc.text(`Generated ${format(new Date(), "PPpp")}`, 14, 285);

  const filename = `NHIS-${appointment.referenceNumber || appointment._id}.pdf`;
  doc.save(filename);
}
