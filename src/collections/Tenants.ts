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
  
  // Let tenant owners read their own tenants (handled by multi-tenant plugin or separate rule)
  // For simplicity, we just return true for read, and restrict mutation
  return false;
};
export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "slug",
    group: "Smart canteen",
  },
  access: {
    read: () => true, // Everyone can read public tenants
    create: isSuperAdminOrCampusAdmin,
    update: isSuperAdminOrCampusAdmin,
    delete: isSuperAdminOrCampusAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nama Tenant",
    },
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
      admin: {
        description: "Subdomain/URL (e.g. [yourstore].nexora.com)",
      },
    },
    {
      name: "campus",
      type: "relationship",
      relationTo: "campuses",
      required: true,
      hasMany: false,
      admin: {
        description: "Lokasi kampus tenant beroperasi",
      },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "locationDetail",
      type: "text",
      admin: {
        description: "Detail lokasi (contoh: canteen Lt. 2 Stan No. 04)",
      },
    },
    {
      name: "phone",
      type: "text",
      admin: {
        description: "No WhatsApp Tenant",
      },
    },
    {
      name: "openTime",
      type: "date",
      admin: {
        date: { pickerAppearance: "timeOnly" },
      },
    },
    {
      name: "closeTime",
      type: "date",
      admin: {
        date: { pickerAppearance: "timeOnly" },
      },
    },
    {
      name: "isOpen",
      type: "checkbox",
      defaultValue: true,
      label: "Buka / Tutup Manual",
    },
    {
      name: "dokuMerchantId",
      type: "text",
      admin: {
        description: "ID Merchant DOKU untuk pembayaran",
      },
    },
    {
      name: "ownerName",
      type: "text",
      label: "Nama Pemilik",
    },
    {
      name: "ownerEmail",
      type: "email",
      label: "Email Pemilik",
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
      name: "npwpNumber",
      type: "text",
      label: "NPWP",
    },
    {
      name: "idCardNumber",
      type: "text",
      label: "NIK",
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
      name: "applicationId",
      type: "relationship",
      relationTo: "tenant-applications",
      label: "Application Reference",
      admin: {
        readOnly: true,
      },
    },
  ],
};

export default Tenants;
