import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
import { authStore } from "@/lib/auth-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — NHIS Booking" },
      { name: "description", content: "Login to your NHIS account to book appointments." },
    ],
  }),
  component: LoginPage,
});

const loginSchema = z.object({
  nhisNumber: z
    .string()
    .trim()
    .min(6, "NHIS number must be at least 6 characters")
    .max(20, "NHIS number is too long"),
  dob: z.string().min(1, "Date of birth is required"),
});

function LoginPage() {
  const navigate = useNavigate();
  const [nhisNumber, setNhisNumber] = useState("");
  const [dob, setDob] = useState("");
  const [errors, setErrors] = useState<{ nhisNumber?: string; dob?: string }>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = loginSchema.safeParse({ nhisNumber, dob });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      parsed.error.issues.forEach((iss) => {
        fieldErrors[iss.path[0] as keyof typeof errors] = iss.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    // Mock: any valid format succeeds
    authStore.login({
      fullName: "Patient",
      nhisNumber: parsed.data.nhisNumber,
      dob: parsed.data.dob,
    });
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to your NHIS account to manage appointments"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nhis">NHIS Number</Label>
          <Input
            id="nhis"
            placeholder="e.g. NHIS-123456"
            value={nhisNumber}
            onChange={(e) => setNhisNumber(e.target.value)}
            aria-invalid={!!errors.nhisNumber}
          />
          {errors.nhisNumber && (
            <p className="text-xs text-destructive">{errors.nhisNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            aria-invalid={!!errors.dob}
          />
          {errors.dob && <p className="text-xs text-destructive">{errors.dob}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Login
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New user?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-soft)" }}
      />
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-elegant)]">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
