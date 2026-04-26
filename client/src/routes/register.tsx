import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { authStore } from "@/lib/auth-store";
import { authApi, ApiError } from "@/lib/api-client";
import { AuthShell } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register - NHIS Booking" },
      { name: "description", content: "Create your NHIS account to start booking appointments." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().trim().email("Enter a valid email address"),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const parsed = schema.safeParse({ fullName, dateOfBirth, email });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErrors(fe);
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register(parsed.data);
      
      // Store registration data for verification page
      authStore.startRegistration(parsed.data);
      
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
    <AuthShell title="Create your account" subtitle="Just a few details to get you started">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            className="h-11"
            placeholder="Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            aria-invalid={!!errors.fullName}
            disabled={loading}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
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

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            className="h-11"
            type="email"
            placeholder="jane.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            disabled={loading}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Send Verification Code
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
