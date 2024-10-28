const { OAuth2Client } = require("google-auth-library");
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();

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

        res.status(201).json({
          message: "ok",
        });
      }
    } catch (error) {
      next(error);
    }
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
