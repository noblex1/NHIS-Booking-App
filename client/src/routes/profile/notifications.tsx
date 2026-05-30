import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Bell, Mail, MessageSquare, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { notificationsApi } from "@/lib/api-client";
import { requireUserSession } from "@/lib/route-guards";

export const Route = createFileRoute("/profile/notifications")({
  beforeLoad: requireUserSession,
  head: () => ({
    meta: [
      { title: "Notifications - NHIS Booking" },
      { name: "description", content: "Manage your notification preferences." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await notificationsApi.getPreferences();
      const prefs = response.preferences;
      setEmailNotifications(prefs.emailNotifications);
      setAppointmentReminders(prefs.appointmentReminders);
      setStatusUpdates(prefs.statusUpdates);
      setPromotions(prefs.promotions);
    } catch (error: any) {
      toast.error(error.message || "Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await notificationsApi.updatePreferences({
        emailNotifications,
        appointmentReminders,
        statusUpdates,
        promotions,
      });
      toast.success("Notification preferences saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 md:pb-8 md:py-8">
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
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you want to be notified about your appointments
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <NotificationToggle
              label="Email Notifications"
              description="Receive all notifications via email"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Appointment Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Stay updated about your bookings
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <NotificationToggle
              label="Appointment Reminders"
              description="Get reminded 24 hours before your centre visit"
              checked={appointmentReminders}
              onCheckedChange={setAppointmentReminders}
              icon={Calendar}
              disabled={!emailNotifications}
            />
            <NotificationToggle
              label="Status Updates"
              description="Receive updates when your application status changes"
              checked={statusUpdates}
              onCheckedChange={setStatusUpdates}
              icon={MessageSquare}
              disabled={!emailNotifications}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Marketing</h3>
              <p className="text-sm text-muted-foreground">
                News and updates from NHIS
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <NotificationToggle
              label="Promotions & Updates"
              description="Receive news about NHIS services and updates"
              checked={promotions}
              onCheckedChange={setPromotions}
              disabled={!emailNotifications}
            />
          </div>
        </Card>

        <Button className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  );
}

function NotificationToggle({
  label,
  description,
  checked,
  onCheckedChange,
  icon: Icon,
  disabled = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-lg border border-border p-4 ${disabled ? "opacity-60" : ""}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <Label htmlFor={label} className="cursor-pointer font-medium">
            {label}
          </Label>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}
