import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ShieldCheck,
  Clock,
  HeartPulse,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NHIS Appointment Booking — Book Securely" },
      {
        name: "description",
        content:
          "Book your NHIS appointment quickly and securely. Manage your health visits in one place.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-soft)" }}
      />
      <div
        aria-hidden
        className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-hero)" }}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              National Health Insurance Scheme
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              NHIS Appointment{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                Booking System
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
              Book your appointment quickly and securely — manage your visits,
              prescriptions, and history in one trusted place.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group">
                  Login
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Register
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {[
                { icon: ShieldCheck, label: "Secure" },
                { icon: Clock, label: "24/7" },
                { icon: HeartPulse, label: "Trusted" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card/60 p-3 backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration card */}
          <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div
              className="relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-elegant)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-primary-foreground"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Next Appointment
                    </div>
                    <div className="text-xs text-muted-foreground">
                      General Consultation
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                  Confirmed
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-accent/40 p-4">
                  <div className="text-xs text-muted-foreground">Date</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">
                    Mon, Jun 16
                  </div>
                </div>
                <div className="rounded-xl bg-accent/40 p-4">
                  <div className="text-xs text-muted-foreground">Time</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">
                    10:30 AM
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {["Morning", "Afternoon", "Evening"].map((slot, i) => (
                  <div
                    key={slot}
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {slot} slot
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {i === 0 ? "3 left" : i === 1 ? "5 left" : "Full"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              aria-hidden
              className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl"
              style={{ background: "var(--gradient-hero)", opacity: 0.15 }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
