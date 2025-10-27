import express from "express";
import {
  getUserController,
  getUserPastGamesController,
} from "../controllers/userController";

const router = express.Router();

router.get("/:id", getUserController);

router.get("/games/:id", getUserPastGamesController);

export default router;
