import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { BlogsGetManyOutputSingle } from "../../types";

type Props = {
  data: BlogsGetManyOutputSingle;
  className?: string;
};

export default function BlogCard({ data }: Props) {
  return (
    <Link prefetch href={`/blog/${data.id}`}>
      <Card className="w-full max-w-sm bg-main mx-auto py-6">
        <CardHeader>
          <CardTitle className="text-xl text-main-foreground">{data.title}</CardTitle>
          <CardDescription className="text-main-foreground">
            {data.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="items-start">
          <div className="flex flex-row gap-2 mt-4 text-start text-sm text-main-foreground">
            <Calendar className="w-5 h-5" />
            <p>{formatDate(data.date)}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export const BlogCardSkeleton = () => {
  return (
    <div className="w-[350px] overflow-hidden rounded-base border-2 border-border font-base flex mb-2 bg-amber-300 animate-pulse shadow-shadow h-[150px]"></div>
  );
};
