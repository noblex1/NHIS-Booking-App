import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { authStore, useAuthStore } from "@/lib/auth-store";
import { AuthShell } from "./login";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify Code — NHIS Booking" },
      { name: "description", content: "Verify your phone number with a one-time code." },
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
    const code = digits.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the full code");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const nhisNumber = `NHIS-${Math.floor(100000 + Math.random() * 900000)}`;
    authStore.completeRegistration(nhisNumber);
    toast.success(`Account verified! Your NHIS #: ${nhisNumber}`);
    navigate({ to: "/dashboard" });
  };

  const resend = () => {
    setSeconds(60);
    setDigits(Array(OTP_LENGTH).fill(""));
    toast.success("New verification code sent");
  };

  return (
    <AuthShell
      title="Verify your phone"
      subtitle={`Enter the ${OTP_LENGTH}-digit code we sent${pendingRegistration?.phone ? ` to ${pendingRegistration.phone}` : ""}`}
    >
      <form onSubmit={onVerify} className="space-y-6">
        <div
          className="flex justify-center gap-2 sm:gap-3"
          onPaste={handlePaste}
        >
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
              className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border-2 border-input bg-background text-center text-xl font-semibold text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Verify & Continue
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
              className="font-medium text-primary hover:underline"
            >
              Resend code
            </button>
          )}
        </div>
      </form>
    </AuthShell>
  );
}
