"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Eye, Loader2, Store, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function ApprovalsPage() {
  const trpc = useTRPC();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [reviewDialog, setReviewDialog] = useState<"approve" | "reject" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const {
    data: tenantApplications,
    isLoading: loadingTenants,
    refetch: refetchTenants,
  } = useQuery(trpc.superAdmin.approval.getPendingTenantApplications.queryOptions({ limit: 50 }));

  const {
    data: campusApplications,
    isLoading: loadingCampuses,
    refetch: refetchCampuses,
  } = useQuery(trpc.superAdmin.approval.getPendingCampusApplications.queryOptions({ limit: 50 }));

  const approveTenantMutation = useMutation({
    ...trpc.superAdmin.approval.approveTenantApplication.mutationOptions(),
    onSuccess: () => {
      toast.success("Aplikasi tenant berhasil disetujui!");
      refetchTenants();
      closeReviewDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menyetujui aplikasi");
    },
  });

  const rejectTenantMutation = useMutation({
    ...trpc.superAdmin.approval.rejectTenantApplication.mutationOptions(),
    onSuccess: () => {
      toast.success("Aplikasi tenant berhasil ditolak");
      refetchTenants();
      closeReviewDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menolak aplikasi");
    },
  });

  const approveCampusMutation = useMutation({
    ...trpc.superAdmin.approval.approveCampusApplication.mutationOptions(),
    onSuccess: () => {
      toast.success("Aplikasi kampus berhasil disetujui!");
      refetchCampuses();
      closeReviewDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menyetujui aplikasi");
    },
  });

  const rejectCampusMutation = useMutation({
    ...trpc.superAdmin.approval.rejectCampusApplication.mutationOptions(),
    onSuccess: () => {
      toast.success("Aplikasi kampus berhasil ditolak");
      refetchCampuses();
      closeReviewDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal menolak aplikasi");
    },
  });

  const closeReviewDialog = () => {
    setReviewDialog(null);
    setSelectedApplication(null);
    setReviewNotes("");
    setRejectionReason("");
    setAdminEmail("");
    setAdminPassword("");
  };

  const handleApprove = () => {
    if (!selectedApplication) return;

    if (selectedApplication.type === "tenant") {
      approveTenantMutation.mutate({
        applicationId: selectedApplication.id,
        notes: reviewNotes,
      });
    } else {
      if (!adminEmail || !adminPassword) {
        toast.error("Email dan password admin kampus harus diisi");
        return;
      }
      approveCampusMutation.mutate({
        applicationId: selectedApplication.id,
        notes: reviewNotes,
        adminEmail,
        adminPassword,
      });
    }
  };

  const handleReject = () => {
    if (!selectedApplication || !rejectionReason) {
      toast.error("Alasan penolakan harus dipilih");
      return;
    }

    if (selectedApplication.type === "tenant") {
      rejectTenantMutation.mutate({
        applicationId: selectedApplication.id,
        reason: rejectionReason as any,
        notes: reviewNotes,
      });
    } else {
      rejectCampusMutation.mutate({
        applicationId: selectedApplication.id,
        reason: rejectionReason as any,
        notes: reviewNotes,
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase text-slate-900">Approval Center</h1>
        <p className="text-slate-600 font-bold mt-2">
          Review dan proses pendaftaran kampus dan tenant kantin
        </p>
      </div>

      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tenants" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Tenant ({tenantApplications?.totalDocs || 0})
          </TabsTrigger>
          <TabsTrigger value="campuses" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Kampus ({campusApplications?.totalDocs || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          {loadingTenants ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : tenantApplications?.docs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500 font-bold">Tidak ada aplikasi tenant pending</p>
              </CardContent>
            </Card>
          ) : (
            tenantApplications?.docs.map((app: any) => (
              <Card key={app.id} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-black uppercase">{app.tenantName}</CardTitle>
                      <CardDescription className="font-bold">
                        {app.applicantName} • {app.applicantEmail}
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Pending Review
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-black text-slate-500 uppercase text-xs">Kampus</p>
                      <p className="font-bold">{typeof app.campus === "object" ? app.campus.name : app.campus}</p>
                    </div>
                    <div>
                      <p className="font-black text-slate-500 uppercase text-xs">Lokasi</p>
                      <p className="font-bold">{app.locationDetail}</p>
                    </div>
                    <div>
                      <p className="font-black text-slate-500 uppercase text-xs">WhatsApp</p>
                      <p className="font-bold">{app.phone}</p>
                    </div>
                    <div>
                      <p className="font-black text-slate-500 uppercase text-xs">NIK</p>
                      <p className="font-bold">{app.idCardNumber}</p>
                    </div>
                  </div>

                  {app.description && (
                    <div>
                      <p className="font-black text-slate-500 uppercase text-xs mb-1">Deskripsi</p>
                      <p className="text-sm font-bold text-slate-700">{app.description}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2"
                      onClick={() => {
                        setSelectedApplication({ ...app, type: "tenant" });
                        setReviewDialog("approve");
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Setujui
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2 text-red-600 hover:text-red-700"
                      onClick={() => {
                        setSelectedApplication({ ...app, type: "tenant" });
                        setReviewDialog("reject");
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Tolak
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="campuses" className="space-y-4">
          {loadingCampuses ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : campusApplications?.docs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500 font-bold">Tidak ada aplikasi kampus pending</p>
              </CardContent>
            </Card>
          ) : (
            campusApplications?.docs.map((app: any) => (
              <Card key={app.id} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-black uppercase">{app.campusName}</CardTitle>
                      <CardDescription className="font-bold">
                        {app.campusCode} • {app.city}, {app.province}
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Pending Review
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-black text-slate-500 uppercase text-xs">PIC</p>
                      <p className="font-bold">{app.applicantName}</p>
                      <p className="text-xs font-bold text-slate-600">{app.applicantPosition}</p>
                    </div>
                    <div>
                      <p className="font-black text-slate-500 uppercase text-xs">Email PIC</p>
                      <p className="font-bold">{app.applicantEmail}</p>
                    </div>
                    <div>
                      <p className="font-black text-slate-500 uppercase text-xs">WhatsApp</p>
                      <p className="font-bold">{app.applicantPhone}</p>
                    </div>
                    <div>
                      <p className="font-black text-slate-500 uppercase text-xs">Mahasiswa</p>
                      <p className="font-bold">{app.totalStudents?.toLocaleString() || "-"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-slate-500 uppercase text-xs mb-1">Alamat</p>
                    <p className="text-sm font-bold text-slate-700">{app.address}</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2"
                      onClick={() => {
                        setSelectedApplication({ ...app, type: "campus" });
                        setReviewDialog("approve");
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Setujui
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2 text-red-600 hover:text-red-700"
                      onClick={() => {
                        setSelectedApplication({ ...app, type: "campus" });
                        setReviewDialog("reject");
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Tolak
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={reviewDialog === "approve"} onOpenChange={(open) => !open && closeReviewDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-black uppercase">Setujui Aplikasi</DialogTitle>
            <DialogDescription className="font-bold">
              {selectedApplication?.type === "tenant"
                ? `Setujui pendaftaran tenant "${selectedApplication?.tenantName}"`
                : `Setujui pendaftaran kampus "${selectedApplication?.campusName}"`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedApplication?.type === "campus" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail" className="font-black uppercase text-xs">
                    Email Admin Kampus *
                  </Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@kampus.ac.id"
                    className="border-2"
                  />
                  <p className="text-xs text-slate-500 font-bold">
                    Admin kampus akan menggunakan email ini untuk login
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword" className="font-black uppercase text-xs">
                    Password Admin Kampus *
                  </Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    className="border-2"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes" className="font-black uppercase text-xs">
                Catatan (Opsional)
              </Label>
              <Textarea
                id="notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Tambahkan catatan atau instruksi tambahan..."
                className="border-2 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeReviewDialog} className="border-2">
              Batal
            </Button>
            <Button
              onClick={handleApprove}
              disabled={
                approveTenantMutation.isPending ||
                approveCampusMutation.isPending ||
                (selectedApplication?.type === "campus" && (!adminEmail || !adminPassword))
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {(approveTenantMutation.isPending || approveCampusMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Setujui Aplikasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reviewDialog === "reject"} onOpenChange={(open) => !open && closeReviewDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-black uppercase text-red-600">Tolak Aplikasi</DialogTitle>
            <DialogDescription className="font-bold">
              {selectedApplication?.type === "tenant"
                ? `Tolak pendaftaran tenant "${selectedApplication?.tenantName}"`
                : `Tolak pendaftaran kampus "${selectedApplication?.campusName}"`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="font-black uppercase text-xs">
                Alasan Penolakan *
              </Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Pilih alasan penolakan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incomplete_documents">Dokumen tidak lengkap</SelectItem>
                  <SelectItem value="invalid_documents">Dokumen tidak valid</SelectItem>
                  {selectedApplication?.type === "campus" && (
                    <SelectItem value="not_accredited">Kampus tidak terakreditasi</SelectItem>
                  )}
                  {selectedApplication?.type === "tenant" && (
                    <SelectItem value="invalid_location">Lokasi tidak sesuai</SelectItem>
                  )}
                  <SelectItem value="requirements_not_met">Tidak memenuhi syarat</SelectItem>
                  <SelectItem value="duplicate">Duplikasi pendaftaran</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rejectNotes" className="font-black uppercase text-xs">
                Detail Penolakan *
              </Label>
              <Textarea
                id="rejectNotes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Jelaskan alasan penolakan dengan detail..."
                className="border-2 min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeReviewDialog} className="border-2">
              Batal
            </Button>
            <Button
              onClick={handleReject}
              disabled={
                rejectTenantMutation.isPending ||
                rejectCampusMutation.isPending ||
                !rejectionReason ||
                !reviewNotes
              }
              className="bg-red-600 hover:bg-red-700"
            >
              {(rejectTenantMutation.isPending || rejectCampusMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Tolak Aplikasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
