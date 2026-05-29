import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminOfficialsApi, AdminApiError, NhisOfficial } from "@/lib/admin-api-client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Search,
  Filter,
  Loader2,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { DEFAULT_CENTRE_NAME } from "@/lib/centre";

export const Route = createFileRoute("/admin/_layout/officials")({
  head: () => ({
    meta: [
      { title: "NHIS Officials Management - NHIS Admin" },
      { name: "description", content: "Manage NHIS officials" },
    ],
  }),
  component: OfficialsManagementPage,
});

const officialBaseSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().optional(),
});

type OfficialForm = z.infer<typeof officialBaseSchema>;

function OfficialsManagementPage() {
  const [officials, setOfficials] = useState<NhisOfficial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<NhisOfficial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OfficialForm>({
    resolver: zodResolver(officialBaseSchema),
  });

  const fetchOfficials = async () => {
    setLoading(true);
    try {
      const response = await adminOfficialsApi.getAll({
        page,
        limit: 20,
        search,
        status: status === "all" ? undefined : status,
      });
      setOfficials(response.officials);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error("Failed to load officials");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficials();
  }, [page, status]);

  const handleSearch = () => {
    setPage(1);
    fetchOfficials();
  };

  const handleOpenDialog = (official?: NhisOfficial) => {
    if (official) {
      setEditingOfficial(official);
      reset({
        fullName: official.fullName,
        email: official.email,
        phone: official.phone,
        password: "",
      });
    } else {
      setEditingOfficial(null);
      reset({
        fullName: "",
        email: "",
        phone: "",
        password: "",
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingOfficial(null);
    reset();
  };

  const onSubmit = async (data: OfficialForm) => {
    if (!editingOfficial && (!data.password || data.password.length < 6)) {
      toast.error("Password must be at least 6 characters for new officials");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...data };
      if (editingOfficial && !payload.password) {
        delete payload.password;
      }

      if (editingOfficial) {
        await adminOfficialsApi.update(editingOfficial._id, payload);
        toast.success("Official updated successfully");
      } else {
        await adminOfficialsApi.create({
          ...payload,
          password: payload.password!,
        });
        toast.success(
          "Official created — they can sign in at /official/login with this email and password",
        );
      }
      handleCloseDialog();
      fetchOfficials();
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await adminOfficialsApi.delete(deleteId);
      toast.success("Official deleted successfully");
      setDeleteId(null);
      fetchOfficials();
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error(error.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (official: NhisOfficial) => {
    try {
      await adminOfficialsApi.update(official._id, {
        isActive: !official.isActive,
      });
      toast.success(`Official ${official.isActive ? "deactivated" : "activated"}`);
      fetchOfficials();
    } catch (error) {
      if (error instanceof AdminApiError) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">NHIS Officials Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create centre staff accounts for {DEFAULT_CENTRE_NAME}. Officials sign in at{" "}
            <Link to="/official/login" className="text-primary hover:underline">
              /official/login
            </Link>
            .
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          Add Official
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">
            Search
          </Button>
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Officials</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : officials.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No officials found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Centre</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {officials.map((official) => (
                  <TableRow key={official._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{official.fullName}</p>
                        <p className="text-xs text-muted-foreground">{official.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{official.email}</TableCell>
                    <TableCell className="text-sm">
                      {typeof official.assignedCentreId === "object"
                        ? official.assignedCentreId?.name
                        : DEFAULT_CENTRE_NAME}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleStatus(official)}
                        className="inline-flex items-center gap-1 text-sm"
                      >
                        {official.isActive ? (
                          <span className="inline-flex items-center gap-1 text-secondary">
                            <CheckCircle className="h-4 w-4" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <XCircle className="h-4 w-4" />
                            Inactive
                          </span>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(official)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(official._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingOfficial ? "Edit Official" : "Add New Official"}
            </DialogTitle>
            <DialogDescription>
              {editingOfficial
                ? "Update details or set a new password. Assigned to Techiman Municipal by default."
                : "Creates a login for the official portal. They will process today's centre bookings only."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  disabled={submitting}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled={submitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  disabled={submitting}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="password">
                  {editingOfficial ? "New password (optional)" : "Login password"}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={editingOfficial ? "Leave blank to keep current" : "Min. 6 characters"}
                    {...register("password")}
                    disabled={submitting}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Centre: {DEFAULT_CENTRE_NAME} (auto-assigned)
            </p>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editingOfficial ? "Updating..." : "Creating..."}
                  </>
                ) : editingOfficial ? (
                  "Update Official"
                ) : (
                  "Create Official"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Official</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this official? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
