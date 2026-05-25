import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/official/_layout/")({
  beforeLoad: () => {
    throw redirect({ to: "/official/dashboard" });
  },
});
