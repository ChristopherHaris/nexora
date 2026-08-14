import { SignUpTenantView } from "@/modules/auth/ui/views/sign-up-tenant-view";
import { caller } from "@/trpc/server";
export const dynamic = 'force-dynamic';
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await caller.auth.session();

  if (session.user) {
    redirect("/");
  }

  return <SignUpTenantView />;
};

export default Page;
