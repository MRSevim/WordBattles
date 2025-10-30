import { RequestHandler } from "express";
import {
  getUser,
  getUserPastGames,
  getUserRank,
} from "../lib/prisma/dbCalls/userCalls";
import { t } from "../lib/i18n";
import { Lang, Season } from "../types/gameTypes";

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

  res.json({ data: user });
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

  const games = await getUserPastGames(userId, {
    page,
    pageSize,
    lang,
    season,
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
  if (!userId) {
    res.status(400);
    throw new Error(t(req.cookies.locale, "userIdRequired"));
  }
  const lang = (req.query.lang as Lang) || "en";
  const season = (req.query.season as Season) || "Season1";
  const rank = await getUserRank(userId, { lang, season });

  res.json({
    data: rank,
  });
};
