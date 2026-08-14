import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  hideIfEmpty?: boolean;
}

export const CheckoutButton = ({ }: CheckoutButtonProps) => {
  return (
    <Button disabled className="bg-white">
      <ShoppingCartIcon className="text-black mr-2" />
    </Button>
  );
};
