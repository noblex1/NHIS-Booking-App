import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCog,
  LogOut,
  Shield,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { adminStore, useAdminStore } from "@/lib/admin-store";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Centre bookings", href: "/admin/appointments", icon: Calendar },
  { name: "Centre", href: "/admin/centres", icon: MapPin },
  { name: "Slots & calendar", href: "/admin/availability", icon: CalendarDays },
  { name: "NHIS Officials", href: "/admin/officials", icon: UserCog },
];

export function AdminSidebar() {
  const location = useLocation();
  const { admin } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminStore.logout();
    toast.success("Logged out successfully");
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">NHIS Admin</h1>
          <p className="text-xs text-muted-foreground">Registration & renewal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Admin Info & Logout */}
      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-lg bg-accent/50 p-3">
          <p className="text-xs font-medium text-muted-foreground">Signed in as</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {admin?.fullName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{admin?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
