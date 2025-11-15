import { Division, Lang, Season } from "../../../types/gameTypes";
import { prisma } from "../prisma";

export async function getUser(
  userId: string,
  { lang, season, locale }: { lang: Lang; season: Season; locale: Lang }
) {
  try {
    const [user, division] = await Promise.all([
      prisma.user.findUnique({
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
      }),
      getDivision(userId, { lang, season }, locale),
    ]);
    if (!user) return null;

    return { ...user, division };
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
    if (!userRankEntry) return getUnDeterminedDivision();

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
    return getUnfetchedDivision();
  }
};

export const getUnfetchedDivision = (): Division => "unfetched";

const getUnDeterminedDivision = (): Division => "undetermined";

export const determineDivision = (
  position: number,
  totalPlayers: number,
  locale: Lang
): Division => {
  if (position === -1) return getUnDeterminedDivision();

  if (totalPlayers < 10) return getUnDeterminedDivision();

  const percentile = (position + 1) / totalPlayers;

  if (percentile <= 0.1) return "diamond";
  if (percentile <= 0.4) return "gold";
  if (percentile <= 0.7) return "silver";
  if (percentile <= 1.0) return "bronze";

  return getUnDeterminedDivision();
};
