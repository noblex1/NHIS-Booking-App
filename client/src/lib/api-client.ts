/**
 * API Client for NHIS Backend
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem("nhis_auth_token");
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
      throw new ApiError(
        data.message || "An error occurred",
        response.status,
        data,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0,
    );
  }
}

// ============================================================================
// Auth API
// ============================================================================

export interface RegisterRequest {
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

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

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface LoginRequest {
  nhisNumber: string;
  dateOfBirth: string; // YYYY-MM-DD
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return fetchApi<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify OTP code
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await fetchApi<VerifyOtpResponse>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("nhis_auth_token", response.token);
    }

    return response;
  },

  /**
   * Resend OTP code
   */
  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    return fetchApi<ResendOtpResponse>("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Login with NHIS number and date of birth
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetchApi<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("nhis_auth_token", response.token);
    }

    return response;
  },

  /**
   * Logout (clear local token)
   */
  logout() {
    localStorage.removeItem("nhis_auth_token");
  },

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return localStorage.getItem("nhis_auth_token");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

// ============================================================================
// Appointments API
// ============================================================================

export interface Appointment {
  _id: string;
  userId: string;
  date: string;
  timeSlot: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface GetAvailableSlotsResponse {
  success: boolean;
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
}

export interface CreateAppointmentRequest {
  date: string; // YYYY-MM-DD
  timeSlot: string;
}

export interface CreateAppointmentResponse {
  success: boolean;
  message: string;
  appointment: Appointment;
}

export interface GetMyAppointmentsResponse {
  success: boolean;
  appointments: Appointment[];
}

export const appointmentsApi = {
  /**
   * Get available time slots for a specific date
   */
  async getAvailableSlots(date: string): Promise<GetAvailableSlotsResponse> {
    return fetchApi<GetAvailableSlotsResponse>(
      `/api/appointments/available?date=${date}`,
    );
  },

  /**
   * Book a new appointment (requires authentication)
   */
  async createAppointment(
    data: CreateAppointmentRequest,
  ): Promise<CreateAppointmentResponse> {
    return fetchApi<CreateAppointmentResponse>("/api/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get user's appointments (requires authentication)
   */
  async getMyAppointments(): Promise<GetMyAppointmentsResponse> {
    return fetchApi<GetMyAppointmentsResponse>("/api/appointments");
  },
};

// ============================================================================
// Health Check API
// ============================================================================

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export const healthApi = {
  /**
   * Check API health
   */
  async check(): Promise<HealthCheckResponse> {
    return fetchApi<HealthCheckResponse>("/health");
  },
};

// Export everything
export const api = {
  auth: authApi,
  appointments: appointmentsApi,
  health: healthApi,
};

export default api;
