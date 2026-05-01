import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
import { authStore } from "@/lib/auth-store";
import { authApi, ApiError } from "@/lib/api-client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login - NHIS Booking" },
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
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

function LoginPage() {
  const navigate = useNavigate();
  const [nhisNumber, setNhisNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [errors, setErrors] = useState<{ nhisNumber?: string; dateOfBirth?: string }>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const parsed = loginSchema.safeParse({ nhisNumber, dateOfBirth });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      parsed.error.issues.forEach((iss) => {
        fieldErrors[iss.path[0] as keyof typeof errors] = iss.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.login(parsed.data);

      // Store user and token
      authStore.setAuth(response.user, response.token);

      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        
        // Handle specific error cases
        if (error.status === 401) {
          setErrors({ 
            nhisNumber: "Invalid credentials",
            dateOfBirth: "Invalid credentials"
          });
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Login to your NHIS account to manage appointments">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nhis">NHIS Number</Label>
          <Input
            id="nhis"
            className="h-11"
            placeholder="e.g. NHIS-123456"
            value={nhisNumber}
            onChange={(e) => setNhisNumber(e.target.value)}
            aria-invalid={!!errors.nhisNumber}
            disabled={loading}
          />
          {errors.nhisNumber && <p className="text-xs text-destructive">{errors.nhisNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            className="h-11"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            aria-invalid={!!errors.dateOfBirth}
            disabled={loading}
          />
          {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
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
    <div className="relative flex min-h-[calc(100dvh-4rem)] items-start justify-center px-4 py-8 sm:items-center sm:py-12">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-soft)" }}
      />
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-elegant)] sm:p-8">
          <div className="mb-5 rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur-sm">
            <img
              src="/logo.jpeg"
              alt="NHIS logo"
              className="mx-auto h-20 w-auto rounded-xl object-contain sm:h-24"
            />
          </div>
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
