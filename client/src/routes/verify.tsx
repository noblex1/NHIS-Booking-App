import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { authStore, useAuthStore } from "@/lib/auth-store";
import { authApi, ApiError } from "@/lib/api-client";
import { AuthShell } from "./login";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify Code - NHIS Booking" },
      { name: "description", content: "Verify your email with a one-time code." },
    ],
  }),
  component: VerifyPage,
});

const OTP_LENGTH = 6;

function VerifyPage() {
  const navigate = useNavigate();
  const { pendingRegistration } = useAuthStore();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!pendingRegistration) {
      navigate({ to: "/register" });
    }
  }, [pendingRegistration, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const setDigit = (idx: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
    if (v && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
  };

  const handleKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    e.preventDefault();
    const arr = Array(OTP_LENGTH).fill("");
    text.split("").forEach((c, i) => (arr[i] = c));
    setDigits(arr);
    inputRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pendingRegistration) {
      toast.error("Registration data not found. Please register again.");
      navigate({ to: "/register" });
      return;
    }

    const code = digits.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the full code");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.verifyOtp({
        email: pendingRegistration.email,
        otpCode: code,
      });

      // Store user and token
      authStore.completeRegistration(response.user, response.token);

      // Show success message
      toast.success("Account verified successfully! Redirecting to dashboard...");
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 500);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        
        // Clear digits on error
        if (error.status === 400 || error.status === 429) {
          setDigits(Array(OTP_LENGTH).fill(""));
          inputRefs.current[0]?.focus();
        }
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!pendingRegistration) {
      toast.error("Registration data not found. Please register again.");
      navigate({ to: "/register" });
      return;
    }

    setResending(true);

    try {
      const response = await authApi.resendOtp({
        email: pendingRegistration.email,
      });

      setSeconds(60);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      toast.success(response.message || "New verification code sent");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to resend code. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      title="Verify your email"
      subtitle={`Enter the ${OTP_LENGTH}-digit code we sent${pendingRegistration?.email ? ` to ${pendingRegistration.email}` : ""}`}
    >
      <form onSubmit={onVerify} className="space-y-6">
        <div className="mx-auto grid max-w-[340px] grid-cols-6 gap-2 sm:max-w-none sm:gap-3" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              disabled={loading || resending}
              className="h-12 w-full rounded-xl border-2 border-input bg-background text-center text-lg font-semibold text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:opacity-50 sm:h-14 sm:text-xl"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading || resending}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Verify and Continue
            </>
          )}
        </Button>

        <div className="text-center text-sm">
          {seconds > 0 ? (
            <span className="text-muted-foreground">
              Resend code in <span className="font-semibold text-foreground">{seconds}s</span>
            </span>
          ) : (
            <button 
              type="button" 
              onClick={resend} 
              disabled={resending}
              className="font-medium text-primary hover:underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Check your spam folder if you don't see the email
        </p>
      </form>
    </AuthShell>
  );
}
