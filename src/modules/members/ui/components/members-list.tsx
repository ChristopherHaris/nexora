"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMembersFilters } from "../../hooks/use-members-filters";
import ImageCard from "@/components/ui/image-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const MembersList = () => {
  const [filters] = useMembersFilters();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.members.getMany.queryOptions({ year: filters.year })
  );

  if (data.totalDocs === 0) {
    return <div className="w-full h-full flex items-center justify-center py-10" >
      No members available
    </div>;
  }
  
  return (
    <div className="w-full">
      <TabsContent
        className="w-full h-full flex flex-col items-center justify-center gap-4"
        value="bph"
      >
        <div className="grid grid-cols-1 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "BPH" && member.position === "Ketua"
            )
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} NEXORA ${member.year}`}
              />
            ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "BPH" && member.position === "Wakil Ketua"
            )
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} NEXORA ${member.year}`}
              />
            ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "BPH" && member.position === "Sekretaris"
            )
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} NEXORA ${member.year}`}
              />
            ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "BPH" && member.position === "Bendahara"
            )
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} NEXORA ${member.year}`}
              />
            ))}
        </div>

        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "BPH" &&
                (member.position === "Bendahara" ||
                  member.position === "Sekretaris")
            )
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} NEXORA ${member.year}`}
              />
            ))}
        </div> */}
      </TabsContent>

      <TabsContent
        className="w-full flex flex-col items-center justify-center gap-4"
        value="medkom"
      >
        <div className="grid grid-cols-2 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "Medkom" &&
                (member.position === "Koordinator" ||
                  member.position === "Wakil Koordinator")
            )
            .sort((a, b) => {
              if (a.position === "Koordinator") return -1;
              if (b.position === "Koordinator") return 1;
              return 0;
            })
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} Media Komunikasi NEXORA ${member.year}`}
              />
            ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "Medkom" && member.position === "Anggota"
            )
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} Media Komunikasi NEXORA ${member.year}`}
              />
            ))}
        </div>
      </TabsContent>

      <TabsContent
        className="w-full flex flex-col items-center justify-center gap-4"
        value="litbang"
      >
        <div className="grid grid-cols-2 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "Litbang" &&
                (member.position === "Koordinator" ||
                  member.position === "Wakil Koordinator")
            )
            .sort((a, b) => {
              if (a.position === "Koordinator") return -1;
              if (b.position === "Koordinator") return 1;
              return 0;
            })
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} Penelitian & Pengembangan NEXORA ${member.year}`}
              />
            ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "Litbang" && member.position === "Anggota"
            )
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} Penelitian & Pengembangan NEXORA ${member.year}`}
              />
            ))}
        </div>
      </TabsContent>

      <TabsContent
        className="w-full flex flex-col items-center justify-center gap-4"
        value="humas"
      >
        <div className="grid grid-cols-2 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "Humas" &&
                (member.position === "Koordinator" ||
                  member.position === "Wakil Koordinator")
            )
            .sort((a, b) => {
              if (a.position === "Koordinator") return -1;
              if (b.position === "Koordinator") return 1;
              return 0;
            })
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} Humas NEXORA ${member.year}`}
              />
            ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "Humas" && member.position === "Anggota"
            )
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} Humas NEXORA ${member.year}`}
              />
            ))}
        </div>
      </TabsContent>

      <TabsContent
        className="w-full flex flex-col items-center justify-center gap-4"
        value="advokasi"
      >
        <div className="grid grid-cols-2 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "Advokasi" &&
                (member.position === "Koordinator" ||
                  member.position === "Wakil Koordinator")
            )
            .sort((a, b) => {
              if (a.position === "Koordinator") return -1;
              if (b.position === "Koordinator") return 1;
              return 0;
            })
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} Advokasi NEXORA ${member.year}`}
              />
            ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-10">
          {data.docs
            .filter(
              (member) =>
                member.division === "Advokasi" && member.position === "Anggota"
            )
            .map((member) => (
              <ImageCard
                key={member.id}
                imageUrl={member.image?.url || ""}
                caption={member.name}
                description={`${member.position} Advokasi NEXORA ${member.year}`}
              />
            ))}
        </div>
      </TabsContent>
    </div>
  );
};

const ImageCardSkeleton = () => (
  <figure
    className={cn(
      "w-[180px] md:w-[250px] overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow"
    )}
  >
    {/* Image skeleton */}
    <div className="w-full aspect-square">
      <Skeleton className="w-full h-full rounded-none" />
    </div>

    {/* Caption skeleton */}
    <div className="border-t-2 border-border p-4">
      <Skeleton className="h-5 md:h-6 w-3/4" />
    </div>

    {/* Description skeleton */}
    <div className="border-t-2 border-border p-4">
      <Skeleton className="h-4 md:h-5 w-full mb-2" />
      <Skeleton className="h-4 md:h-5 w-2/3" />
    </div>
  </figure>
);

export const MembersListSkeleton = () => {
  return (
    <div className="w-full">
      <TabsContent
        className="w-full h-full flex flex-col items-center justify-center gap-4"
        value="bph"
      >
        {/* Ketua - 1 column */}
        <div className="grid grid-cols-1 gap-4 pt-10">
          <ImageCardSkeleton />
        </div>

        {/* Wakil Ketua - 2 columns */}
        <div className="grid grid-cols-2 gap-4 pt-10">
          <ImageCardSkeleton />
          <ImageCardSkeleton />
        </div>

        {/* Bendahara & Sekretaris - 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
          <ImageCardSkeleton />
          <ImageCardSkeleton />
          <ImageCardSkeleton />
          <ImageCardSkeleton />
        </div>
      </TabsContent>

      <TabsContent
        className="w-full flex flex-col items-center justify-center gap-4"
        value="medkom"
      >
        {/* Koordinator & Wakil - 2 columns */}
        <div className="grid grid-cols-2 gap-4 pt-10">
          <ImageCardSkeleton />
          <ImageCardSkeleton />
        </div>

        {/* Anggota - 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
          <ImageCardSkeleton />
          <ImageCardSkeleton />
          <ImageCardSkeleton />
          <ImageCardSkeleton />
        </div>
      </TabsContent>
    </div>
  );
};
