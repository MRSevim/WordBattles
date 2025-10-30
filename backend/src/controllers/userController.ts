import { RequestHandler } from "express";
import { t } from "../lib/i18n";
import { Lang, Season } from "../types/gameTypes";
import { prisma } from "../lib/prisma/prisma";
import { getDivision, getUser } from "../lib/prisma/dbCalls/userCalls";

export const getUserController: RequestHandler = async (req, res) => {
  const userId = req.params.id;

  const locale = req.cookies.locale;

  if (!userId) {
    res.status(400);
    throw new Error(t(locale, "userIdRequired"));
  }

  const lang = (req.query.lang as Lang) || "en";
  const season = (req.query.season as Season) || "Season1";

  const user = await getUser(userId, lang, season);

  if (!user) {
    res.status(404);
    throw new Error(t(locale, "userNotFound"));
  }

  const stats = user.stats[0] || null;
  const rank = user.ranks[0] || null;

  const eligible = !!(stats && stats.totalGames >= 5);

  res.json({
    data: {
      ...user,
      stats,
      rank: eligible ? rank : null,
    },
  });
};

export const getUserPastGamesController: RequestHandler = async (req, res) => {
  const userId = req.params.id;
  const page = Number(req.query.page) || 1; // default to page 1

  if (!userId) {
    res.status(400);
    throw new Error(t(req.cookies.locale, "userIdRequired"));
  }

  const lang = (req.query.lang as Lang) || "en";
  const season = (req.query.season as Season) || "Season1";
  const pageSize = 10;

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

  res.json({
    data: {
      page,
      pageSize,
      games,
    },
  });
};

export const getUserRankController: RequestHandler = async (req, res) => {
  const userId = req.params.id;
  const locale = req.cookies.locale;
  if (!userId) {
    res.status(400);
    throw new Error(t(locale, "userIdRequired"));
  }
  const lang = (req.query.lang as Lang) || "en";
  const season = (req.query.season as Season) || "Season1";

  const user = await getUser(userId, lang, season);

  if (!user) {
    res.status(404);
    throw new Error(t(locale, "userNotFound"));
  }

  const userRank = user.ranks[0];
  const division = await getDivision(user.id, { lang, season }, locale);

  res.json({
    data: {
      division,
      points: userRank?.rankedPoints ?? 3000,
    },
  });
};
