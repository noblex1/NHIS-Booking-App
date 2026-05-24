/**
 * Admin API Client for NHIS Backend
 * Handles all HTTP requests to the admin API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

async function fetchAdminApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add admin auth token if available
  const token = localStorage.getItem("nhis_admin_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AdminApiError(
        data.message || "An error occurred",
        response.status,
        data,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AdminApiError) {
      throw error;
    }
    
    throw new AdminApiError(
      error instanceof Error ? error.message : "Network error",
      0,
    );
  }
}

// ============================================================================
// Admin Auth API
// ============================================================================

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: "super_admin" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: Admin;
}

export interface AdminProfileResponse {
  success: boolean;
  admin: Admin;
}

export const adminAuthApi = {
  async login(data: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await fetchAdminApi<AdminLoginResponse>("/api/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.token) {
      localStorage.setItem("nhis_admin_token", response.token);
    }

    return response;
  },

  async getProfile(): Promise<AdminProfileResponse> {
    return fetchAdminApi<AdminProfileResponse>("/api/admin/auth/profile");
  },

  logout() {
    localStorage.removeItem("nhis_admin_token");
  },

  getToken(): string | null {
    return localStorage.getItem("nhis_admin_token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

// ============================================================================
// Dashboard API
// ============================================================================

export interface DashboardStats {
  users: {
    total: number;
    verified: number;
    newThisMonth: number;
  };
  appointments: {
    total: number;
    confirmed: number;
    today: number;
    upcoming: number;
    byStatus: Array<{ _id: string; count: number }>;
  };
  officials: {
    total: number;
    active: number;
  };
  recent: {
    users: any[];
    appointments: any[];
  };
  growth: {
    users: Array<{ _id: string; count: number }>;
  };
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
}

export const adminDashboardApi = {
  async getStats(): Promise<DashboardStatsResponse> {
    return fetchAdminApi<DashboardStatsResponse>("/api/admin/dashboard/stats");
  },
};

// ============================================================================
// Users Management API
// ============================================================================

export interface User {
  _id: string;
  fullName: string;
  email: string;
  nhisNumber: string;
  dateOfBirth: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersResponse {
  success: boolean;
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GetUserResponse {
  success: boolean;
  user: User;
  appointments: any[];
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  dateOfBirth?: string;
  isVerified?: boolean;
}

export interface UserStatsResponse {
  success: boolean;
  stats: {
    total: number;
    verified: number;
    unverified: number;
    recentlyJoined: number;
  };
}

export const adminUsersApi = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<GetUsersResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);

    return fetchAdminApi<GetUsersResponse>(`/api/admin/users?${query}`);
  },

  async getById(id: string): Promise<GetUserResponse> {
    return fetchAdminApi<GetUserResponse>(`/api/admin/users/${id}`);
  },

  async update(id: string, data: UpdateUserRequest): Promise<any> {
    return fetchAdminApi(`/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<any> {
    return fetchAdminApi(`/api/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  async getStats(): Promise<UserStatsResponse> {
    return fetchAdminApi<UserStatsResponse>("/api/admin/users/stats");
  },
};

// ============================================================================
// Appointments Management API
// ============================================================================

export interface Appointment {
  _id: string;
  userId: any;
  date: string;
  timeSlot: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface GetAppointmentsResponse {
  success: boolean;
  appointments: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AppointmentStatsResponse {
  success: boolean;
  stats: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    today: number;
    upcoming: number;
  };
}

export const adminAppointmentsApi = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    status?: string;
    date?: string;
    search?: string;
  }): Promise<GetAppointmentsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.status) query.append("status", params.status);
    if (params?.date) query.append("date", params.date);
    if (params?.search) query.append("search", params.search);

    return fetchAdminApi<GetAppointmentsResponse>(`/api/admin/appointments?${query}`);
  },

  async getById(id: string): Promise<any> {
    return fetchAdminApi(`/api/admin/appointments/${id}`);
  },

  async updateStatus(id: string, status: string): Promise<any> {
    return fetchAdminApi(`/api/admin/appointments/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  async delete(id: string): Promise<any> {
    return fetchAdminApi(`/api/admin/appointments/${id}`, {
      method: "DELETE",
    });
  },

  async getStats(): Promise<AppointmentStatsResponse> {
    return fetchAdminApi<AppointmentStatsResponse>("/api/admin/appointments/stats");
  },
};

// ============================================================================
// NHIS Officials Management API
// ============================================================================

export interface NhisOfficial {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  position: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetOfficialsResponse {
  success: boolean;
  officials: NhisOfficial[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateOfficialRequest {
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  position: string;
}

export interface UpdateOfficialRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  employeeId?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
}

export interface OfficialStatsResponse {
  success: boolean;
  stats: {
    total: number;
    active: number;
    inactive: number;
    byDepartment: Array<{ _id: string; count: number }>;
  };
}

export const adminOfficialsApi = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<GetOfficialsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);

    return fetchAdminApi<GetOfficialsResponse>(`/api/admin/officials?${query}`);
  },

  async getById(id: string): Promise<any> {
    return fetchAdminApi(`/api/admin/officials/${id}`);
  },

  async create(data: CreateOfficialRequest): Promise<any> {
    return fetchAdminApi("/api/admin/officials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateOfficialRequest): Promise<any> {
    return fetchAdminApi(`/api/admin/officials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<any> {
    return fetchAdminApi(`/api/admin/officials/${id}`, {
      method: "DELETE",
    });
  },

  async getStats(): Promise<OfficialStatsResponse> {
    return fetchAdminApi<OfficialStatsResponse>("/api/admin/officials/stats");
  },
};

// Export everything
export const adminApi = {
  auth: adminAuthApi,
  dashboard: adminDashboardApi,
  users: adminUsersApi,
  appointments: adminAppointmentsApi,
  officials: adminOfficialsApi,
};

export default adminApi;
