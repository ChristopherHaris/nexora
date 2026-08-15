import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Checkout canteen | Nexora",
  description: "Selesaikan pesanan Anda",
};

const Page = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <CheckoutView />;
};

export default Page;
