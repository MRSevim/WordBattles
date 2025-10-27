import { RequestHandler } from "express";
import { getUser, getUserPastGames } from "../lib/prisma/dbCalls/userCalls";

export const getUserController: RequestHandler = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400);
    throw new Error("User ID is required.");
  }

  const user = await getUser(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.json(user);
};

export const getUserPastGamesController: RequestHandler = async (req, res) => {
  const userId = req.params.id;
  const page = Number(req.query.page) || 1; // default to page 1

  if (!userId) {
    res.status(400);
    throw new Error("User ID is required.");
  }

  const pageSize = 10;

  const games = await getUserPastGames(userId, page, pageSize);

  res.json({
    page,
    pageSize,
    games,
  });
};
