import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { authStore, useAuthStore } from "@/lib/auth-store";
import { authApi, ApiError } from "@/lib/api-client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In - NHIS Booking" },
      { name: "description", content: "Sign in to your NHIS account to book appointments." },
    ],
  }),
  component: LoginPage,
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const parsed = loginSchema.safeParse({ email, password });
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
            email: "Invalid credentials",
            password: "Invalid credentials"
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
    <div className="relative flex min-h-screen items-center justify-center px-4" style={{
      background: "linear-gradient(135deg, #4a7c7e 0%, #2d4a4b 100%)"
    }}>
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-3xl bg-white p-8 shadow-2xl sm:p-12">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src="/logo.jpeg"
              alt="NHIS logo"
              className="h-32 w-auto object-contain sm:h-40"
            />
          </div>

          {/* Title */}
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Sign In
          </h1>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="username or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-lg border-2 border-gray-300 px-4 text-base placeholder:text-gray-500 focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-lg border-2 border-gray-300 px-4 text-base placeholder:text-gray-500 focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <Button 
              type="submit" 
              className="h-14 w-full rounded-full bg-[#1e4d7b] text-base font-semibold uppercase tracking-wide text-white shadow-lg transition-all hover:bg-[#163a5f] hover:shadow-xl disabled:opacity-50" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "SIGN IN"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-2 text-center text-sm">
            <p className="text-gray-600">
              Forgot Password?{" "}
              <Link to="/reset-password" className="font-medium text-gray-800 hover:underline">
                Reset
              </Link>
            </p>
            <p className="text-gray-600">
              No Account?{" "}
              <Link to="/register" className="font-medium text-gray-800 hover:underline">
                Request Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
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
