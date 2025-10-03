import { Request, Response, NextFunction } from "express";
import { ExtendedRequest } from "../types/types";

const ladderController = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {};

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

module.exports = { ladderController, loginController, logoutController };
