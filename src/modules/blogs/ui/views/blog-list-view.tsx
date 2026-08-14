import { Suspense } from "react";

import { BlogList, BlogListSkeleton } from "../components/blog-list";
import { BlogsSort } from "../components/blog-sort";

export const BlogListView = () => {
  return (
    <div className="relative mx-auto h-full max-w-[800px] px-4 md:px-8">
      <div className="my-10">
        <BlogsSort/>
        <div className="my-10">
          <Suspense fallback={<BlogListSkeleton/>}>
            <BlogList />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
