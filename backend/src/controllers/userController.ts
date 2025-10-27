import { RequestHandler } from "express";
import { getUser, getUserPastGames } from "../lib/prisma/dbCalls/userCalls";
import { t } from "../lib/i18n";

export const getUserController: RequestHandler = async (req, res) => {
  const userId = req.params.id;

  const locale = req.cookies.locale;

  if (!userId) {
    res.status(400);
    throw new Error(t(locale, "userIdRequired"));
  }

  const user = await getUser(userId);

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

  const pageSize = 10;

  const games = await getUserPastGames(userId, page, pageSize);

  res.json({
    data: {
      page,
      pageSize,
      games,
    },
  });
};
