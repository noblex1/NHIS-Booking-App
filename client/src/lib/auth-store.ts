// Lightweight client-side store for demo UI (no backend yet).
import { useSyncExternalStore } from "react";

export type Appointment = {
  id: string;
  date: string; // ISO date
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  reason?: string;
};

export type User = {
  fullName: string;
  nhisNumber: string;
  phone?: string;
  dob?: string;
};

type State = {
  user: User | null;
  appointments: Appointment[];
  pendingRegistration: { fullName: string; dob: string; phone: string } | null;
};

const STORAGE_KEY = "nhis_demo_state_v1";

function load(): State {
  if (typeof window === "undefined") {
    return { user: null, appointments: [], pendingRegistration: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {
    // ignore parse errors and reset state
  }
  return { user: null, appointments: [], pendingRegistration: null };
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

export const authStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  login(user: User) {
    state = { ...state, user };
    persist();
  },
  logout() {
    state = { ...state, user: null };
    persist();
  },
  startRegistration(data: { fullName: string; dob: string; phone: string }) {
    state = { ...state, pendingRegistration: data };
    persist();
  },
  completeRegistration(nhisNumber: string) {
    if (!state.pendingRegistration) return;
    state = {
      ...state,
      user: {
        fullName: state.pendingRegistration.fullName,
        dob: state.pendingRegistration.dob,
        phone: state.pendingRegistration.phone,
        nhisNumber,
      },
      pendingRegistration: null,
    };
    persist();
  },
  addAppointment(a: Appointment) {
    state = { ...state, appointments: [a, ...state.appointments] };
    persist();
  },
  cancelAppointment(id: string) {
    state = {
      ...state,
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: "Cancelled" } : a,
      ),
    };
    persist();
  },
};

export function useAuthStore() {
  return useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    authStore.getState,
  );
}
