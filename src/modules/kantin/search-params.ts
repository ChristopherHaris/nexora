import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";

export const params = {
  tenant: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
  type: parseAsStringEnum(["food", "drink", "snack", "dessert"]).withOptions({
    clearOnDefault: true,
  }),
  search: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
};

export const loadMenuFilters = createLoader(params);
