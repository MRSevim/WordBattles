import express from "express";
import {
  getAllUsersController,
  getUserController,
  getUserPastGamesController,
} from "../controllers/userController";

const router = express.Router();

router.get("/:id", getUserController);

router.get("/", getAllUsersController);

router.get("/games/:id", getUserPastGamesController);

export default router;
