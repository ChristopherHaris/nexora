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
      name: "clerkId",
      type: "text",
      unique: true,
      admin: {
        description: "Clerk User ID for syncing",
      },
    },
    {
      admin: {
        position: "sidebar",
        description: "User roles based on Blueprint",
      },
      name: "roles",
      type: "select",
      defaultValue: ["student"],
      hasMany: true,
      options: ["super-admin", "admin", "campus_admin", "partner_tenant", "partner_eo", "student"],
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: "managedCampus",
      type: "relationship",
      relationTo: "campuses",
      hasMany: false,
      admin: {
        description: "Campus managed by this user (only for campus_admin)",
        condition: (data) => {
          if (Array.isArray(data.roles)) {
            return data.roles.includes("campus_admin");
          }
          return data.roles === "campus_admin";
        },
      },
    },
    {
      name: "campus",
      type: "relationship",
      relationTo: "campuses",
      hasMany: false,
      admin: {
        description: "Campus where this user belongs (for students)",
        position: "sidebar",
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
