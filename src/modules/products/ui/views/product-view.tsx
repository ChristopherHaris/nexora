interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Product View</h1>
      <p>Product ID: {productId}</p>
      <p>Tenant: {tenantSlug}</p>
    </div>
  );
};
