import {
  createLoader,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const sortValues = ["latest", "oldest"] as const;

export const params = {
  sort: parseAsStringLiteral(sortValues).withDefault("latest"),
  field: parseAsString.withDefault(""),
};

export const loadTeamFilters = createLoader(params);
