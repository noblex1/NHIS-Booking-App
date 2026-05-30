import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireUserSession } from "@/lib/route-guards";

export const Route = createFileRoute("/profile")({
  beforeLoad: requireUserSession,
  component: ProfileLayout,
});

function ProfileLayout() {
  return <Outlet />;
}
