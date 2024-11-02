import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../models/userModel";
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const protect = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    token = req.cookies.jwt;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWTSECRET);

      req.user = await User.findById(decoded.userId);

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
