import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Lock, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api-client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export const Route = createFileRoute("/profile/change-password")({
  head: () => ({
    meta: [
      { title: "Change Password - NHIS Booking" },
      { name: "description", content: "Update your account password securely." },
    ],
  }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"request" | "verify" | "change">("request");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequestOTP = async () => {
    setLoading(true);
    try {
      await authApi.requestPasswordChangeOTP();
      toast.success("OTP sent to your email");
      setStep("verify");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await authApi.verifyPasswordChangeOTP(otp);
      toast.success("Code verified");
      setStep("change");
    } catch (error: any) {
      toast.error(error.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
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
      await authApi.changePassword(otp, newPassword);
      toast.success("Password changed successfully");
      navigate({ to: "/profile" });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-6 pb-24 md:pb-8 md:py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/profile" })}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Profile
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Change Password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Secure your account with a new password
        </p>
      </div>

      <Card className="p-6">
        {step === "request" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">Verify Your Identity</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We'll send a verification code to your email address to confirm it's you.
              </p>
            </div>
            <Button
              className="w-full"
              onClick={handleRequestOTP}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Verification Code
                </>
              )}
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">Enter Verification Code</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We've sent a 6-digit code to your email. Enter it below.
              </p>
            </div>
            <div className="flex justify-center">
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
            <Button
              className="w-full"
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleRequestOTP}
              disabled={loading}
            >
              Resend Code
            </Button>
          </div>
        )}

        {step === "change" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">Create New Password</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a strong password to protect your account.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleChangePassword}
              disabled={loading || !newPassword || !confirmPassword}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
