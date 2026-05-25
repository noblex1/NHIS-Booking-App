import { useSyncExternalStore } from "react";
import type { Official } from "./official-api-client";

type State = {
  official: Official | null;
  token: string | null;
};

const STORAGE_KEY = "nhis_official_state";
const TOKEN_KEY = "nhis_official_token";

function load(): State {
  if (typeof window === "undefined") {
    return { official: null, token: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      return { ...parsed, token };
    }
  } catch {
    // ignore
  }
  return { official: null, token: null };
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    const { token, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
  listeners.forEach((l) => l());
}

export const officialStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setAuth(official: Official, token: string) {
    state = { official, token };
    persist();
  },
  logout() {
    state = { official: null, token: null };
    persist();
  },
  getToken(): string | null {
    return state.token;
  },
  isAuthenticated() {
    return !!state.token && !!state.official;
  },
};

export function useOfficialStore() {
  return useSyncExternalStore(
    officialStore.subscribe,
    officialStore.getState,
    officialStore.getState,
  );
}

export function getOfficialCentreName(official: Official | null): string {
  if (!official?.assignedCentreId) return "Service centre";
  if (typeof official.assignedCentreId === "object") {
    return official.assignedCentreId.name;
  }
  return "Service centre";
}
