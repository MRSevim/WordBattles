"use server";

import { Season } from "@/features/game/utils/types/gameTypes";
import { Lang } from "@/features/language/utils/types";
import { fetchFromBackend } from "@/utils/serverHelpers";

export const fetchLadder = async ({
  page,
  limit,
  lang,
  season,
}: {
  page: number;
  limit: number;
  lang: Lang;
  season: Season;
}) => {
  const response = await fetchFromBackend(
    `/ladder/ladder?page=${page}&limit=${limit}&lang=${lang}&season=${season}`,
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
  return json;
};
