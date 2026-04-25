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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
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

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                activeProps={{ className: "text-foreground bg-accent" }}
              >
                Dashboard
              </Link>
              <Link
                to="/appointments"
                className="hidden sm:inline-flex rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                activeProps={{ className: "text-foreground bg-accent" }}
              >
                My Appointments
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
