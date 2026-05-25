import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminCentresApi, AdminServiceCentre } from "@/lib/admin-api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import { DEFAULT_CENTRE_NAME } from "@/lib/centre";

export const Route = createFileRoute("/admin/_layout/centres")({
  component: CentresPage,
});

function CentresPage() {
  const [centre, setCentre] = useState<AdminServiceCentre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminCentresApi.getAll().then((res) => {
      setCentre(res.centres[0] || null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Service centre</h1>
        <p className="text-sm text-muted-foreground">
          This deployment uses a single NHIA centre for all bookings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {centre?.name || DEFAULT_CENTRE_NAME}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Code:</span> {centre?.code || "TECHIMAN"}
          </p>
          <p>
            <span className="text-muted-foreground">Address:</span> {centre?.address}
          </p>
          <p>
            <span className="text-muted-foreground">Location:</span> {centre?.city},{" "}
            {centre?.region}
          </p>
          {centre?.phone && (
            <p>
              <span className="text-muted-foreground">Phone:</span> {centre.phone}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
