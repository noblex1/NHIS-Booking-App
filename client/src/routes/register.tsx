import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { authStore } from "@/lib/auth-store";
import { authApi, ApiError } from "@/lib/api-client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account - NHIS" },
      { name: "description", content: "Create your NHIS account." },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse({ fullName, email, password, confirmPassword });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        password: parsed.data.password,
      });

      authStore.startRegistration({
        fullName: parsed.data.fullName,
        email: parsed.data.email,
      });

      toast.success(response.message || "Verification code sent to your email");
      navigate({ to: "/verify" });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        if (error.status === 409) {
          setErrors({ email: "Email already registered. Please login." });
        }
      } else {
        toast.error("Failed to register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4 py-8"
      style={{ background: "linear-gradient(135deg, #4a7c7e 0%, #2d4a4b 100%)" }}
    >
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-3xl bg-white p-8 shadow-2xl sm:p-12">
          <div className="mb-6 flex justify-center">
            <img src="/logo.jpeg" alt="NHIS logo" className="h-32 w-auto object-contain sm:h-36" />
          </div>

          <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">Create account</h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Full name, email, and password — no NHIS number needed yet.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-300 px-4 text-base focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-300 px-4 text-base focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-300 px-4 text-base focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-300 px-4 text-base focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-[#1e4d7b] text-base font-semibold uppercase text-white"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-gray-800 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
