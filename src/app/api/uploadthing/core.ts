import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const authed = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId };
};

export const ourFileRouter = {
  menuImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authed)
    .onUploadComplete(({ metadata, file }) => ({ url: file.ufsUrl, userId: metadata.userId })),

  idCardPhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authed)
    .onUploadComplete(({ metadata, file }) => ({ url: file.ufsUrl, userId: metadata.userId })),

  npwpPhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authed)
    .onUploadComplete(({ metadata, file }) => ({ url: file.ufsUrl, userId: metadata.userId })),

  tenantPhoto: f({ image: { maxFileSize: "8MB", maxFileCount: 5 } })
    .middleware(authed)
    .onUploadComplete(({ metadata, file }) => ({ url: file.ufsUrl, userId: metadata.userId })),

  document: f({ pdf: { maxFileSize: "16MB", maxFileCount: 3 }, "application/msword": { maxFileSize: "16MB", maxFileCount: 3 } })
    .middleware(authed)
    .onUploadComplete(({ metadata, file }) => ({ url: file.ufsUrl, userId: metadata.userId })),

  campusLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authed)
    .onUploadComplete(({ metadata, file }) => ({ url: file.ufsUrl, userId: metadata.userId })),

  campusPhoto: f({ image: { maxFileSize: "8MB", maxFileCount: 5 } })
    .middleware(authed)
    .onUploadComplete(({ metadata, file }) => ({ url: file.ufsUrl, userId: metadata.userId })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
