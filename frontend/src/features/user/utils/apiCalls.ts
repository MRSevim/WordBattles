import { fetchFromBackend } from "@/utils/fetcher";
import { Lang, Season } from "../../../../../types";

export const fetchUser = async (id: string, lang: Lang, season: Season) => {
  const response = await fetchFromBackend(
    "/user/" + id + `?lang=${lang}&season=${season}`
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
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
