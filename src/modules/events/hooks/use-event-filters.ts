import { useQueryStates } from "nuqs";
import { params } from "../search-params";

export const useEventsFilters = () => {
  return useQueryStates(params);
};
