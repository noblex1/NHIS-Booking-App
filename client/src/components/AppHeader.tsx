import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore, authStore } from "@/lib/auth-store";
import { authApi } from "@/lib/api-client";
import { toast } from "sonner";

export function AppHeader() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const handleLogout = () => {
    // Clear token from API client
    authApi.logout();
    
    // Clear local state
    authStore.logout();
    
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  // Hide header on auth pages for cleaner mobile experience
  const authPages = ["/login", "/register", "/verify"];
  const isAuthPage = authPages.includes(currentPath);

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Heart className="h-5 w-5" fill="currentColor" />
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-bold text-foreground">NHIS</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Booking System
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent" }}
              >
                Dashboard
              </Link>
              <Link
                to="/book"
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent" }}
              >
                Book
              </Link>
              <Link
                to="/appointments"
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent" }}
              >
                Appointments
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent" }}
              >
                Profile
              </Link>
              <div className="mx-2 h-6 w-px bg-border" />
              <Button variant="ghost" size="sm" onClick={handleLogout} className="px-3">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="px-4">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="px-4">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile: Show user info or auth buttons */}
        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs font-medium text-foreground leading-none">
                  {user.fullName.split(" ")[0]}
                </p>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  {user.nhisNumber}
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-xs font-semibold">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="h-8 px-3 text-xs">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
