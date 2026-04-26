// Client-side store for authentication and appointments
import { useSyncExternalStore } from "react";
import type { User as ApiUser, Appointment as ApiAppointment } from "./api-client";

export type Appointment = {
  id: string;
  date: string; // ISO date
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  reason?: string;
};

export type User = {
  id: string;
  fullName: string;
  nhisNumber: string;
  email: string;
  dateOfBirth: string;
  isVerified: boolean;
};

type State = {
  user: User | null;
  token: string | null;
  appointments: Appointment[];
  pendingRegistration: { fullName: string; dateOfBirth: string; email: string } | null;
};

const STORAGE_KEY = "nhis_state_v2";
const TOKEN_KEY = "nhis_auth_token";

function load(): State {
  if (typeof window === "undefined") {
    return { user: null, token: null, appointments: [], pendingRegistration: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      return { ...parsed, token };
    }
  } catch {
    // ignore parse errors and reset state
  }
  return { user: null, token: null, appointments: [], pendingRegistration: null };
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    const { token, ...stateWithoutToken } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithoutToken));
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
  listeners.forEach((l) => l());
}

// Convert API user to local user format
function convertApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser._id,
    fullName: apiUser.fullName,
    nhisNumber: apiUser.nhisNumber,
    email: apiUser.email,
    dateOfBirth: apiUser.dateOfBirth,
    isVerified: apiUser.isVerified,
  };
}

// Convert API appointment to local appointment format
function convertApiAppointment(apiAppointment: ApiAppointment): Appointment {
  return {
    id: apiAppointment._id,
    date: apiAppointment.date,
    time: apiAppointment.timeSlot,
    status: apiAppointment.status,
  };
}

export const authStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  
  /**
   * Set user and token after successful login/verification
   */
  setAuth(user: ApiUser, token: string) {
    state = { 
      ...state, 
      user: convertApiUser(user), 
      token,
      pendingRegistration: null 
    };
    persist();
  },

  /**
   * Login with user data
   */
  login(user: User, token: string) {
    state = { ...state, user, token };
    persist();
  },

  /**
   * Logout and clear all data
   */
  logout() {
    state = { user: null, token: null, appointments: [], pendingRegistration: null };
    persist();
  },

  /**
   * Start registration process (store data temporarily)
   */
  startRegistration(data: { fullName: string; dateOfBirth: string; email: string }) {
    state = { ...state, pendingRegistration: data };
    persist();
  },

  /**
   * Complete registration after OTP verification
   */
  completeRegistration(user: ApiUser, token: string) {
    state = {
      ...state,
      user: convertApiUser(user),
      token,
      pendingRegistration: null,
    };
    persist();
  },

  /**
   * Set appointments from API
   */
  setAppointments(apiAppointments: ApiAppointment[]) {
    state = {
      ...state,
      appointments: apiAppointments.map(convertApiAppointment),
    };
    persist();
  },

  /**
   * Add a new appointment
   */
  addAppointment(apiAppointment: ApiAppointment) {
    const appointment = convertApiAppointment(apiAppointment);
    state = { ...state, appointments: [appointment, ...state.appointments] };
    persist();
  },

  /**
   * Cancel an appointment
   */
  cancelAppointment(id: string) {
    state = {
      ...state,
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: "Cancelled" as const } : a,
      ),
    };
    persist();
  },

  /**
   * Get auth token
   */
  getToken(): string | null {
    return state.token;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!state.token && !!state.user;
  },
};

export function useAuthStore() {
  return useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    authStore.getState,
  );
}
