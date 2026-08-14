import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const sortValues = ["latest", "oldest"] as const;

export const params = {
  sort: parseAsStringLiteral(sortValues).withDefault("latest"),
  tags: parseAsArrayOf(parseAsString)
    .withOptions({ clearOnDefault: true })
    .withDefault([]),
};

export const loadActivityFilters = createLoader(params);
