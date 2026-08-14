"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useBlogsFilters } from "../../hooks/use-blog-filters";
import { DEFAULT_LIMIT } from "@/constants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
import BlogCard, { BlogCardSkeleton } from "./blog-card";

export const BlogList = () => {
  const [filters] = useBlogsFilters();
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.blogs.getMany.infiniteQueryOptions(
        { ...filters, limit: DEFAULT_LIMIT },
        {
          getNextPageParam: (lastPage) =>
            lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
        }
      )
    );

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg py-10">
        <InboxIcon className="text-black"/>
        <p className="text-base font-medium text-black">No blogs found</p>
      </div>
    );
  }

  const allBlogs = data.pages.flatMap((page) => page.docs);

  const blogsByYear = allBlogs.reduce(
    (acc, blog) => {
      const year = new Date(blog.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(blog);
      return acc;
    },
    {} as Record<number, typeof allBlogs>
  );

  const sortedYears = Object.keys(blogsByYear)
    .map(Number)
    .sort((a, b) => {
      if (filters.sort === "oldest") {
        return a - b;
      } else {
        return b - a;
      }
    });

  return (
    <>
      <div className="flex flex-col gap-12">
        {sortedYears.map((year) => (
          <div key={year} className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold">{year}</h2>

            {/* Blogs Grid for this year */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {blogsByYear[year].map((blog) => (
                <BlogCard key={blog.id} data={blog} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            className="font-medium disabled:opacity-50 text-black hover:text-white bg-white"
            onClick={() => fetchNextPage()}
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
};

export const BlogListSkeleton = () => {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        {/* Skeleton year header */}
        <div className="h-11 w-28 bg-gray-200 animate-pulse rounded"></div>

        {/* Skeleton grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {Array.from({ length: DEFAULT_LIMIT }).map((_, idx) => (
            <BlogCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};
