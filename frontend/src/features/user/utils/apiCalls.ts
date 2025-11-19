import { fetchFromBackend } from "@/utils/serverHelpers";
import { Lang, Season } from "@/features/game/utils/types/gameTypes";

export const fetchUser = async (id: string, lang: Lang, season: Season) => {
  const response = await fetchFromBackend(
    "/user/" + id + `?lang=${lang}&season=${season}`
  );
  const json = await response.json();

  if (!response.ok) {
    return { data: null };
  }
  return json;
};

export const fetchPastGames = async (
  id: string,
  lang: Lang,
  season: Season
) => {
  const response = await fetchFromBackend(
    "/user/games/" + id + `?lang=${lang}&season=${season}`
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json;
};
