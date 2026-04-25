import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore, authStore } from "@/lib/auth-store";
import { toast } from "sonner";

export function AppHeader() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-card)] transition-transform group-hover:scale-105">
            <Heart className="h-5 w-5" fill="currentColor" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-foreground">NHIS</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Booking System
            </div>
          </div>
        </Link>

        <nav className="flex w-full items-center justify-end gap-2 sm:w-auto">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:px-3 sm:text-sm"
                activeProps={{ className: "text-foreground bg-accent" }}
              >
                Dashboard
              </Link>
              <Link
                to="/appointments"
                className="inline-flex rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:px-3 sm:text-sm"
                activeProps={{ className: "text-foreground bg-accent" }}
              >
                Appointments
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="px-2.5 sm:px-3">
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="shrink-0">
                <Button variant="ghost" size="sm" className="px-3">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="shrink-0">
                <Button size="sm" className="px-4">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
