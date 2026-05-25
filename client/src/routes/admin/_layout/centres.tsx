import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminCentresApi, AdminApiError, AdminServiceCentre } from "@/lib/admin-api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/_layout/centres")({
  component: CentresPage,
});

function CentresPage() {
  const [centres, setCentres] = useState<AdminServiceCentre[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    region: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminCentresApi.getAll();
      setCentres(res.centres);
    } catch {
      toast.error("Failed to load centres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    setSaving(true);
    try {
      await adminCentresApi.create(form);
      toast.success("Centre added");
      setOpen(false);
      setForm({ name: "", code: "", address: "", city: "", region: "", phone: "" });
      load();
    } catch (e) {
      if (e instanceof AdminApiError) toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service centres</h1>
          <p className="text-sm text-muted-foreground">
            Locations where citizens complete registration or renewal
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add centre
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>City / Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {centres.map((c) => (
                <TableRow key={c._id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="font-mono text-sm">{c.code}</TableCell>
                  <TableCell>
                    {c.city}, {c.region}
                  </TableCell>
                  <TableCell>{c.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={async () => {
                        try {
                          await adminCentresApi.delete(c._id);
                          toast.success("Centre removed");
                          load();
                        } catch (e) {
                          if (e instanceof AdminApiError) toast.error(e.message);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add service centre</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {(["name", "code", "address", "city", "region", "phone"] as const).map((field) => (
              <div key={field}>
                <Label>{field}</Label>
                <Input
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={submit} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
