import { CollectionConfig } from "payload";
import { isSuperAdmin } from "@/lib/access";

export const Campuses: CollectionConfig = {
  slug: "campuses",
  admin: {
    useAsTitle: "name",
    group: "Core",
  },
  access: {
    read: () => true, // Everyone can see campuses
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    {
      name: "code",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Kode kampus unik, misal: UBM-ANCOL",
      },
    },
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: "Nama lengkap kampus, misal: Universitas Bunda Mulia - Kampus Ancol",
      },
    },
    {
      name: "address",
      type: "textarea",
      required: true,
    },
    {
      name: "coordinates",
      type: "point",
      required: false,
      admin: {
        description: "Koordinat lokasi kampus (opsional)",
      },
    },
    {
      name: "city",
      type: "text",
      label: "Kota",
    },
    {
      name: "province",
      type: "text",
      label: "Provinsi",
    },
    {
      name: "postalCode",
      type: "text",
      label: "Kode Pos",
    },
    {
      name: "campusType",
      type: "text",
      label: "Jenis Kampus",
    },
    {
      name: "totalStudents",
      type: "number",
      label: "Jumlah Mahasiswa",
    },
    {
      name: "picName",
      type: "text",
      label: "Nama PIC",
    },
    {
      name: "picEmail",
      type: "email",
      label: "Email PIC",
    },
    {
      name: "picPhone",
      type: "text",
      label: "No. WhatsApp PIC",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "Logo Kampus",
    },
    {
      name: "npwp",
      type: "text",
      label: "NPWP Kampus",
    },
    {
      name: "bankName",
      type: "text",
      label: "Bank",
    },
    {
      name: "bankAccountNumber",
      type: "text",
      label: "Nomor Rekening",
    },
    {
      name: "bankAccountName",
      type: "text",
      label: "Nama Pemegang Rekening",
    },
    {
      name: "websiteUrl",
      type: "text",
      label: "Website",
    },
    {
      name: "applicationId",
      type: "relationship",
      relationTo: "campus-applications",
      label: "Application Reference",
      admin: {
        readOnly: true,
      },
    },
  ],
};

export default Campuses;
