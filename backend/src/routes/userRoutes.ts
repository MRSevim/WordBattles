const { OAuth2Client } = require("google-auth-library");
import { Request, Response, NextFunction } from "express";
const express = require("express");
const { User } = require("../models/userModel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const requireAuth = require("../middlewares/authMiddleware");

// login route
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { googleCredential } = req.body;

    try {
      const ticket = await getDecodedOAuthJwtGoogle(
        googleCredential.credential,
        next
      );
      if (ticket) {
        const { picture, name, email } = ticket.getPayload();

        await User.findOneAndUpdate(
          { email },
          { username: name, image: picture },
          { upsert: true }
        );
        const user = await User.findOne({ email });

        if (!user) {
          res.status(404);
          throw new Error("User is not found");
        }

        // create a token
        const token = jwt.sign({ userId: user._id }, process.env.JWTSECRET);
        let cookieOptions = {
          httpOnly: true,
          secure: process.env.ENV !== "development", // Use secure cookies in production
          sameSite: "strict" as "strict",
          expiresIn: 0,
        };
        res.cookie("jwt", token, cookieOptions);

        res.status(201).json({
          username: name,
          email,
          image: user.image,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);
router.use(requireAuth);
router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    let cookieOptions = {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.ENV !== "development", // Use secure cookies in production
      sameSite: "strict" as "strict",
    };
    res.cookie("jwt", "", cookieOptions);
    res.status(200).json({ message: "Logged out successfully" });
  }
);
/**
 * @description Function to decode Google OAuth token
 * @param token: string
 * @returns ticket object
 */
const getDecodedOAuthJwtGoogle = async (token: string, next: NextFunction) => {
  const CLIENT_ID_GOOGLE = process.env.GOOGLE_AUTH_CLIEND_ID;

  try {
    const client = new OAuth2Client(CLIENT_ID_GOOGLE);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID_GOOGLE,
    });

    return ticket;
  } catch (error) {
    next(error);
  }
};
module.exports = router;
