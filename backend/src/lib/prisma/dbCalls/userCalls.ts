import { prisma } from "../prisma";

export async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        rankedPoints: true,
        createdAt: true,
        stats: true, // includes full PlayerStats
      },
    });

    return user;
  } catch (error) {
    console.error(`❌ [getUser] Failed for user ${userId}:`, error);
    return null;
  }
}

export async function getUserPastGames(
  userId: string,
  page: number = 1,
  pageSize: number = 10
) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const games = await prisma.game.findMany({
      where: {
        playerIds: { has: userId },
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
