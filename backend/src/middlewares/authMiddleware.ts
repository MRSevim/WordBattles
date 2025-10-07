import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { RequestHandler } from "express";
import { ExtendedRequest } from "../types/types";

export const protect: RequestHandler = async (
  req: ExtendedRequest,
  res,
  next
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) throw new Error("Not authorized, Sign in please");

    // ✅ Attach the session or user to req if you need it later
    req.user = session.user;

    next();
  } catch (error) {
    next(error);
  }
};
