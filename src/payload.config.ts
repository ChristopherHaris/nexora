// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { uploadthingStorage } from "@payloadcms/storage-uploadthing";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { isSuperAdmin } from "./lib/access";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Blogs } from "./collections/Blogs";
import { Members } from "./collections/Members";
import { Activities } from "./collections/Activities";
import { Tags } from "./collections/Tags";

// canteen
import { Tenants } from "./collections/Tenants";
import { MenuItems } from "./collections/MenuItems";
import { PickupSlots } from "./collections/PickupSlots";
import { Carts } from "./collections/Carts";
import { CartItems } from "./collections/CartItems";
import { Orders } from "./collections/Orders";
import { OrderItems } from "./collections/OrderItems";
import { Reviews } from "./collections/Reviews";

// event
import { Events } from "./collections/Events";
import { EventRegistrations } from "./collections/EventRegistrations";

// teammate
import { Teams } from "./collections/Teams";
import { TeamPositions } from "./collections/TeamPositions";
import { TeamApplications } from "./collections/TeamApplications";
import { UserSkills } from "./collections/UserSkills";

// lost & found
import { LostItems } from "./collections/LostItems";
import { FoundItems } from "./collections/FoundItems";
import { ItemMatches } from "./collections/ItemMatches";
import { ItemChatMessages } from "./collections/ItemChatMessages";

// carrer
import { Majors } from "./collections/Majors";
import { CareerPaths } from "./collections/CareerPaths";
import { CareerSkills } from "./collections/CareerSkills";
import { UserCareerProgress } from "./collections/UserCareerProgress";

// admin
import { AdminActions } from "./collections/AdminActions";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Blogs,
    Members,
    Activities,
    Tags,
    Tenants,
    MenuItems,
    PickupSlots,
    Carts,
    CartItems,
    Orders,
    OrderItems,
    Reviews,
    Events,
    EventRegistrations,
    Teams,
    TeamPositions,
    TeamApplications,
    UserSkills,
    LostItems,
    FoundItems,
    ItemMatches,
    ItemChatMessages,
    Majors,
    CareerPaths,
    CareerSkills,
    UserCareerProgress,
    AdminActions,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin({
      collections: {
        // Setiap collection di sini otomatis dapat field relasi "tenant"
        // (relationTo: "tenants") + access control yang membatasi user
        // hanya melihat/mengubah data milik stall (tenant) miliknya sendiri.
        "menu-items": {},
        "pickup-slots": {},
        carts: {},
        orders: {},
        reviews: {},
        // cart-items & order-items sengaja tidak didaftarkan di sini:
        // scoping-nya cukup ikut lewat relasi ke carts/orders yang sudah
        // di-scope, jadi tidak perlu field "tenant" ganda.
      },
      tenantsArrayField: {
        // false karena field "tenants" di Users didefinisikan manual
        // (lihat collections/Users.ts) supaya bisa custom sub-field "roles"
        // per stall (tenant-admin / tenant-staff).
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: "public-read",
      },
    }),
  ],
});
