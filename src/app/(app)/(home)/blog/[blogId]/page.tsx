import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { caller, getQueryClient, trpc } from "@/trpc/server";
import { BlogView } from "@/modules/blogs/ui/views/blog-view";

import type { Metadata } from "next";

interface Props {
  params: Promise<{ blogId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogId } = await params;

  const data = await caller.blogs.getOne({ blogId });

  return {
    title: data.title,
    description: data.description,
    generator: "Sema FTD",
    applicationName: "Website Sema FTD",
    referrer: "origin-when-cross-origin",
    keywords: [
      "Sema FTD",
      "Senat Mahasiswa FTD",
      "UBM",
      "FTD",
      "Senat Mahasiswa FTD UBM",
      "Senat Mahasiswa UBM",
      "Activity Sema FTD",
      "Activity Senat Mahasiswa FTD",
      "Activity Senat Mahasiswa FTD UBM",
      "Activity Senat Mahasiswa UBM",
    ],
    creator: data.author,
    publisher: data.author,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

const Page = async ({ params }: Props) => {
  const { blogId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.blogs.getOne.queryOptions({ blogId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogView blogId={blogId} />
    </HydrationBoundary>
  );
};

export default Page;
