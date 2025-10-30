import express from "express";
import {
  getUserController,
  getUserPastGamesController,
  getUserRankController,
} from "../controllers/userController";

const router = express.Router();

router.get("/:id", getUserController);

router.get("/games/:id", getUserPastGamesController);

router.get("/rank/:id", getUserRankController);

export default router;
