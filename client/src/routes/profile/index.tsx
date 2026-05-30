import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuthStore, authStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  Mail,
  Shield,
  LogOut,
  ChevronRight,
  Bell,
  Lock,
  HelpCircle,
  FileText,
} from "lucide-react";
import { authApi } from "@/lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/")({
  head: () => ({
    meta: [
      { title: "Profile - NHIS Booking" },
      { name: "description", content: "Manage your NHIS profile and settings." },
    ],
  }),
  component: ProfileIndexPage,
});

function ProfileIndexPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    authStore.logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 md:pb-8 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

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
          <InfoRow icon={Mail} label="Email Address" value={user.email} />
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="overflow-hidden border-border bg-card p-0">
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Account Settings</h3>
          </div>
          <div className="divide-y divide-border">
            <SettingsItem
              icon={Lock}
              label="Change Password"
              description="Update your password"
              to="/profile/change-password"
            />
            <SettingsItem
              icon={Bell}
              label="Notifications"
              description="Manage notification preferences"
              to="/profile/notifications"
            />
          </div>
        </Card>

        <Card className="overflow-hidden border-border bg-card p-0">
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Support</h3>
          </div>
          <div className="divide-y divide-border">
            <SettingsItem
              icon={HelpCircle}
              label="Help Center"
              description="Get help and support"
              to="/profile/help"
            />
            <SettingsItem
              icon={FileText}
              label="Terms & Privacy"
              description="View our policies"
              to="/profile/terms"
            />
          </div>
        </Card>

        <Button
          variant="destructive"
          className="w-full"
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>

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
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  to:
    | "/profile/change-password"
    | "/profile/notifications"
    | "/profile/help"
    | "/profile/terms";
}) {
  return (
    <Link to={to} className="block">
      <div className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Link>
  );
}
