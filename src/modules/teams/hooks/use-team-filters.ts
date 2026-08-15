import { useQueryStates } from "nuqs";
import { params } from "../search-params";

export function useTeamsFilters() {
  return useQueryStates(params);
}
