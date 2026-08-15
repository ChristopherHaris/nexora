import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const CampusApplications: CollectionConfig = {
  slug: "campus-applications",
  admin: {
    useAsTitle: "campusName",
    group: "Core",
    defaultColumns: ["campusName", "applicantName", "status", "createdAt"],
  },
  access: {
    read: ({ req }) => isSuperAdmin(req.user),
    create: () => true,
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
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
        description: "Status pendaftaran kampus",
      },
    },
    {
      name: "campusName",
      type: "text",
      required: true,
      label: "Nama Kampus",
    },
    {
      name: "campusCode",
      type: "text",
      required: true,
      unique: true,
      label: "Kode Kampus",
      admin: {
        description: "Kode unik kampus (contoh: UBM-ANCOL)",
      },
    },
    {
      name: "address",
      type: "textarea",
      required: true,
      label: "Alamat Lengkap",
    },
    {
      name: "city",
      type: "text",
      required: true,
      label: "Kota",
    },
    {
      name: "province",
      type: "text",
      required: true,
      label: "Provinsi",
    },
    {
      name: "postalCode",
      type: "text",
      required: true,
      label: "Kode Pos",
    },
    {
      name: "campusType",
      type: "select",
      required: true,
      options: [
        { label: "Universitas", value: "university" },
        { label: "Institut", value: "institute" },
        { label: "Sekolah Tinggi", value: "college" },
        { label: "Politeknik", value: "polytechnic" },
        { label: "Akademi", value: "academy" },
      ],
      admin: {
        description: "Jenis institusi pendidikan",
      },
    },
    {
      name: "accreditation",
      type: "select",
      options: [
        { label: "A", value: "A" },
        { label: "B", value: "B" },
        { label: "C", value: "C" },
        { label: "Baik Sekali", value: "excellent" },
        { label: "Baik", value: "good" },
        { label: "Unggul", value: "superior" },
      ],
      admin: {
        description: "Akreditasi kampus",
      },
    },
    {
      name: "totalStudents",
      type: "number",
      label: "Jumlah Mahasiswa",
      admin: {
        description: "Estimasi jumlah mahasiswa aktif",
      },
    },
    {
      name: "applicantName",
      type: "text",
      required: true,
      label: "Nama Lengkap PIC",
      admin: {
        description: "Person in Charge dari pihak kampus",
      },
    },
    {
      name: "applicantPosition",
      type: "text",
      required: true,
      label: "Jabatan PIC",
      admin: {
        description: "Jabatan di kampus",
      },
    },
    {
      name: "applicantEmail",
      type: "email",
      required: true,
      label: "Email PIC",
    },
    {
      name: "applicantPhone",
      type: "text",
      required: true,
      label: "No. WhatsApp PIC",
    },
    {
      name: "idCardNumber",
      type: "text",
      required: true,
      label: "NIK PIC",
    },
    {
      name: "campusNpwp",
      type: "text",
      label: "NPWP Kampus",
      admin: {
        description: "Nomor Pokok Wajib Pajak institusi",
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
      label: "Bank Kampus",
    },
    {
      name: "bankAccountNumber",
      type: "text",
      required: true,
      label: "Nomor Rekening Kampus",
    },
    {
      name: "bankAccountName",
      type: "text",
      required: true,
      label: "Nama Pemegang Rekening",
    },
    {
      name: "websiteUrl",
      type: "text",
      label: "Website Kampus",
      admin: {
        description: "URL website resmi kampus",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Deskripsi Kampus",
      admin: {
        description: "Deskripsi singkat tentang kampus",
      },
    },
    {
      name: "expectedTenants",
      type: "number",
      label: "Estimasi Jumlah Tenant",
      admin: {
        description: "Perkiraan jumlah kantin/tenant yang akan bergabung",
      },
    },
    {
      name: "campusLogo",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Logo Kampus",
    },
    {
      name: "idCardPhoto",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Foto KTP PIC",
    },
    {
      name: "npwpPhoto",
      type: "upload",
      relationTo: "media",
      label: "Foto NPWP Kampus",
    },
    {
      name: "campusPhotos",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      required: true,
      label: "Foto Kampus",
      admin: {
        description: "Foto gedung kampus (min 2 foto)",
      },
    },
    {
      name: "officialLetter",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Surat Resmi Kampus",
      admin: {
        description: "Surat permohonan kerjasama (PDF/DOC)",
      },
    },
    {
      name: "npsn",
      type: "text",
      label: "NPSN/Nomor Induk",
      admin: {
        description: "Nomor Pokok Sekolah Nasional atau nomor induk lainnya",
      },
    },
    {
      name: "accreditationCertificate",
      type: "upload",
      relationTo: "media",
      label: "Sertifikat Akreditasi",
      admin: {
        description: "Dokumen akreditasi kampus",
      },
    },
    {
      name: "additionalDocuments",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      label: "Dokumen Tambahan",
    },
    {
      name: "clerkUserId",
      type: "text",
      label: "Clerk User ID",
      admin: {
        readOnly: true,
      },
    },
    {
      name: "reviewedBy",
      type: "relationship",
      relationTo: "users",
      label: "Direview Oleh",
      admin: {
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
        condition: (data) => data.status !== "pending",
      },
    },
    {
      name: "rejectionReason",
      type: "select",
      options: [
        { label: "Dokumen tidak lengkap", value: "incomplete_documents" },
        { label: "Dokumen tidak valid", value: "invalid_documents" },
        { label: "Kampus tidak terakreditasi", value: "not_accredited" },
        { label: "Tidak memenuhi syarat minimum", value: "requirements_not_met" },
        { label: "Duplikasi pendaftaran", value: "duplicate" },
        { label: "Lainnya", value: "other" },
      ],
      admin: {
        condition: (data) => data.status === "rejected",
      },
    },
    {
      name: "createdCampusId",
      type: "relationship",
      relationTo: "campuses",
      label: "Kampus yang Dibuat",
      admin: {
        readOnly: true,
        condition: (data) => data.status === "approved",
      },
    },
    {
      name: "createdAdminId",
      type: "relationship",
      relationTo: "users",
      label: "Admin Kampus yang Dibuat",
      admin: {
        readOnly: true,
        condition: (data) => data.status === "approved",
      },
    },
  ],
};

export default CampusApplications;
