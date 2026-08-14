"use client";

import { useQueryStates } from "nuqs";

import { params } from "../search-params";

export const useMenuFilters = () => {
  return useQueryStates(params);
};
