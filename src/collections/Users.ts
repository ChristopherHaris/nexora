import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    group: "Core",
  },
  access: {
    admin: ({ req: { user } }) => {
      return Boolean(
        (user && user.roles?.includes("admin")) ||
        (user && user.roles?.includes("super-admin")),
      );
    },
  },
  auth: true,
  fields: [
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
        // Setelah dibuat, hanya super-admin yang boleh mengubah roles siapa pun
        // (termasuk mendowngrade/upgrade). Ini lapisan proteksi kedua di atas validate().
        update: ({ req: { user } }) => {
          return Boolean(user && user.roles?.includes("super-admin"));
        },
      },
      validate: (value, { req }) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return true; // fallback ke defaultValue ["user"]
        }

        const restrictedRoles = ["admin", "super-admin"];
        const roles = Array.isArray(value) ? value : [value];
        const requestsRestrictedRole = roles.some((role) =>
          restrictedRoles.includes(role as string),
        );

        if (!requestsRestrictedRole) {
          return true; // tenant / organizer / user selalu boleh, siapa saja
        }

        // Sampai sini berarti request mencoba set role admin atau super-admin.
        // Hanya boleh kalau yang melakukan request adalah super-admin yang sudah login
        // (req.user kosong = public sign up -> otomatis ditolak).
        const requestingUser = req.user;
        const requestingIsSuperAdmin = Boolean(
          requestingUser && requestingUser.roles?.includes("super-admin"),
        );

        if (!requestingIsSuperAdmin) {
          return "Role 'admin' dan 'super-admin' hanya dapat diberikan oleh super-admin.";
        }

        return true;
      },
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
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      // Field manual untuk multi-tenant plugin, karena
      // tenantsArrayField.includeDefaultField diset false di payload.config.ts
      name: "tenants",
      type: "array",
      saveToJWT: true,
      admin: {
        description:
          "Stall kantin (tenant) yang bisa diakses user ini beserta role-nya di stall tsb.",
      },
      fields: [
        {
          name: "tenant",
          type: "relationship",
          relationTo: "tenants",
          required: true,
        },
        {
          name: "roles",
          type: "select",
          defaultValue: ["tenant-staff"],
          hasMany: true,
          required: true,
          options: ["tenant-admin", "tenant-staff"],
          admin: {
            description:
              "tenant-admin: kelola menu & slot. tenant-staff: hanya update status pesanan.",
          },
        },
      ],
    },
  ],
};

export default Users;
