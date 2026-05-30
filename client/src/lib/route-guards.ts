import { redirect } from "@tanstack/react-router";
import { authStore } from "@/lib/auth-store";

/** Redirect unauthenticated users to login (profile and account settings). */
export function requireUserSession() {
  if (!authStore.isAuthenticated()) {
    throw redirect({ to: "/login" });
  }
}
