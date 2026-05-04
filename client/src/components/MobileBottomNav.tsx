import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Calendar, CalendarCheck, User, Settings } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

interface NavItem {
  to: "/" | "/dashboard" | "/book" | "/appointments" | "/profile";
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  requiresAuth: boolean;
}

const navItems: NavItem[] = [
  {
    to: "/dashboard",
    icon: Home,
    label: "Home",
    requiresAuth: true,
  },
  {
    to: "/book",
    icon: Calendar,
    label: "Book",
    requiresAuth: true,
  },
  {
    to: "/appointments",
    icon: CalendarCheck,
    label: "Appointments",
    requiresAuth: true,
  },
  {
    to: "/profile",
    icon: User,
    label: "Profile",
    requiresAuth: true,
  },
];

export function MobileBottomNav() {
  const { user } = useAuthStore();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  // Don't show bottom nav if user is not authenticated
  if (!user) {
    return null;
  }

  // Don't show on auth pages
  const authPages = ["/login", "/register", "/verify"];
  if (authPages.includes(currentPath)) {
    return null;
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-20 md:hidden" aria-hidden="true" />
      
      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg md:hidden"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="mx-auto max-w-lg">
          <div className="grid grid-cols-4 gap-1 px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.to || 
                              (item.to === "/dashboard" && currentPath === "/");
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-all duration-200",
                    "active:scale-95",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon 
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isActive && "scale-110"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span 
                    className={cn(
                      "text-[10px] font-medium leading-none",
                      isActive && "font-semibold"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Safe area for devices with notches/home indicators */}
        <div className="h-[env(safe-area-inset-bottom)]" aria-hidden="true" />
      </nav>
    </>
  );
}
