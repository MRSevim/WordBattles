import { Lang } from "@/features/language/helpers/types";
import { Season } from "@/features/game/utils/types/gameTypes";

export interface UserSearchParams {
  lang?: Lang;
  season?: Season;
  page?: number;
}
