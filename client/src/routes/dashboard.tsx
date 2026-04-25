import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import {
  CalendarPlus,
  ListChecks,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NHIS Booking" },
      { name: "description", content: "Your NHIS dashboard." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, appointments } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  const upcoming = appointments.filter((a) => a.status !== "Cancelled").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <p className="text-sm font-medium text-primary">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold text-foreground sm:text-4xl">
          Welcome, {user.fullName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          NHIS #: <span className="font-medium text-foreground">{user.nhisNumber}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={ListChecks} label="Upcoming" value={String(upcoming)} />
        <StatCard icon={Clock} label="Total visits" value={String(appointments.length)} />
        <StatCard icon={ShieldCheck} label="Coverage" value="Active" tone="secondary" />
      </div>

      {/* Action cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <ActionCard
          to="/book"
          title="Book Appointment"
          description="Pick a date and time slot that works for you."
          icon={CalendarPlus}
          gradient
        />
        <ActionCard
          to="/appointments"
          title="My Appointments"
          description="View, manage, or cancel your upcoming visits."
          icon={ListChecks}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "primary" | "secondary";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            tone === "secondary"
              ? "bg-secondary/10 text-secondary"
              : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  to,
  title,
  description,
  icon: Icon,
  gradient = false,
}: {
  to: "/book" | "/appointments";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient?: boolean;
}) {
  return (
    <Link to={to} className="group block">
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
      >
        {gradient && (
          <div
            aria-hidden
            className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
            style={{ background: "var(--gradient-hero)" }}
          />
        )}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            gradient
              ? "text-primary-foreground"
              : "bg-secondary/10 text-secondary"
          }`}
          style={gradient ? { background: "var(--gradient-hero)" } : undefined}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Continue
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
