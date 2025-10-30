import { Lang, Season } from "../../../types/gameTypes";
import { t } from "../../i18n";
import { prisma } from "../prisma";

export async function getUser(userId: string, lang: Lang, season: Season) {
  try {
    const user = prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        stats: {
          where: { lang, season },
          take: 1,
        },
        ranks: {
          where: { lang, season },
          take: 1,
        },
      },
    });

    return user;
  } catch (error) {
    console.error(`❌ [getUser] Failed for user ${userId}:`, error);
    return null;
  }
}

// Helper: determine division based on percentage
export const getDivision = async (
  userId: string,
  options: { season: Season; lang: Lang },
  locale: Lang
) => {
  const { lang, season } = options;
  try {
    // 1. Get all users who played 5 or more games in this lang and season
    const rankedUsers = await prisma.playerRank.findMany({
      where: {
        lang,
        season,
        user: {
          stats: {
            some: {
              lang,
              season,
              totalGames: {
                gte: 5,
              },
            },
          },
        },
      },
      orderBy: { rankedPoints: "desc" },
      select: {
        userId: true,
        rankedPoints: true,
      },
    });

    // Find the user's position
    const position = rankedUsers.findIndex((u) => u.userId === userId);

    if (position === -1) return t(locale, "division.unranked");

    const totalPlayers = rankedUsers.length;
    if (totalPlayers < 10) return t(locale, "division.unranked");

    const percentile = (position + 1) / totalPlayers;

    if (percentile <= 0.1) return t(locale, "division.diamond");
    if (percentile <= 0.4) return t(locale, "division.gold");
    if (percentile <= 0.7) return t(locale, "division.silver");
    if (percentile <= 1.0) return t(locale, "division.bronze");

    return t(locale, "division.unranked");
  } catch (error) {
    console.error(`❌ [getDivision] Failed for user ${userId}:`, error);
    return t(locale, "division.unfetched");
  }
};
