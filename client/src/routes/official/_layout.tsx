import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useOfficialStore } from "@/lib/official-store";
import { OfficialSidebar } from "@/components/OfficialSidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/official/_layout")({
  component: OfficialLayout,
});

function OfficialLayout() {
  const { official, token } = useOfficialStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!official || !token) {
      navigate({ to: "/official/login" });
    }
  }, [official, token, navigate]);

  if (!official || !token) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <OfficialSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
