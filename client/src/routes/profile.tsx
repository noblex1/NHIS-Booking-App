import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore, authStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  LogOut, 
  ChevronRight,
  Bell,
  Lock,
  HelpCircle,
  FileText
} from "lucide-react";
import { authApi } from "@/lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile - NHIS Booking" },
      { name: "description", content: "Manage your NHIS profile and settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    authApi.logout();
    authStore.logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  if (!user) return null;

  // Format date of birth
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 md:pb-8 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6 overflow-hidden border-border bg-card p-0">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-background">
              <User className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{user.fullName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-xs font-medium">
                <Shield className="h-3.5 w-3.5 text-green-600" />
                <span className="text-foreground">Verified Account</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          <InfoRow icon={Shield} label="NHIS Number" value={user.nhisNumber} />
          <InfoRow icon={Mail} label="Email Address" value={user.email} />
          <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(user.dateOfBirth)} />
        </div>
      </Card>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Account Settings */}
        <Card className="overflow-hidden border-border bg-card p-0">
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Account Settings</h3>
          </div>
          <div className="divide-y divide-border">
            <SettingsItem
              icon={Lock}
              label="Change Password"
              description="Update your password"
              onClick={() => toast.info("Password change coming soon")}
            />
            <SettingsItem
              icon={Bell}
              label="Notifications"
              description="Manage notification preferences"
              onClick={() => toast.info("Notification settings coming soon")}
            />
          </div>
        </Card>

        {/* Support */}
        <Card className="overflow-hidden border-border bg-card p-0">
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Support</h3>
          </div>
          <div className="divide-y divide-border">
            <SettingsItem
              icon={HelpCircle}
              label="Help Center"
              description="Get help and support"
              onClick={() => toast.info("Help center coming soon")}
            />
            <SettingsItem
              icon={FileText}
              label="Terms & Privacy"
              description="View our policies"
              onClick={() => toast.info("Terms & Privacy coming soon")}
            />
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full"
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground">
          NHIS Booking System v1.0.0
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}
