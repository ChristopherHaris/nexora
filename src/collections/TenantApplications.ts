import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig, Access } from "payload";

const isSuperAdminOrCampusAdmin: Access = ({ req: { user } }) => {
  if (isSuperAdmin(user)) return true;
  
  if (user?.roles?.includes("campus_admin") && user?.managedCampus) {
    return {
      campus: {
        equals: user.managedCampus,
      },
    };
  }
  
  return false;
};

export const TenantApplications: CollectionConfig = {
  slug: "tenant-applications",
  admin: {
    useAsTitle: "tenantName",
    group: "Smart canteen",
    defaultColumns: ["tenantName", "applicantName", "campus", "status", "createdAt"],
  },
  access: {
    read: isSuperAdminOrCampusAdmin,
    create: () => true,
    update: isSuperAdminOrCampusAdmin,
    delete: isSuperAdminOrCampusAdmin,
  },
  fields: [
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending Review", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
      admin: {
        position: "sidebar",
        description: "Status pendaftaran",
      },
    },
    {
      name: "tenantName",
      type: "text",
      required: true,
      label: "Nama Tenant/Kantin",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL slug (auto-generated dari nama tenant)",
      },
    },
    {
      name: "campus",
      type: "relationship",
      relationTo: "campuses",
      required: true,
      hasMany: false,
      admin: {
        description: "Kampus lokasi beroperasi",
      },
    },
    {
      name: "locationDetail",
      type: "text",
      required: true,
      admin: {
        description: "Detail lokasi dalam kampus",
      },
    },
    {
      name: "applicantName",
      type: "text",
      required: true,
      label: "Nama Lengkap Pemilik",
    },
    {
      name: "applicantEmail",
      type: "email",
      required: true,
      label: "Email Pemilik",
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: "No. WhatsApp",
    },
    {
      name: "idCardNumber",
      type: "text",
      required: true,
      label: "NIK (Nomor Induk Kependudukan)",
    },
    {
      name: "npwpNumber",
      type: "text",
      label: "NPWP (Opsional)",
      admin: {
        description: "Nomor Pokok Wajib Pajak (jika ada)",
      },
    },
    {
      name: "bankName",
      type: "select",
      required: true,
      options: [
        { label: "Bank BCA", value: "BCA" },
        { label: "Bank Mandiri", value: "MANDIRI" },
        { label: "Bank BNI", value: "BNI" },
        { label: "Bank BRI", value: "BRI" },
        { label: "Bank CIMB Niaga", value: "CIMB" },
        { label: "Bank Permata", value: "PERMATA" },
        { label: "Bank Danamon", value: "DANAMON" },
        { label: "Bank BTN", value: "BTN" },
        { label: "Bank Syariah Indonesia", value: "BSI" },
        { label: "Lainnya", value: "OTHER" },
      ],
      admin: {
        description: "Bank untuk transfer pembayaran",
      },
    },
    {
      name: "bankAccountNumber",
      type: "text",
      required: true,
      label: "Nomor Rekening",
    },
    {
      name: "bankAccountName",
      type: "text",
      required: true,
      label: "Nama Pemegang Rekening",
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Deskripsi singkat tentang tenant",
      },
    },
    {
      name: "menuSample",
      type: "text",
      label: "Contoh Menu Andalan",
      admin: {
        description: "Menu signature yang dijual",
      },
    },
    {
      name: "priceRange",
      type: "text",
      label: "Kisaran Harga",
      admin: {
        description: "Contoh: Rp 10.000 - Rp 50.000",
      },
    },
    {
      name: "idCardPhoto",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Foto KTP",
      admin: {
        description: "Upload foto KTP pemilik",
      },
    },
    {
      name: "npwpPhoto",
      type: "upload",
      relationTo: "media",
      label: "Foto NPWP",
      admin: {
        description: "Upload foto NPWP (opsional)",
      },
    },
    {
      name: "tenantPhoto",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Foto Stan/Kantin",
      admin: {
        description: "Foto tempat usaha",
      },
    },
    {
      name: "businessPermitDocument",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Surat Izin Usaha",
      admin: {
        description: "Surat pernyataan/izin dari pihak kampus (PDF/DOC)",
      },
    },
    {
      name: "additionalDocuments",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      label: "Dokumen Tambahan",
      admin: {
        description: "Dokumen pendukung lainnya (opsional)",
      },
    },
    {
      name: "clerkUserId",
      type: "text",
      label: "Clerk User ID",
      admin: {
        description: "ID user dari Clerk (auto-filled)",
        readOnly: true,
      },
    },
    {
      name: "reviewedBy",
      type: "relationship",
      relationTo: "users",
      label: "Direview Oleh",
      admin: {
        description: "Admin yang melakukan review",
        readOnly: true,
      },
    },
    {
      name: "reviewedAt",
      type: "date",
      label: "Tanggal Review",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        readOnly: true,
      },
    },
    {
      name: "approvalNotes",
      type: "textarea",
      label: "Catatan Review",
      admin: {
        description: "Catatan dari reviewer (alasan approve/reject)",
        condition: (data) => data.status !== "pending",
      },
    },
    {
      name: "rejectionReason",
      type: "select",
      options: [
        { label: "Dokumen tidak lengkap", value: "incomplete_documents" },
        { label: "Dokumen tidak valid", value: "invalid_documents" },
        { label: "Lokasi tidak sesuai", value: "invalid_location" },
        { label: "Tidak memenuhi syarat", value: "requirements_not_met" },
        { label: "Duplikasi pendaftaran", value: "duplicate" },
        { label: "Lainnya", value: "other" },
      ],
      admin: {
        description: "Alasan penolakan",
        condition: (data) => data.status === "rejected",
      },
    },
    {
      name: "createdTenantId",
      type: "relationship",
      relationTo: "tenants",
      label: "Tenant yang Dibuat",
      admin: {
        description: "Reference ke tenant yang dibuat setelah approval",
        readOnly: true,
        condition: (data) => data.status === "approved",
      },
    },
  ],
};

export default TenantApplications;
