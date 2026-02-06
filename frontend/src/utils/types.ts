import { Lang } from "@/features/language/utils/types";
import { Season } from "@/features/game/utils/types/gameTypes";

export interface UserSearchParams {
  lang?: Lang;
  season?: Season;
  page?: number;
}
