import { getDivision } from "../../../helpers/misc";
import { Lang, Season } from "../../../types/gameTypes";
import { prisma } from "../prisma";

export async function getUser(userId: string, lang: Lang, season: Season) {
  try {
    const user = await prisma.user.findUnique({
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

    if (!user) return null;

    const stats = user.stats[0] || null;
    const rank = user.ranks[0] || null;

    const eligible = !!(stats && stats.totalGames >= 5);

    return {
      ...user,
      stats,
      rank: eligible ? rank : null,
    };
  } catch (error) {
    console.error(`❌ [getUser] Failed for user ${userId}:`, error);
    return null;
  }
}

export async function getUserPastGames(
  userId: string,
  options: { page: number; pageSize: number; season: Season; lang: Lang }
) {
  const { page, pageSize, season, lang } = options;

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const games = await prisma.game.findMany({
      where: {
        status: "ended", // only finished games
        type: "ranked", // only ranked games
        lang,
        season,
        gamePlayers: {
          some: { userId }, // user participated
        },
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return games;
  } catch (error) {
    console.error(`❌ [getUserPastGames] Failed for user ${userId}:`, error);
    return [];
  }
}

export async function getUserRank(
  userId: string,
  options: { lang: Lang; season: Season }
) {
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

    if (position === -1) return null; // user not ranked

    const userRank = rankedUsers[position];

    return {
      division: getDivision(position, rankedUsers.length),
      points: userRank.rankedPoints,
    };
  } catch (error) {
    console.error(`❌ [getUserRank] Failed for user ${userId}:`, error);
    return null;
  }
}
