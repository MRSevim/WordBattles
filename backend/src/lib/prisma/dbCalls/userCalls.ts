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
    // 1️⃣ Get the user's rankedPoints
    const userRankEntry = await prisma.playerRank.findFirst({
      where: {
        userId,
        lang,
        season,
        user: {
          stats: {
            some: {
              lang,
              season,
              totalGames: { gte: 5 },
            },
          },
        },
      },
      select: { rankedPoints: true },
    });

    if (!userRankEntry) return t(locale, "division.unranked");

    const userPoints = userRankEntry.rankedPoints;

    // 2️⃣ Count users with strictly higher points OR same points but lower userId
    const position = await prisma.playerRank.count({
      where: {
        lang,
        season,
        OR: [
          { rankedPoints: { gt: userPoints } },
          {
            rankedPoints: userPoints,
            userId: { lt: userId }, // tie-breaker
          },
        ],
        user: {
          stats: {
            some: {
              lang,
              season,
              totalGames: { gte: 5 },
            },
          },
        },
      },
    });

    // 3️⃣ Count total eligible players
    const totalPlayers = await prisma.playerRank.count({
      where: {
        lang,
        season,
        user: {
          stats: {
            some: {
              lang,
              season,
              totalGames: { gte: 5 },
            },
          },
        },
      },
    });

    return determineDivision(position, totalPlayers, locale);
  } catch (error) {
    console.error(`❌ [getDivision] Failed for user ${userId}:`, error);
    return t(locale, "division.unfetched");
  }
};

export const determineDivision = (
  position: number,
  totalPlayers: number,
  locale: Lang
) => {
  if (position === -1) return t(locale, "division.unranked");

  if (totalPlayers < 10) return t(locale, "division.unranked");

  const percentile = (position + 1) / totalPlayers;

  if (percentile <= 0.1) return t(locale, "division.diamond");
  if (percentile <= 0.4) return t(locale, "division.gold");
  if (percentile <= 0.7) return t(locale, "division.silver");
  if (percentile <= 1.0) return t(locale, "division.bronze");

  return t(locale, "division.unranked");
};
