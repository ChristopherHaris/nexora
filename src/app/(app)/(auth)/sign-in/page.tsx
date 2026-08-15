import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const Page = async () => {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }

  return <SignInView />;
};

export default Page;
