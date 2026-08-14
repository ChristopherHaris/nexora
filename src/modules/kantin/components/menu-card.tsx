import { cn, generateTenantURL } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  imageUrl: string;
  caption: string;
  description: string;
  className?: string;
  tenantSlug: string;
};

export default function MenuCard({
  id,
  imageUrl,
  caption,
  description,
  tenantSlug,
  className,
}: Props) {
  return (
    <Link href={`${generateTenantURL(tenantSlug)}/products/${id}`}>
      <figure
        className={cn(
          "w-[180px] md:w-[250px] overflow-hidden rounded-base border-2 border-border bg-main font-base shadow-shadow",
          className,
        )}
      >
        <div>
          <Image
            className="w-full aspect-square object-cover object-top"
            src={imageUrl}
            alt="image"
            width={200}
            height={200}
          />
        </div>
        <figcaption className="border-t-2 text-main-foreground border-border text-base md:text-lg font-bold p-4">
          {caption}
        </figcaption>
        <div className="border-t-2 text-main-foreground border-border text-sm md:text-base p-4">
          {description}
        </div>
      </figure>
    </Link>
  );
}
