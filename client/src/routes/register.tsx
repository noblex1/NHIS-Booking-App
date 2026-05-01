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
      { title: "Create Account - NHIS Booking" },
      { name: "description", content: "Create your NHIS account to start booking appointments." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const parsed = schema.safeParse({ fullName, dateOfBirth, email, password, confirmPassword });
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
        dateOfBirth: parsed.data.dateOfBirth,
        email: parsed.data.email,
        password: parsed.data.password,
      });
      
      // Store registration data for verification page
      authStore.startRegistration({
        fullName: parsed.data.fullName,
        dateOfBirth: parsed.data.dateOfBirth,
        email: parsed.data.email,
      });
      
      toast.success(response.message || "Verification code sent to your email");
      navigate({ to: "/verify" });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        
        // Handle specific error cases
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
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8" style={{
      background: "linear-gradient(135deg, #4a7c7e 0%, #2d4a4b 100%)"
    }}>
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-3xl bg-white p-8 shadow-2xl sm:p-12">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img
              src="/logo.jpeg"
              alt="NHIS logo"
              className="h-32 w-auto object-contain sm:h-36"
            />
          </div>

          {/* Title */}
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Create Account
          </h1>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-300 px-4 text-base placeholder:text-gray-500 focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>

            <div>
              <Input
                type="date"
                placeholder="Date of Birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="h-12 rounded-lg border-2 border-gray-300 px-4 text-base placeholder:text-gray-500 focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
                aria-invalid={!!errors.dateOfBirth}
              />
              {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-300 px-4 text-base placeholder:text-gray-500 focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-300 px-4 text-base placeholder:text-gray-500 focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-300 px-4 text-base placeholder:text-gray-500 focus:border-[#4a7c7e] focus:ring-0"
                disabled={loading}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <Button 
              type="submit" 
              className="h-12 w-full rounded-full bg-[#1e4d7b] text-base font-semibold uppercase tracking-wide text-white shadow-lg transition-all hover:bg-[#163a5f] hover:shadow-xl disabled:opacity-50" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-gray-800 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
