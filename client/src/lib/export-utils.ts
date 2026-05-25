/**
 * Export Utilities
 * Functions to export data to CSV and Excel formats
 */

// Convert data to CSV format
export function convertToCSV(data: any[], headers: string[]): string {
  if (data.length === 0) return "";

  // Create header row
  const headerRow = headers.join(",");

  // Create data rows
  const dataRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header];
        // Handle null/undefined
        if (value === null || value === undefined) return "";
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const stringValue = String(value);
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

// Download CSV file
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Export users to CSV
export function exportUsersToCSV(users: any[]): void {
  const headers = [
    "fullName",
    "email",
    "nhisNumber",
    "dateOfBirth",
    "isVerified",
    "createdAt",
  ];

  const formattedData = users.map((user) => ({
    fullName: user.fullName,
    email: user.email,
    nhisNumber: user.nhisNumber || "N/A",
    dateOfBirth: user.dateOfBirth
      ? new Date(user.dateOfBirth).toLocaleDateString()
      : "N/A",
    isVerified: user.isVerified ? "Yes" : "No",
    createdAt: new Date(user.createdAt).toLocaleString(),
  }));

  const csv = convertToCSV(formattedData, headers);
  const filename = `nhis-users-${new Date().toISOString().split("T")[0]}.csv`;
  downloadCSV(csv, filename);
}

// Export appointments to CSV
export function exportAppointmentsToCSV(appointments: any[]): void {
  const headers = [
    "patientName",
    "patientEmail",
    "nhisNumber",
    "serviceType",
    "date",
    "timeSlot",
    "status",
    "bookedOn",
  ];

  const serviceLabels: Record<string, string> = {
    new_registration: "New registration",
    renewal: "Renewal",
  };

  const formattedData = appointments.map((apt) => ({
    patientName: apt.userId?.fullName || "Unknown",
    patientEmail: apt.userId?.email || "N/A",
    nhisNumber: apt.userId?.nhisNumber || "N/A",
    serviceType: serviceLabels[apt.serviceType] || apt.serviceType || "N/A",
    date: new Date(apt.date).toLocaleDateString(),
    timeSlot:
      apt.timeSlot === "morning"
        ? "Morning (8:00 AM – 11:00 AM)"
        : apt.timeSlot === "afternoon"
          ? "Afternoon (12:00 PM – 3:00 PM)"
          : apt.timeSlot === "evening"
            ? "Evening (4:00 PM – 6:00 PM)"
            : apt.timeSlot,
    status: apt.status,
    bookedOn: new Date(apt.createdAt).toLocaleString(),
  }));

  const csv = convertToCSV(formattedData, headers);
  const filename = `nhis-appointments-${new Date().toISOString().split("T")[0]}.csv`;
  downloadCSV(csv, filename);
}

// Export officials to CSV
export function exportOfficialsToCSV(officials: any[]): void {
  const headers = [
    "fullName",
    "email",
    "phone",
    "centre",
    "isActive",
    "createdAt",
  ];

  const formattedData = officials.map((official) => ({
    fullName: official.fullName,
    email: official.email,
    phone: official.phone,
    centre:
      typeof official.assignedCentreId === "object"
        ? official.assignedCentreId?.name
        : "",
    isActive: official.isActive ? "Yes" : "No",
    createdAt: new Date(official.createdAt).toLocaleString(),
  }));

  const csv = convertToCSV(formattedData, headers);
  const filename = `nhis-officials-${new Date().toISOString().split("T")[0]}.csv`;
  downloadCSV(csv, filename);
}

// Export to Excel (using HTML table method - works without external libraries)
export function exportToExcel(data: any[], headers: string[], filename: string): void {
  // Create HTML table
  let html = '<html><head><meta charset="utf-8"></head><body><table>';

  // Add header row
  html += "<thead><tr>";
  headers.forEach((header) => {
    html += `<th>${header}</th>`;
  });
  html += "</tr></thead>";

  // Add data rows
  html += "<tbody>";
  data.forEach((row) => {
    html += "<tr>";
    headers.forEach((header) => {
      const value = row[header] || "";
      html += `<td>${value}</td>`;
    });
    html += "</tr>";
  });
  html += "</tbody></table></body></html>";

  // Create blob and download
  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Export users to Excel
export function exportUsersToExcel(users: any[]): void {
  const headers = [
    "Full Name",
    "Email",
    "NHIS Number",
    "Date of Birth",
    "Verified",
    "Created At",
  ];

  const formattedData = users.map((user) => ({
    "Full Name": user.fullName,
    Email: user.email,
    "NHIS Number": user.nhisNumber || "N/A",
    "Date of Birth": new Date(user.dateOfBirth).toLocaleDateString(),
    Verified: user.isVerified ? "Yes" : "No",
    "Created At": new Date(user.createdAt).toLocaleString(),
  }));

  const filename = `nhis-users-${new Date().toISOString().split("T")[0]}.xls`;
  exportToExcel(formattedData, headers, filename);
}

// Export appointments to Excel
export function exportAppointmentsToExcel(appointments: any[]): void {
  const headers = [
    "Patient Name",
    "Patient Email",
    "NHIS Number",
    "Date",
    "Time Slot",
    "Status",
    "Booked On",
  ];

  const formattedData = appointments.map((apt) => ({
    "Patient Name": apt.userId?.fullName || "Unknown",
    "Patient Email": apt.userId?.email || "N/A",
    "NHIS Number": apt.userId?.nhisNumber || "N/A",
    Date: new Date(apt.date).toLocaleDateString(),
    "Time Slot":
      apt.timeSlot === "morning"
        ? "Morning (8:00 AM – 11:00 AM)"
        : apt.timeSlot === "afternoon"
          ? "Afternoon (12:00 PM – 3:00 PM)"
          : apt.timeSlot === "evening"
            ? "Evening (4:00 PM – 6:00 PM)"
            : apt.timeSlot,
    Status: apt.status,
    "Booked On": new Date(apt.createdAt).toLocaleString(),
  }));

  const filename = `nhis-appointments-${new Date().toISOString().split("T")[0]}.xls`;
  exportToExcel(formattedData, headers, filename);
}

// Export officials to Excel
export function exportOfficialsToExcel(officials: any[]): void {
  const headers = [
    "Full Name",
    "Email",
    "Phone",
    "Centre",
    "Active",
    "Created At",
  ];

  const formattedData = officials.map((official) => ({
    "Full Name": official.fullName,
    Email: official.email,
    Phone: official.phone,
    Centre:
      typeof official.assignedCentreId === "object"
        ? official.assignedCentreId?.name
        : "",
    Active: official.isActive ? "Yes" : "No",
    "Created At": new Date(official.createdAt).toLocaleString(),
  }));

  const filename = `nhis-officials-${new Date().toISOString().split("T")[0]}.xls`;
  exportToExcel(formattedData, headers, filename);
}

// Generic export function
export function exportData(
  data: any[],
  type: "users" | "appointments" | "officials",
  format: "csv" | "excel"
): void {
  if (data.length === 0) {
    throw new Error("No data to export");
  }

  if (format === "csv") {
    switch (type) {
      case "users":
        exportUsersToCSV(data);
        break;
      case "appointments":
        exportAppointmentsToCSV(data);
        break;
      case "officials":
        exportOfficialsToCSV(data);
        break;
    }
  } else {
    switch (type) {
      case "users":
        exportUsersToExcel(data);
        break;
      case "appointments":
        exportAppointmentsToExcel(data);
        break;
      case "officials":
        exportOfficialsToExcel(data);
        break;
    }
  }
}
