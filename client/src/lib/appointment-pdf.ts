import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { getServiceTypeLabel } from "@/lib/nhis-services";
import { getSlotPeriodLabel } from "@/lib/slot-periods";
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/nhis-application";
import type { Appointment } from "@/lib/api-client";
import { DEFAULT_CENTRE_NAME } from "@/lib/centre";
import { APP_THEME_RGB, type Rgb } from "@/lib/app-theme-colors";

type PdfAppointment = Appointment & {
  centreId?: {
    name?: string;
    address?: string;
    city?: string;
    region?: string;
    phone?: string;
  };
};

const T = APP_THEME_RGB;
const MARGIN = 18;
const FOOTER_H = 26;
const SECTION_GAP = 10;
const FIELD_GAP = 5;
const CARD_RADIUS = 2.5;
const LABEL_PT = 7.5;
const VALUE_PT = 10;
const VALUE_HIGHLIGHT_PT = 11;
const LINE_H = 5;

function fill(doc: jsPDF, c: Rgb) {
  doc.setFillColor(c[0], c[1], c[2]);
}

function stroke(doc: jsPDF, c: Rgb) {
  doc.setDrawColor(c[0], c[1], c[2]);
}

function ink(doc: jsPDF, c: Rgb) {
  doc.setTextColor(c[0], c[1], c[2]);
}

function wrap(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

function measureFieldHeight(
  doc: jsPDF,
  value: string,
  width: number,
  highlight: boolean,
): number {
  const pad = 6;
  const valuePt = highlight ? VALUE_HIGHLIGHT_PT : VALUE_PT;
  doc.setFontSize(valuePt);
  doc.setFont("helvetica", highlight ? "bold" : "normal");
  const lines = wrap(doc, value, width - pad * 2);
  return pad + 9 + lines.length * LINE_H + pad;
}

class PdfLayout {
  y: number;
  readonly doc: jsPDF;
  readonly pageWidth: number;
  readonly pageHeight: number;
  readonly contentWidth: number;
  readonly margin = MARGIN;

  constructor(doc: jsPDF) {
    this.doc = doc;
    this.pageWidth = doc.internal.pageSize.getWidth();
    this.pageHeight = doc.internal.pageSize.getHeight();
    this.contentWidth = this.pageWidth - MARGIN * 2;
    this.y = 0;
  }

  get bottomLimit() {
    return this.pageHeight - FOOTER_H;
  }

  ensure(needed: number) {
    if (this.y + needed > this.bottomLimit) {
      this.doc.addPage();
      fill(this.doc, T.background);
      this.doc.rect(0, 0, this.pageWidth, this.pageHeight, "F");
      this.y = MARGIN;
    }
  }

  gap(mm = FIELD_GAP) {
    this.y += mm;
  }

  section(title: string) {
    this.ensure(14);
    fill(this.doc, T.primary);
    this.doc.rect(this.margin, this.y - 4, 3, 9, "F");
    ink(this.doc, T.primary);
    this.doc.setFontSize(10.5);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title.toUpperCase(), this.margin + 7, this.y + 2);
    this.y += SECTION_GAP;
  }

  field(label: string, value: string, highlight = false) {
    const x = this.margin;
    const w = this.contentWidth;
    const h = measureFieldHeight(this.doc, value, w, highlight);
    this.ensure(h + FIELD_GAP);

    fill(this.doc, T.card);
    stroke(this.doc, T.border);
    this.doc.setLineWidth(0.35);
    this.doc.roundedRect(x, this.y, w, h, CARD_RADIUS, CARD_RADIUS, "FD");

    this.doc.setFontSize(LABEL_PT);
    this.doc.setFont("helvetica", "bold");
    ink(this.doc, T.mutedForeground);
    this.doc.text(label.toUpperCase(), x + 6, this.y + 6);

    const valuePt = highlight ? VALUE_HIGHLIGHT_PT : VALUE_PT;
    this.doc.setFontSize(valuePt);
    this.doc.setFont("helvetica", highlight ? "bold" : "normal");
    ink(this.doc, T.foreground);
    const lines = wrap(this.doc, value, w - 12);
    this.doc.text(lines, x + 6, this.y + 12);

    this.y += h + FIELD_GAP;
  }

  noticeBox(title: string, bullets: string[]) {
    const pad = 8;
    const textW = this.contentWidth - pad * 2;

    this.doc.setFontSize(9.5);
    this.doc.setFont("helvetica", "normal");
    let bodyH = 10;
    const wrappedBullets: string[][] = [];
    for (const b of bullets) {
      const lines = wrap(this.doc, b, textW);
      wrappedBullets.push(lines);
      bodyH += lines.length * LINE_H + 2;
    }

    const boxH = pad + 8 + bodyH + pad;
    this.ensure(boxH + FIELD_GAP);

    fill(this.doc, T.accent);
    stroke(this.doc, T.primary);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(this.margin, this.y, this.contentWidth, boxH, CARD_RADIUS, CARD_RADIUS, "FD");

    ink(this.doc, T.accentForeground);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin + pad, this.y + pad + 4);

    this.doc.setFontSize(9.5);
    this.doc.setFont("helvetica", "normal");
    let ty = this.y + pad + 12;
    for (const lines of wrappedBullets) {
      this.doc.text(lines, this.margin + pad, ty);
      ty += lines.length * LINE_H + 2;
    }

    this.y += boxH + FIELD_GAP;
  }

  drawFooters() {
    const pages = this.doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      this.doc.setPage(p);
      const ph = this.doc.internal.pageSize.getHeight();
      const fy = ph - 10;
      stroke(this.doc, T.border);
      this.doc.setLineWidth(0.4);
      this.doc.line(MARGIN, fy - 7, this.pageWidth - MARGIN, fy - 7);
      ink(this.doc, T.mutedForeground);
      this.doc.setFontSize(8);
      this.doc.setFont("helvetica", "normal");
      this.doc.text("NHIS Booking · Techiman Municipal NHIA Service Centre", MARGIN, fy);
      this.doc.text(
        `Generated ${format(new Date(), "dd MMM yyyy, HH:mm")} · Page ${p} of ${pages}`,
        MARGIN,
        fy + 4,
      );
    }
  }
}

