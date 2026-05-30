import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Lock, Loader2, CheckCircle2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api-client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password - NHIS Booking" },
      { name: "description", content: "Reset your password using email verification." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequestOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await authApi.requestPasswordReset(email);
      toast.success("Reset code sent to your email");
      setStep("reset");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(email, otp, newPassword);
      toast.success("Password reset successfully! Please login.");
      navigate({ to: "/login" });
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
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
          {/* Back Button */}
          <Link to="/login" className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src="/logo.jpeg"
              alt="NHIS logo"
              className="h-32 w-auto object-contain sm:h-40"
            />
          </div>

          {step === "email" && (
            <>
              {/* Title */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4a7c7e]/10">
                  <KeyRound className="h-8 w-8 text-[#4a7c7e]" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Reset Password
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Enter your email address and we'll send you a verification code
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleRequestOTP} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-14 rounded-lg border-2 border-gray-300 px-4 text-base placeholder:text-gray-500 focus:border-[#4a7c7e] focus:ring-0"
                    disabled={loading}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="h-14 w-full rounded-full bg-[#1e4d7b] text-base font-semibold uppercase tracking-wide text-white shadow-lg transition-all hover:bg-[#163a5f] hover:shadow-xl disabled:opacity-50" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      Send Reset Code
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          {step === "reset" && (
            <>
              {/* Title */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Enter Code & New Password
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Check your email for the 6-digit verification code
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <Label htmlFor="otp" className="text-gray-700">Verification Code</Label>
                  <div className="mt-2 flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 h-14 rounded-lg border-2 border-gray-300 px-4 text-base placeholder:text-gray-500 focus:border-[#4a7c7e] focus:ring-0"
                    disabled={loading}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 h-14 rounded-lg border-2 border-gray-300 px-4 text-base placeholder:text-gray-500 focus:border-[#4a7c7e] focus:ring-0"
                    disabled={loading}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="h-14 w-full rounded-full bg-[#1e4d7b] text-base font-semibold uppercase tracking-wide text-white shadow-lg transition-all hover:bg-[#163a5f] hover:shadow-xl disabled:opacity-50" 
                  disabled={loading || otp.length !== 6 || !newPassword || !confirmPassword}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Reset Password
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleRequestOTP}
                  disabled={loading}
                >
                  Resend Code
                </Button>
              </form>
            </>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="font-medium text-gray-800 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
