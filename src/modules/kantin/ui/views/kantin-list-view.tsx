import { Suspense } from "react";

import { MenuList, MenuListSkeleton } from "../../components/menu-list";
import { MenuSort } from "../../components/menu-sort";

interface Props {
  tenantSlug?: string;
}

export const KantinListView = ({ tenantSlug }: Props) => {
  return (
    <div className="px-4 lg:px-20 py-10 flex flex-col gap-6">
      <MenuSort />
      <Suspense fallback={<MenuListSkeleton />}>
        <MenuList tenantSlug={tenantSlug} />
      </Suspense>
    </div>
  );
};
