"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";

const Page = () => {
  const trpc = useTRPC();
  const { mutate: verify } = useMutation(
    // @ts-expect-error - checkout router is missing
    trpc.checkout.verify.mutationOptions({
      onSuccess: () => {
        console.log("success");
        window.location.href = "/admin";
      },
      onError: (e) => {
        console.log("error");
        console.log(e);
        window.location.href = "/admin";
      },
    })
  );

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2Icon className="animate-spin text-black" />
    </div>
  );
};

export default Page;
