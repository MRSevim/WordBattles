import express from "express";
import { ladderController } from "../controllers/ladderController";

const router = express.Router();

router.get("/ladder", ladderController);

export default router;
