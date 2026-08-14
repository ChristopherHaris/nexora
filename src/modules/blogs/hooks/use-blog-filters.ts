import {
  useQueryStates,
  parseAsStringLiteral,
} from "nuqs";

const sortValues = ["latest", "oldest"] as const;

export const params = {
  sort: parseAsStringLiteral(sortValues).withDefault("latest"),
};

export const useBlogsFilters = () => {
  return useQueryStates(params);
};
