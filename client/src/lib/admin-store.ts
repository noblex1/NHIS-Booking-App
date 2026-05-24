// Client-side store for admin authentication
import { useSyncExternalStore } from "react";
import type { Admin } from "./admin-api-client";

type State = {
  admin: Admin | null;
  token: string | null;
};

const STORAGE_KEY = "nhis_admin_state";
const TOKEN_KEY = "nhis_admin_token";

function load(): State {
  if (typeof window === "undefined") {
    return { admin: null, token: null };
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
  return { admin: null, token: null };
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

export const adminStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  
  /**
   * Set admin and token after successful login
   */
  setAuth(admin: Admin, token: string) {
    state = { admin, token };
    persist();
  },

  /**
   * Logout and clear all data
   */
  logout() {
    state = { admin: null, token: null };
    persist();
  },

  /**
   * Get auth token
   */
  getToken(): string | null {
    return state.token;
  },

  /**
   * Check if admin is authenticated
   */
  isAuthenticated(): boolean {
    return !!state.token && !!state.admin;
  },
};

export function useAdminStore() {
  return useSyncExternalStore(
    adminStore.subscribe,
    adminStore.getState,
    adminStore.getState,
  );
}
