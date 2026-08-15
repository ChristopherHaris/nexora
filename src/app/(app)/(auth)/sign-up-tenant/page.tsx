import { SignUpTenantView } from "@/modules/auth/ui/views/sign-up-tenant-view";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const Page = async () => {
  const { userId } = await auth();

  if (userId) {
    redirect("/partner");
  }

  return <SignUpTenantView />;
};

export default Page;
