import { ClientUser, getPayload } from "payload";
import configPromise from "@payload-config";
import type { User } from "@/payload-types";

export const isSuperAdmin = (user: ClientUser | User | null) => {
  return Boolean(user?.roles?.includes("super-admin"));
};

// export const canReadOrder = async ({ tenantId }: string) => {
//   if (!tenantId) {
//     return false;
//   }

//   const payload = await getPayload({
//     config: configPromise,
//   });

//   const result = await payload.find({
//     collection: "orders",
//     where: {
//       tenant: {
//         equals: tenantId,
//       },
//     },
//   });

//   return result.totalDocs === 0;
// };
