"use client";
import { Calendar } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LexicalConverter } from "../components/lexical-content";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface Props {
  blogId: string;
}

export const BlogView = ({ blogId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.blogs.getOne.queryOptions({ blogId })
  );

  return (
    <div className="px-4 lg:px-20 py-14 flex flex-col gap-4">
      <div className="flex flex-col justify-between lg:items-start">
        <div className="flex flex-col gap-y-5">
          <h1 className="text-4xl font-bold">{data.title}</h1>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <Calendar className="w-5 h-5" />
              <p className="text-lg">{formatDate(data.date)}</p>
            </div>
            <p>|</p>
            <div className="flex pt-2 mb-2">
              <p className="text-md"><span>By </span>{data.author}</p>
            </div>
          </div>
        </div>
        
      </div>

      <div className="my-10">
        {data.content ? (
          <LexicalConverter data={data.content} />
        ) : (
          <p className="text-muted-foreground italic">No content available</p>
        )}
      </div>

      {data.gallery && data.gallery.length > 0 && (
        <div className="w-full flex-col items-center gap-4 flex">
          <Carousel
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {data.gallery.map((item) => (
                <CarouselItem key={item.id} className="pt-1 md:basis-1/2">
                  <div className="p-1">
                    <Card className="md:w-125">
                      <CardContent className="p-0 w-full">
                        {item.image && typeof item.image === "object" && (
                          <div className="relative aspect-video w-full">
                            <Image
                              src={item.image.url || ""}
                              alt={item.image.alt || data.title}
                              fill
                              className="object-cover rounded-base"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  );
};
