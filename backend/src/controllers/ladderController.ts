import { RequestHandler } from "express";
import { ExtendedRequest } from "../types/types";
import { Lang, Season } from "../types/gameTypes";
import { prisma } from "../lib/prisma/prisma";
import { determineDivision } from "../lib/prisma/dbCalls/userCalls";

export const ladderController: RequestHandler = async (
  req: ExtendedRequest,
  res,
  next
) => {
  const user = req.user; // ✅ from protect middleware
  const locale = req.cookies.locale;

  const lang = (req.query.lang as Lang) || "en";
  const season = (req.query.season as Season) || "Season1";
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const [totalPlayers, paginatedRanks] = await Promise.all([
    prisma.playerRank.count({
      where: {
        lang,
        season,
        user: {
          stats: { some: { lang, season, totalGames: { gte: 5 } } },
        },
      },
    }),
    prisma.playerRank.findMany({
      where: {
        lang,
        season,
        user: {
          stats: { some: { lang, season, totalGames: { gte: 5 } } },
        },
      },
      orderBy: { rankedPoints: "desc" },
      select: {
        userId: true,
        rankedPoints: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  // ✅ Add division info for each user
  const ladder = paginatedRanks.map((player, index) => {
    const pos = (page - 1) * limit + index;
    return {
      ...player,
      position: pos + 1,
      division: determineDivision(pos, totalPlayers, locale),
    };
  });

  // ✅ Determine current user's rank & division if logged in
  let userRank;
  if (user) {
    const userRankEntry = await prisma.playerRank.findFirst({
      where: {
        userId: user.id,
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

    if (userRankEntry) {
      // Count users with strictly higher points OR same points but lower userId
      const higherCount = await prisma.playerRank.count({
        where: {
          lang,
          season,
          OR: [
            { rankedPoints: { gt: userRankEntry.rankedPoints } },
            {
              rankedPoints: userRankEntry.rankedPoints,
              userId: { lt: user.id }, // tie-breaker: lower userId considered "above"
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

      const position = higherCount; // zero-based
      userRank = {
        rank: position + 1,
        username: user.name,
        rankedPoints: userRankEntry.rankedPoints,
        division: determineDivision(position, totalPlayers, locale),
      };
    }
  }

  return res.status(200).json({
    ladder,
    totalPlayers,
    userRank,
  });
};