export function downloadAppointmentPdf(
  appointment: PdfAppointment,
  user: { fullName: string; email: string },
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const layout = new PdfLayout(doc);

  fill(doc, T.background);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F");

  const centre =
    typeof appointment.centreId === "object" && appointment.centreId
      ? appointment.centreId
      : null;
  const centreLabel = centre?.name || DEFAULT_CENTRE_NAME;
  const addressLine = centre?.address
    ? [centre.address, centre.city, centre.region].filter(Boolean).join(", ")
    : "Techiman Municipal, Bono East Region";

  const appStatus =
    APPLICATION_STATUS_LABELS[appointment.applicationStatus as ApplicationStatus] ||
    appointment.applicationStatus ||
    "—";

  const visitDate = format(new Date(appointment.date), "EEEE, MMMM d, yyyy");
  const timePeriod = getSlotPeriodLabel(appointment.timeSlot);
  const service = getServiceTypeLabel(appointment.serviceType);

  // Header — matches --gradient-hero (primary → teal)
  const headerH = 40;
  fill(doc, T.primary);
  doc.rect(0, 0, pageWidth, headerH - 6, "F");
  fill(doc, T.primaryGradientEnd);
  doc.rect(0, headerH - 10, pageWidth, 10, "F");
  fill(doc, T.primaryGlow);
  doc.rect(0, headerH - 6, pageWidth, 6, "F");

  fill(doc, T.card);
  doc.roundedRect(MARGIN, 9, 20, 20, 3, 3, "F");
  ink(doc, T.primary);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("NHIS", MARGIN + 10, 20, { align: "center" });

  ink(doc, T.primaryForeground);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Centre Visit Confirmation", MARGIN + 26, 15);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("National Health Insurance Scheme", MARGIN + 26, 22);
  doc.text("Techiman Municipal · Registration & Card Misplacement or Update", MARGIN + 26, 28);

  layout.y = headerH + 8;

  // Reference card
  const refH = 20;
  layout.ensure(refH);
  fill(doc, T.accent);
  stroke(doc, T.primary);
  doc.setLineWidth(0.55);
  doc.roundedRect(MARGIN, layout.y, layout.contentWidth, refH, CARD_RADIUS, CARD_RADIUS, "FD");

  ink(doc, T.primary);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("BOOKING REFERENCE", MARGIN + 7, layout.y + 7);

  ink(doc, T.foreground);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const displayReference = appointment.referenceNumber || appointment._id || "N/A";
  doc.text(displayReference, MARGIN + 7, layout.y + 15);

  layout.y += refH + 8;

  layout.section("Applicant details");
  layout.field("Full name", appointment.beneficiaryName || user.fullName, true);
  layout.field("Email address", user.email);

  layout.gap(2);
  layout.section("Visit schedule");
  layout.field("Service", service, true);
  layout.field("Visit date", visitDate, true);
  layout.field("Time period", timePeriod, true);

  layout.gap(2);
  layout.section("Service centre");
  layout.field("Centre name", centreLabel, true);
  layout.field("Location", addressLine);
  if (centre?.phone) {
    layout.field("Contact phone", centre.phone);
  }

  layout.gap(2);
  layout.section("Booking status");
  layout.field("Booking status", appointment.status, true);
  layout.field("Application status", appStatus);

  layout.gap(2);
  layout.noticeBox("Before you visit", [
    "Bring every document required for your service type (originals where possible).",
    `Arrive during your booked period: ${timePeriod}.`,
    "Show this PDF or your reference number at the centre reception.",
  ]);

  layout.drawFooters();

  const filename = `NHIS-Appointment-${appointment.referenceNumber || appointment._id}.pdf`;
  doc.save(filename);
}
