import { Division, Lang, Season } from "../../../types/gameTypes";
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
): Promise<Division> => {
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
    if (!userRankEntry) return getUnrankedDivision(locale);

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
    return getUnfetchedDivision(locale);
  }
};

export const getUnfetchedDivision = (locale: Lang): Division => ({
  division: "unfetched",
  label: t(locale, "division.unfetched"),
});

const getUnrankedDivision = (locale: Lang): Division => ({
  division: "unranked",
  label: t(locale, "division.unranked"),
});

export const determineDivision = (
  position: number,
  totalPlayers: number,
  locale: Lang
): Division => {
  if (position === -1) return getUnrankedDivision(locale);

  if (totalPlayers < 10) return getUnrankedDivision(locale);

  const percentile = (position + 1) / totalPlayers;

  if (percentile <= 0.1)
    return {
      division: "diamond",
      label: t(locale, "division.diamond"),
    };
  if (percentile <= 0.4)
    return {
      division: "gold",
      label: t(locale, "division.gold"),
    };
  if (percentile <= 0.7)
    return {
      division: "silver",
      label: t(locale, "division.silver"),
    };
  if (percentile <= 1.0)
    return {
      division: "bronze",
      label: t(locale, "division.bronze"),
    };

  return getUnrankedDivision(locale);
};
