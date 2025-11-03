import { Lang } from "@/features/language/helpers/types";
import { Season } from "../../../../../types";

export interface UserSearchParams {
  lang?: Lang;
  season?: Season;
  page?: number;
}
