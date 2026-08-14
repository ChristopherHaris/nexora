import {
  useQueryStates,
  parseAsStringLiteral,
  parseAsArrayOf,
  parseAsString,
} from "nuqs";

const sortValues = ["latest", "oldest"] as const;

export const params = {
  sort: parseAsStringLiteral(sortValues).withDefault("latest"),
  tags: parseAsArrayOf(parseAsString)
    .withOptions({ clearOnDefault: true })
    .withDefault([]),
};

export const useActivitiesFilters = () => {
  return useQueryStates(params);
};
