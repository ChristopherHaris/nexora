import { cn, generateTenantURL, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCartStore } from "@/modules/canteen/hooks/use-cart-store";

type Props = {
  id: string;
  imageUrl: string;
  caption: string;
  description: string;
  className?: string;
  tenantSlug: string;
  price: number;
};

export default function MenuCard({
  id,
  imageUrl,
  caption,
  description,
  tenantSlug,
  price,
  className,
}: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { openCart } = useCartStore();

  const { mutate, isPending } = useMutation(
    trpc.canteen.addToCart.mutationOptions({
      onSuccess: () => {
        toast.success("Ditambahkan ke keranjang");
        queryClient.invalidateQueries(
          trpc.canteen.getCart.queryFilter()
        );
        openCart(); // Open cart drawer on success
      },
      onError: (err) => {
        if (err.message.includes("UNAUTHORIZED") || !isSignedIn) {
          router.push("/sign-in");
        } else {
          toast.error("Gagal menambahkan ke keranjang");
        }
      }
    })
  );

  return (
    <figure
      className={cn(
        "w-full overflow-hidden rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform flex flex-col h-full",
        className,
      )}
    >
      <Link href={`${generateTenantURL(tenantSlug)}/products/${id}`} className="block">
        <div className="border-b-2 border-black w-full flex-shrink-0 cursor-pointer bg-slate-100 flex items-center justify-center aspect-[4/3]">
          {imageUrl ? (
            <Image
              className="w-full h-full object-cover object-center"
              src={imageUrl}
              alt={caption}
              width={400}
              height={300}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <span className="font-black uppercase tracking-widest text-sm mt-2 opacity-50">No Image</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-grow justify-between">
        <Link href={`${generateTenantURL(tenantSlug)}/products/${id}`} className="block flex-1">
          <figcaption className="text-slate-900 text-lg font-black uppercase tracking-tight mb-2 cursor-pointer leading-tight line-clamp-2">
            {caption}
          </figcaption>
          <div className="text-slate-600 font-bold text-sm cursor-pointer line-clamp-2">
            {description}
          </div>
        </Link>
        <div className="mt-4 flex items-center justify-between border-t-2 border-black pt-4 z-10 relative">
          <span className="font-black text-lg text-[#0F4C3A]">{formatCurrency(price)}</span>
          <Button 
            size="sm"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              if (!isSignedIn) {
                router.push("/sign-in");
                return;
              }
              mutate({ menuItemId: id, quantity: 1 });
            }} 
            className="bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform rounded-md"
          >
            <Plus className="w-4 h-4 mr-1 stroke-[3]" /> Add
          </Button>
        </div>
      </div>
    </figure>
  );
}
