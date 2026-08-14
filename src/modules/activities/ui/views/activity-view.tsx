"use client";

import { ArrowUpRight, Calendar } from "lucide-react";
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
import { InstagramEmbed } from "react-social-media-embed";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  activityId: string;
}

export const ActivityView = ({ activityId }: Props) => {
  const [show, setShow] = useState(false);
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.activities.getOne.queryOptions({ activityId })
  );

  return (
    <div className="px-6 lg:px-20 py-14 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-col lg:items-start gap-y-5">
        <h1 className="text-2xl lg:text-4xl font-bold">{data.title}</h1>
        <div className="flex gap-2 items-center">
          <Calendar className="w-5 h-5" />
          <p className="text-base">{formatDate(data.date)}</p>
        </div>
      </div>

      {data.gallery && data.gallery.length == 1 && (
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
                <CarouselItem key={item.id} className="pt-1 md:basis-1/1">
                  <div className="p-1">
                    <Card className="md:w-full overflow-hidden">
                      <CardContent className="p-0 w-full h-full">
                        {item.image && typeof item.image !== "string" && (
                          <div className="relative aspect-video w-full h-full">
                            <Image
                              src={item.image?.url || ""}
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
          </Carousel>
        </div>
      )}

      {/* Image Carousel */}
      {data.gallery && data.gallery.length > 1 && (
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
                    <Card className="w-screen/8 xl:w-150 overflow-hidden">
                      <CardContent className="p-0 w-full h-full">
                        {item.image && typeof item.image !== "string" && (
                          <div className="relative aspect-video w-full h-full">
                            <Image
                              src={item.image?.url || ""}
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
            <CarouselPrevious className="-bottom-12 left-4 top-auto translate-y-0 rotate-0" />
            <CarouselNext className="-bottom-12 right-4 top-auto translate-y-0 rotate-0" />
          </Carousel>
        </div>
      )}

      {/* Content */}
      <div className="md:my-10">
        {data.content ? (
          <LexicalConverter data={data.content} />
        ) : (
          <p className="text-muted-foreground italic">No content available</p>
        )}
      </div>
      <div className="flex flex-col gap-10 md:flex-row justify-between">
        <div className="flex gap-2">
          {data.instagram && (
            <Button onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          )}
          <Link href={data.link} target="_blank">
            <Button>
              Open Link
              <ArrowUpRight />
            </Button>
          </Link>
        </div>
        {show && data.instagram && (
          <div className="md:ml-auto">
            <InstagramEmbed url={data.instagram} width={350} />
          </div>
        )}
      </div>
    </div>
  );
};
