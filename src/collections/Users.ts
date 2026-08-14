import { isSuperAdmin } from "@/lib/access";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";

const defaultTenantsArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    update: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read: () => true,
    update: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user),
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !isSuperAdmin(user),
    group: "Core",
  },
  access: {
    read: () => true,
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) {
        return true;
      }
      return req.user?.id === id;
    },
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  auth: true,
  fields: [
    {
      name: "username",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "fullName",
      type: "text",
      required: true,
    },
    {
      name: "major",
      type: "text",
      admin: {
        description: "Jurusan, dipakai Career Compass",
      },
    },
    {
      name: "studentId",
      type: "text",
      admin: {
        description: "NIM, buat verifikasi email kampus",
      },
    },
    {
      admin: {
        position: "sidebar",
        description:
          "Publik hanya bisa memilih tenant/organizer/user saat sign up — lihat validate di bawah.",
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "admin", "tenant", "organizer", "user"],
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      ...defaultTenantsArrayField,
      admin: {
        ...(defaultTenantsArrayField?.admin || {}),
        position: "sidebar",
      },
    },
  ],
};

export default Users;
