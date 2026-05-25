import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ClipboardList, LogOut, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { officialStore, getOfficialCentreName } from "@/lib/official-store";
import { Button } from "@/components/ui/button";

const nav = [
  { name: "Dashboard", href: "/official/dashboard", icon: LayoutDashboard },
  { name: "Today's queue", href: "/official/queue", icon: ClipboardList },
];

export function OfficialSidebar() {
  const { official } = officialStore.getState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          NHIS Centre Portal
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {official?.fullName || "Official"}
        </p>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {getOfficialCentreName(official)}
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => {
            officialStore.logout();
            window.location.href = "/official/login";
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
