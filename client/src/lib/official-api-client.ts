const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export class OfficialApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "OfficialApiError";
  }
}

async function fetchOfficialApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = localStorage.getItem("nhis_official_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new OfficialApiError(
        data.message || "An error occurred",
        response.status,
        data,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof OfficialApiError) throw error;
    throw new OfficialApiError(
      error instanceof Error ? error.message : "Network error",
      0,
    );
  }
}

export interface ServiceCentreRef {
  _id: string;
  name: string;
  code?: string;
  city?: string;
  region?: string;
  address?: string;
  phone?: string;
}

export interface Official {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  assignedCentreId: ServiceCentreRef | string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfficialAppointment {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    nhisNumber?: string;
  };
  centreId?: ServiceCentreRef;
  date: string;
  timeSlot: string;
  serviceType: "new_registration" | "renewal";
  status: string;
  applicationStatus: string;
  referenceNumber?: string;
  feeAmount?: number;
  feePaid?: boolean;
  documentsAcknowledged?: string[];
  checkedInAt?: string;
  completedAt?: string;
}

export const officialAuthApi = {
  login(data: { email: string; password: string }) {
    return fetchOfficialApi<{
      success: boolean;
      token: string;
      official: Official;
    }>("/api/official/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getProfile() {
    return fetchOfficialApi<{ success: boolean; official: Official }>(
      "/api/official/auth/profile",
    );
  },
};

export const officialDashboardApi = {
  getStats(date?: string) {
    const q = date ? `?date=${date}` : "";
    return fetchOfficialApi<{
      success: boolean;
      date: string;
      stats: {
        totalToday: number;
        awaitingCheckIn: number;
        atCentre: number;
        completed: number;
      };
    }>(`/api/official/dashboard/stats${q}`);
  },
};

export const officialAppointmentsApi = {
  getForDate(params?: {
    date?: string;
    applicationStatus?: string;
    search?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.date) query.append("date", params.date);
    if (params?.applicationStatus) query.append("applicationStatus", params.applicationStatus);
    if (params?.search) query.append("search", params.search);
    const qs = query.toString();
    return fetchOfficialApi<{
      success: boolean;
      date: string;
      appointments: OfficialAppointment[];
    }>(`/api/official/appointments${qs ? `?${qs}` : ""}`);
  },

  lookup(reference: string) {
    return fetchOfficialApi<{ success: boolean; appointment: OfficialAppointment }>(
      `/api/official/appointments/lookup?reference=${encodeURIComponent(reference)}`,
    );
  },

  checkIn(id: string) {
    return fetchOfficialApi<{ success: boolean; message: string; appointment: OfficialAppointment }>(
      `/api/official/appointments/${id}/check-in`,
      { method: "POST" },
    );
  },

  updateApplication(
    id: string,
    data: {
      applicationStatus?: string;
      feePaid?: boolean;
      feePaymentReference?: string;
      assignNhisNumber?: string;
    },
  ) {
    return fetchOfficialApi<{ success: boolean; message: string; appointment: OfficialAppointment }>(
      `/api/official/appointments/${id}/application`,
      { method: "PUT", body: JSON.stringify(data) },
    );
  },
};
