import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin/_layout")({
  component: AdminLayout,
});

function AdminLayout() {
  const { admin, token } = useAdminStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin || !token) {
      navigate({ to: "/admin/login" });
    }
  }, [admin, token, navigate]);

  if (!admin || !token) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
